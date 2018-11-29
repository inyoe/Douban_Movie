module.exports = (src, pageNow, pageCount) => {
    if (!src ||
        typeof pageNow === 'undefined' ||
        typeof pageCount === 'undefined' ||
        pageNow > pageCount) {
        return '';
    }

    const pageShow = 5;
    const half = (pageShow - 1) / 2;
    
    let str = '',
        pageStart,
        pageEnd;

    pageStart = pageNow - half > 2 ? pageNow - half : 1;
    pageEnd = pageNow < pageCount - (half + 1) ? pageNow + half : pageCount;


    if (pageStart == 1) {
        pageEnd = pageCount <= pageShow + 2 ? pageCount : pageEnd = pageShow + 1;
    }

    if (pageEnd == pageCount) {
        pageStart = pageCount < pageShow + 3 ? 1 : Math.min(pageCount - (pageShow - 1), pageNow - half);
    }

    str += '<a href="' + (pageNow == 1 ? 'javascript:;' : src + (pageNow - 1)) + '"' + (pageNow == 1 ? ' class="disabled"' : '') + '>上一页</a>';

    if (pageStart != 1) {
        str += '<a href="' + src + '1">1</a><span>...</span>';
    }

    for (let i = pageStart; i <= pageEnd; i++) {
        str += '<a href="'+(i == pageNow ? 'javascript:;" class="cur' : src + i )+'">' + i + '</a>';
    }

    if (pageEnd != pageCount) {
        str += '<span>...</span><a href="' + src + pageCount + '">' + pageCount + '</a>';
    }

    str += '<a href="' + (pageNow == pageCount ? 'javascript:;' : src + (pageNow + 1)) + '" ' + (pageNow == pageCount ? ' class="disabled"' : '') + '>下一页</a>';

    return str;
}