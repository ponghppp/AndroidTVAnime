import axios from "axios";
import HTMLParser from 'fast-html-parser';
import SelectItem from "../class/SelectItem";
import React from "react";
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
            console.log(seriesName);
            sName = seriesName.split(' ')[0] + ' ';
            if (seriesName.split(' ').pop().match(/[0-9]/i)) {
                sName = seriesName.split(' ')[0] + ' ';
            }
        }
        let list: SelectItem[] = lis.map(l => ({
            id: l.querySelectorAll('a')[1].attributes['data-href'].split('/').pop(),
            title: sName + l.querySelectorAll('a')[0].text,
            header: sName + l.querySelectorAll('a')[0].text,
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
        };
        ws.onclose = (e) => {
            isReturn = true;
        };
        ws.onerror = (e) => {
            isReturn = true;
        };
        ws.onmessage = (e) => {
            isReturn = true;
            let json = JSON.parse(e.data);
            item.url = 'https:' + json.video;
        };
        while (!isReturn) await commonApi.delay(1000);
        return item;
    },
    getSeasonAnime: async (season: string) => {

    },
    searchAnime: async (page: number = 1, input: string) => {

    }
}
export default myselfApi;