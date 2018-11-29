const Pagination = require(process.cwd() + '/utils/pagination');

const index = async (ctx, next) => {
    await next();

    ctx.state.global = Object.assign(ctx.state.global, {
        seoTitle: '豆瓣电影',
        seoKeywords: '关键字',
        seoDescription: '描述'
    });

    await ctx.render('page/index.html');

}




const movieList = async (ctx, next) => {

    await next();

    const result = await global.$model('GET_MOVIE_LIST', {
            city: '北京'
        })


    if (result.hasOwnProperty('subjects') && result.subjects.length) {
        ctx.state.global = Object.assign(ctx.state.global, {
            seoTitle: '上映列表',
            seoKeywords: '关键字',
            seoDescription: '描述'
        });

        ctx.state.res = result;

        await ctx.render('page/list.html');
    } else {
        throw {
            code: 500,
            msg: `Model[GET_MOVIE_LIST]:${JSON.stringify(result)}`
        }
    }

}




const movieDetail = async (ctx, next) => {
    await next();

    const id = ctx.params.id;
    if (!id) {
        throw {
            code: 500,
            msg: 'Article Id is Null'
        }
    }

    const result = await global.$model('GET_MOVIE_DETAIL', {
            city: '广州',
            id
        })


    if (result.hasOwnProperty('title')) {
        ctx.state.global = Object.assign(ctx.state.global, {
            seoTitle: result.title,
            seoKeywords: '关键字',
            seoDescription: '描述'
        });

        ctx.state.res = result;

        await ctx.render('page/detail.html');
    } else {
        throw {
            code: 500,
            msg: `Model[GET_MOVIE_DETAIL]:${JSON.stringify(result)}`
        }
    }
}



module.exports = {
    index,
    movieList,
    movieDetail
}