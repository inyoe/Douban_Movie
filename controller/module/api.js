const apiReviews = async (ctx, next) => {
    const { id, start = 1, count = 10 } = ctx.query;
    let result;

    if (!id) {
        result = {
            code: -1,
            msg: 'id is Null'
        }
    } else {
        result = await global.$model('GET_MOVIE_REVIEWS', {
            id,
            start,
            count
        })
    }

    ctx.type = 'json';
    ctx.body = result;
}

const apiImageUpload = async (ctx, next) => {
    const result = {};
    const { files: reqFiles, body: reqBody } = ctx.request;

    // console.log(reqBody)

    if (reqFiles) {
        const reqFilesKeys = Object.getOwnPropertyNames(reqFiles);
        const list = [];
        for (let key of reqFilesKeys) {
            list.push(reqFiles[key].path.replace(/.*uploadFiles(.*)/, '$1'));
        }
        result.code = 0;
        result._files = list;
    } else {
        result.code = 1;
    }

    ctx.type = 'json';
    ctx.body = result;

}

module.exports = {
    apiReviews,
    apiImageUpload
}