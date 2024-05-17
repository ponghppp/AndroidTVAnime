import axios from "axios";
import SelectItem from "../class/SelectItem";
import commonApi from "./commonApi";

const anime1Api = {
    getAnimeList: async () => {
        let url = 'https://d1zquzjgwo9yb.cloudfront.net/';
        let animeList = await axios.get(url);
        let json = animeList.data;
        let filteredJson = json.filter(j => !j[1].includes('a href')).slice(0, 200);
        let list: SelectItem[] = filteredJson.map((v, i) => ({ id: v[0], title: v[1] + ' ' + v[2], header: v[1] } as SelectItem));
        return list;
    },
    animeSeries: async (seriesId: string, prev_url: string = '') => {
        let list: SelectItem[] = [];
        var url = 'https://anime1.me';
        if (prev_url == '') {
            url += ('/?cat=' + seriesId);
        } else {
            url = prev_url;
        }
        let resp = await axios.get(url);
        let html = resp.data;
        var animeNames = [];
        var animeIds = [];
        var h2s = commonApi.getTagHtml(html, 'h2');

        for (var i = 0; i < h2s.length; i++) {
            var tagAs = commonApi.getTagHtml(h2s[i], 'a');
            if (tagAs.length == 0) {
                continue;
            }
            var animeName = commonApi.getInnerHtml(tagAs[0]);
            animeNames.push(animeName);

            var href = commonApi.getTagAttr(tagAs[0], 'href', ' ');
            var animeId = href.substring(href.lastIndexOf('/') + 1);
            animeIds.push(animeId);
        }

        var videos = commonApi.getTagHtml(html, 'video');
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var animeName = animeNames[i];
            var animeId = animeIds[i];
            var apireq = commonApi.getTagAttr(video, 'data-apireq', ' ');
            let item: SelectItem = { id: animeId, title: animeName, header: animeName, data: { apireq } }
            list.push(item);
        }
        //has prev page
        if (html.includes('nav-previous')) {
            var navDiv = commonApi.getTagHtmlWithFirstAttr(html, 'div', 'class="nav-previous"');
            var tagAs = commonApi.getTagHtml(navDiv[0], 'a');
            var p_href = commonApi.getTagAttr(tagAs[0], 'href', ' ');
            list = list.concat(await anime1Api.animeSeries('', p_href));
        }
        return list;
    },
    downloadVideo: async (apireq: string) => {
        let url = 'https://v.anime1.me/api';
        let resp = await axios.post(url,
            'd=' + apireq,
            {
                method: 'post',
                headers: { "Content-Type": 'application/x-www-form-urlencoded' }
            }
        );
        let json = resp.data;
        let cookie = resp.headers["set-cookie"]
        return { url: 'https:' + json['s'][0]['src'], cookie: cookie[0] }
    },
    getSeasonAnime: async (season: string) => {
        var url = 'https://anime1.me/' + season;
        let resp = await axios.get(url);
        let html = resp.data;
        let tagAs = commonApi.getTagHtmlWithFirstAttr(html, 'a', 'href="/?cat=');
        let list: SelectItem[] = [];
        for (var i = 0; i < tagAs.length; i++) {
            var id = commonApi.getTagAttr(tagAs[i], 'href', '"').split('=')[1];
            var name = commonApi.getInnerHtml(tagAs[i]);
            let item = { id: id, title: name, header: name} as SelectItem;
            list.push(item);
        }
        return list;
    }
}
export default anime1Api;