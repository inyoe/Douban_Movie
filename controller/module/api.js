const fs = require("fs");  
const send = require('koa-send');
const { PATH_UPLOAD_BASE, PATH_UPLOAD_URL } = process.env;

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
            const fileName = reqFiles[key].path.replace(/.*(\/|\\)(.*\..*)/, '$2');
            list.push({
                url: `${PATH_UPLOAD_URL}/${fileName}`,
                fileName
            });
        }
        result.code = 0;
        result._files = list;
    } else {
        result.code = 1;
    }

    ctx.type = 'json';
    ctx.body = result;

}


const apiImageDown = async (ctx, next) => {
    const fileName = ctx.params.name;
    const path = `${PATH_UPLOAD_BASE + PATH_UPLOAD_URL}/${fileName}`;
    const hasFile = fs.existsSync(process.cwd() + path);

    if (hasFile) {
        ctx.attachment(path);
        await send(ctx, path);
    } else {
        ctx.type = 'json';
        ctx.body = {
            code: -1,
            msg: 'No such file or directory'
        }
    }
}

module.exports = {
    apiReviews,
    apiImageUpload,
    apiImageDown
}