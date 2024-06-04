import axios from "axios";
import HTMLParser from 'fast-html-parser';
import SelectItem from "../class/SelectItem";
import commonApi from "./commonApi";

const myselfApi = {
    getAnimeList: async () => {
        let url = 'https://myself-bbs.com/portal.php';
        let resp = await axios.get(url);
        let html = resp.data;
        var root = HTMLParser.parse(html);
        let allA = root.querySelectorAll('a');
        let threads = allA.filter(a => a.attributes['href'].startsWith('thread-') && a.attributes['title'] != undefined);
        let allList = threads.map(t => ({ id: t.attributes['href'], title: t.attributes['title'], header: t.attributes['title'] }) as SelectItem);
        let list = allList.filter((value, index, array) => array.map(a => a.id).indexOf(value.id) === index);
        return list;
    },
    animeSeries: async (seriesId: string, seriesName: string) => {
        let url = 'https://myself-bbs.com/' + seriesId;
        let resp = await axios.get(url);
        let html = resp.data;
        var root = HTMLParser.parse(html);
        let epList = root.querySelector('.main_list');
        let lis = epList.querySelectorAll('li');
        let sName = '';
        if (seriesName) {
            sName = seriesName.split(' ')[0];
            if (seriesName.split(' ').pop().match(/[0-9]/i)) {
                sName = seriesName.split(' ')[0];
            }
        }
        let list: SelectItem[] = lis.map(l => ({
            id: l.querySelectorAll('a')[1].attributes['data-href'].split('/').pop(),
            title: sName + ' ' + l.querySelectorAll('a')[0].text,
            header: sName,
            data: { apireq: l.querySelectorAll('a')[1].attributes['data-href'].split('/').pop() }
        }));
        return list.reverse();
    },
    downloadVideo: async (apireq: string) => {
        var ws = new WebSocket('wss://v.myself-bbs.com/ws', null, { headers: { ['User-Agent']: "Mozilla/5.0" } });
        var isReturn = false;
        var item = { url: '', cookie: '', referer: 'https://v.myself-bbs.com/' };
        ws.onopen = (e) => {
            let msg = JSON.stringify({ tid: '', vid: '', id: apireq.replace('\r', '') });
            ws.send(msg);
            console.log('open', msg);
        };
        ws.onclose = (e) => {
            isReturn = true;
            console.log('close', e);
        };
        ws.onerror = (e) => {
            isReturn = true;
            console.log('error', e);
        };
        ws.onmessage = (e) => {
            isReturn = true;
            let json = JSON.parse(e.data);
            item.url = 'https:' + json.video;
            console.log('msg', e);
        };
        while (!isReturn) await commonApi.delay(1000);
        return item;
    },
    getSeasonAnime: async (season: string) => {

    },
    searchAnime: async (page: number = 1, input: string, next_url: string) => {
        let host = 'https://myself-bbs.com/';
        let url = host + 'search.php?searchsubmit=yes';
        if (page != 1) url = host + next_url;
        let data = { srchtxt: input };
        let config = { method: 'post', headers: { "Content-Type": 'application/x-www-form-urlencoded' } };
        let resp = await axios.post(url, data, config);
        let html = resp.data;
        let list: SelectItem[] = [];

        var root = HTMLParser.parse(html);
        let pbws = root.querySelectorAll('.pbw');
        let item: { href: string, type: string, title: string }[] = pbws.map(p => ({
            href: p.querySelector('a').attributes['href'],
            type: p.querySelector('.xi1').text,
            title: p.querySelector('a').text
        }));
        item = item.filter(i => i.type.includes('動畫'));
        let allList = item.map(t => ({ id: t.href, title: t.title, header: t.title }) as SelectItem);
        list = list.concat(allList.filter((value, index, array) => array.map(a => a.id).indexOf(value.id) === index));

        let hasNextPage = root.querySelector('.nxt');
        if (hasNextPage) {
            let pg = root.querySelector('.pg');
            let pages = pg.querySelectorAll('a').map(p => ({ page: p.text, url: p.attributes['href'] }));
            let nextPage = pages[pages.length -1];
            list = list.concat(await myselfApi.searchAnime(0, input, nextPage.url));
        }
        return list;
    }
}
export default myselfApi;