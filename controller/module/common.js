const common = async (ctx, next) => {    
    const userAgent = ctx.request.header['user-agent'].toLowerCase();

    ctx.state.$Route = (name, option) => {
        return global.$route.link(name, option);
    }

    ctx.state.global = Object.assign(ctx.state.global, {
        userAgent
    });

    await next();

}


module.exports = {
    common
}