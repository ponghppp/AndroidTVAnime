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
        let root = HTMLParser.parse(html);
        let metas = root.querySelectorAll('meta');
        let meta = metas.find(m => m.attributes['name'] == 'keywords');
        let seriesName = meta.attributes['content'];
        let h2s = root.querySelectorAll('h2');
        let videos = root.querySelectorAll('video');
        let items: SelectItem = h2s.filter(h => h.querySelector('a') != undefined).map((h, i) => ({
            id: h.querySelector('a').attributes['href'].split('/').pop(),
            title: h.querySelector('a').text,
            header: seriesName,
            data: { apireq: videos[i].attributes['data-apireq'] }
        } as SelectItem));
        list = list.concat(items);
        //has prev page
        if (html.includes('nav-previous')) {
            let navDiv = root.querySelector('div.nav-previous');
            let p_href = navDiv.querySelector('a').attributes['href'];
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
        let root = HTMLParser.parse(html);
        let tagAs = root.querySelectorAll('a').filter(a => a.attributes['href'].startsWith('/?cat='));
        let list: SelectItem[] = tagAs.map(a => ({
            id: a.attributes['href'].split('=')[1],
            title: a.text,
            header: a.text
        }));
        return list;
    },
    searchAnime: async (page: number = 1, input: string) => {
        var url = 'https://anime1.me/page/' + page + '?s=' + input;
        let resp = await axios.get(url);
        let html = resp.data;
        let root = HTMLParser.parse(html);
        let articles = commonApi.getTagHtml(html, 'article');
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