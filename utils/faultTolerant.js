module.exports = async (ctx, next) => {
    try {

        await next();

        
        if (ctx.status === 404) {
            throw {
                code: 404,
                msg: 'Not found'
            }
        }

    } catch (err) {
        let errCode, errMsg;
        if (Object.prototype.toString.call(err).toLowerCase() === '[object object]') {
            errCode = err.code;
            errMsg = err.msg;
        } else {
            errMsg = err.stack || err.message || err;
        }

        global.$log('ERROR', `Code:${errCode}${errMsg ? ' | Massage:' + errMsg : ''} | URL:${ctx.request.header.host + ctx.request.url} | Referer:${ctx.request.header.referer}`);

        ctx.status = errCode || 500;
        ctx.state.error = 1;

        await ctx.render(
            ctx.status === 404 ?
                'common/404.html' :
                'common/500.html'
            )
    }
}