module.exports = async (ctx, next) => {
    const { PATH_VIEWS, PATH_STATIC } = process.env;

    ctx.state.global = {
        PATH_STATIC: process.cwd() + PATH_STATIC,
        PATH_VIEWS: process.cwd() + PATH_VIEWS
    };

    await next();
}