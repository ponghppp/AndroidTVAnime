const commonApi = {
    getTagHtml: (html, tag) => {
        var articleStart = [];
        var articleEnd = [];
        var articles = [];
        var startRe = new RegExp('<' + tag + ' ', 'g');
        var endRe = new RegExp('<\/' + tag + '>', 'g');
        var guard = 100;
        var match;
        while ((match = startRe.exec(html)) != null) {
            articleStart.push(match.index);
            if (guard-- < 0) {
                console.error("Infinite loop detected")
                break;
            }
        }
        while ((match = endRe.exec(html)) != null) {
            articleEnd.push(match.index + 3 + tag.length); // 3 = </>
            if (guard-- < 0) {
                console.error("Infinite loop detected")
                break;
            }
        }
        var articleMaps: { start: any, end: any }[] = [];
        for (var i = 0; i < articleStart.length; i++) {
            var articleMap = {
                start: articleStart[i],
                end: articleEnd[i]
            };
            articleMaps.push(articleMap);
        }
        for (var i = 0; i < articleMaps.length; i++) {
            var articleMap = articleMaps[i];
            var article = html.substring(articleMap.start, articleMap.end);
            articles.push(article);
        }
        return articles;
    },
    getTagHtmlWithFirstAttr: (html, tag, firstAttr) => {
        var articleStart = [];
        var articleEnd = [];
        var articles = [];
        var articleMaps: { start: any, end: number }[] = [];
        var currentIdx = 0;
        var startRe = '<' + tag + ' ' + firstAttr;
        var endRe = '</' + tag + '>';

        while (html.indexOf(startRe, currentIdx) > -1) {
            var startIdx = html.indexOf(startRe, currentIdx);
            articleStart.push(startIdx);
            currentIdx = startIdx + startRe.length;
            var endIdx = html.indexOf(endRe, currentIdx);
            if (endIdx == -1) {
                endRe = '/>';
                endIdx = html.indexOf(endRe, currentIdx);
            }
            if (endIdx == -1) {
                endRe = '>';
                endIdx = html.indexOf(endRe, currentIdx);
            }
            if (endIdx == -1) {
                break;
            }
            articleEnd.push(endIdx + 3 + tag.length); // 3 = </>
            currentIdx = endIdx + 3 + tag.length;
            var articleMap = {
                start: startIdx,
                end: currentIdx
            };
            articleMaps.push(articleMap);
        }
        for (var i = 0; i < articleMaps.length; i++) {
            var articleMap = articleMaps[i];
            var article = html.substring(articleMap.start, articleMap.end);
            articles.push(article);
        }
        return articles;
    },
    getInnerHtml: (html) => {
        var fisrtClose = html.indexOf('>');
        var strBetweenFirstClose = html.substring(0, fisrtClose);
        var tag = '';
        if (strBetweenFirstClose.includes(' ')) {
            var firstSpace = strBetweenFirstClose.indexOf(' ');
            var strBetweenFirstSpace = strBetweenFirstClose
                .substring(0, firstSpace);
            tag = strBetweenFirstSpace.replace('<', '');
        } else {
            tag = strBetweenFirstClose.replace('<', '');
        }
        var firstTagClose = html.indexOf('</' + tag + '>');
        var strBetweenTagClose = html.substring(fisrtClose + 1, firstTagClose);
        return strBetweenTagClose;
    },
    getTagAttr: (html, attr, separator) => {
        var attrib = attr + '="';
        var attrIdx = html.indexOf(attrib);
        var lastChar = separator == '"' ? 1 : 0;
        var firstSpaceAfterAttr = html.indexOf(separator, attrIdx + attrib.length + 1) + lastChar;
        if (firstSpaceAfterAttr == -1) {
            firstSpaceAfterAttr = html.length - 1;
        }
        var attr = html.substring(attrIdx + attrib.length,
            firstSpaceAfterAttr - 1);
        return attr;
    },
    getSearchAnimeId: (html, attr) => {
        var href = commonApi.getTagAttr(html, attr, ' ')
        var slash = href.lastIndexOf('/');
        var id = href.substring(slash + 1)
        return id;
    },
    delay: (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
export default commonApi;