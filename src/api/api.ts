import Record from "../class/Record";
import SecureStorage from "../common/SecureStorage";
import Constants from "../constants/Constants";
import Sources from "../constants/Sources";
import anime1Api from "./anime1Api";

const api = {
    getAnimeList: async () => {
        let source = await SecureStorage.getSource();
        switch (source) {
            case Sources.Anime1:
                let resp = anime1Api.getAnimeList();
                return resp;
            case Sources.Myself:
                break;
        }
    },
    getSeries: async (seriesId: string) => {
        let source = await SecureStorage.getSource();
        switch (source) {
            case Sources.Anime1:
                let resp = anime1Api.animeSeries(seriesId);
                return resp;
            case Sources.Myself:
                break;
        }
    },
    getSeasons: () => {
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var seasonsConst = ['冬', '春', '夏', '秋'];
        var allSeasons = [];
        var yearsToGet = 10;
        var currentSeasonIdx = Math.ceil(currentMonth / 3) - 1;
        allSeasons.push({
            year: currentYear,
            seasons: seasonsConst.filter((v, i) => i <= currentSeasonIdx)
        });
        for (var i = 0; i < yearsToGet; i++) {
            allSeasons.push({
                year: currentYear + (-(i + 1)),
                seasons: seasonsConst
            });
        }
        return allSeasons;
    },
    downloadVideo: async (apireq: string) => {
        let source = await SecureStorage.getSource();
        switch (source) {
            case Sources.Anime1:
                let resp = anime1Api.downloadVideo(apireq);
                return resp;
            case Sources.Myself:
                break;
        }
    },
    recordVideo: async (record: Record) => {
        let previousRecords = await SecureStorage.getItem(Constants.record);
        let current = [{ ...record }];
        let json = current;
        if (previousRecords != '') {
            json = JSON.parse(previousRecords);
            let prevRecord = json.find(j => j.videoId == record.videoId);
            if (prevRecord != undefined) {
                prevRecord.currentTime = record.currentTime;
            }
            else {
                json = [...json, ...current];
            }
        }
        let jsonStr = JSON.stringify(json);
        SecureStorage.setItem(Constants.record, jsonStr);
    },
    deleteVideoRecord: () => {
        SecureStorage.setItem(Constants.record, '');
    },
    getSeasonAnime: async (season: string) => {
        let source = await SecureStorage.getSource();
        switch (source) {
            case Sources.Anime1:
                let resp = anime1Api.getSeasonAnime(season);
                return resp;
            case Sources.Myself:
                break;
        }
    },
}

// function searchAnime(startPage, page, searchText) {
//     var url = 'https://anime1.me/page/' + page + '?s=' + searchText;

//     if (page == 1) {
//         item_count = 0;
//     }
//     showLoading();
//     $
//         .ajax({
//             type: "GET",
//             url: url,
//             async: true,
//             success: function (text) {
//                 hideLoading();
//                 var articles = getTagHtml(text, 'article');
//                 for (var i = 0; i < articles.length; i++) {
//                     var article = articles[i];
//                     var tagAs = getTagHtml(article, 'a');
//                     var animeName = getInnerHtml(tagAs[0]);
//                     var animeId = getSearchAnimeId(tagAs[0], 'href');
//                     var regex = /[0-9]/g;
//                     var found = animeId.match(regex);
//                     if (found.length != animeId.length) {
//                         continue;
//                     }
//                     var param = {
//                         id: animeId
//                     };
//                     var hrefParam = paramToHref(param);
//                     addToList(item_count + i, 'episode.html' + hrefParam,
//                         animeName);
//                 }
//                 item_count += articles.length;
//                 if (text.includes('nav-previous') && page <= 3) {
//                     searchAnime(startPage, page + 1, searchText);
//                 }
//                 showItem(0);
//             }
//         });
// }

// function animeSeriesFromEpisode(episodeId) {
//     var url = 'https://anime1.me/' + episodeId;

//     $.ajax({
//         type: "GET",
//         url: url,
//         async: true,
//         success: function (text) {
//             var catIndex = text.indexOf('cat=');
//             var firstQuote = text.indexOf('"', catIndex);
//             var seriesId = text.substring(catIndex + 4, firstQuote);

//             var animeNameMeta = getTagHtmlWithFirstAttr(text, 'meta',
//                 'property="article:section"');
//             var animeName = getTagAttr(animeNameMeta[0], 'content', '"');
//             var param = {
//                 id: seriesId,
//                 name: animeName
//             };
//             var hrefParam = paramToHref(param);
//             window.location.href = 'series.html' + hrefParam;
//         }
//     });
// }

// function animeEpisode(episodeId) {
//     var url = 'https://anime1.me/' + episodeId;

//     $.ajax({
//         type: "GET",
//         url: url,
//         async: true,
//         success: function (text) {
//             var animeNames = [];
//             var h2s = getTagHtml(text, 'h2');
//             for (var i = 0; i < h2s.length; i++) {
//                 var tagAs = getTagHtml(h2s[i], 'a');
//                 if (tagAs.length == 0) {
//                     continue;
//                 }
//                 var animeName = getInnerHtml(tagAs[0]);
//                 animeNames.push(animeName);
//             }
//             if (animeNames.length == 0) {
//                 for (var i = 0; i < h2s.length; i++) {
//                     var animeName = getInnerHtml(h2s[i]);
//                     animeNames.push(animeName);
//                 }
//             }
//             var videos = getTagHtml(text, 'video');
//             for (var i = 0; i < videos.length; i++) {
//                 var video = videos[i];
//                 var animeName = animeNames[i];
//                 var apireq = getTagAttr(video, 'data-apireq', ' ');
//                 var param = {
//                     id: episodeId,
//                     name: animeName,
//                     apireq: apireq
//                 };
//                 var hrefParam = paramToHref(param);
//                 window.location.replace('player.html' + hrefParam);
//             }
//         }
//     });
// }

export default api