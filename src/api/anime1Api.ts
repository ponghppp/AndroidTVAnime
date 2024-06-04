import axios from "axios";
import SelectItem from "../class/SelectItem";
import commonApi from "./commonApi";
import HTMLParser from 'fast-html-parser';

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
        var root = HTMLParser.parse(html);
        let metas = root.querySelectorAll('meta');
        let meta = metas.find(m => m.attributes['name'] == 'keywords');
        let seriesName = meta.attributes['content'];
        var videos = commonApi.getTagHtml(html, 'video');
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var animeName = animeNames[i];
            var animeId = animeIds[i];
            var apireq = commonApi.getTagAttr(video, 'data-apireq', ' ');
            let item: SelectItem = { id: animeId, title: animeName, header: seriesName, data: { apireq } } as SelectItem
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
        let data = 'd=' + apireq;
        let config = { method: 'post', headers: { "Content-Type": 'application/x-www-form-urlencoded' } };
        let resp = await axios.post(url, data, config);
        let json = resp.data;
        let cookie = resp.headers["set-cookie"]
        return { url: 'https:' + json['s'][0]['src'], cookie: cookie[0], referer: '' }
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
            let item = { id: id, title: name, header: name } as SelectItem;
            list.push(item);
        }
        return list;
    },
    searchAnime: async (page: number = 1, input: string) => {
        var url = 'https://anime1.me/page/' + page + '?s=' + input;
        let resp = await axios.get(url);
        let html = resp.data;
        var articles = commonApi.getTagHtml(html, 'article');
        let list: SelectItem[] = [];
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            var tagAs = commonApi.getTagHtml(article, 'a');
            var animeId = commonApi.getSearchAnimeId(tagAs[0], 'href');
            var regex = /[0-9]/g;
            var found = animeId.match(regex);
            if (found.length != animeId.length) {
                continue;
            }
            var footers = commonApi.getTagHtml(article, 'footer');
            var span = commonApi.getTagHtmlWithFirstAttr(footers[0], 'span', 'class="cat-links"');
            var firstA = commonApi.getTagHtml(span[0], 'a')[0];
            var categoryName = commonApi.getInnerHtml(firstA);
            var categoryId = commonApi.getTagAttr(firstA, 'href', ' ').replace('https://anime1.me/category/', '');
            if (!list.find(l => l.id == categoryId)) {
                list.push({ id: categoryId, title: categoryName, header: categoryName } as SelectItem)
            }
        }
        //has previous page
        if (page <= 3 && html.includes('nav-previous')) {
            let prev_list = list.concat(await anime1Api.searchAnime(page + 1, input));
            for (var i = 0; i < prev_list.length; i++) {
                if (!list.map(l => l.id).includes(prev_list[i].id)) {
                    list.push(prev_list[i]);
                }
            }
        }
        return list;
    },
    getSeriesIdByCategoryId: async (categoryId: string) => {
        let url = 'https://anime1.me/category/' + categoryId;
        let resp = await axios.get(url);
        let html = resp.data;
        let startIdx = html.indexOf('/?cat=');
        let endIdx = html.indexOf('"', startIdx);
        let catStr = html.substring(startIdx, endIdx);
        let seriesId = catStr.split('=')[1];
        return seriesId;
    }
}
export default anime1Api;