const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const compress = require('koa-compress');
const koaBody = require('koa-body');
const helmet = require("koa-helmet");

const handlerPm2log = require('./utils/pm2log');
const handlerController = require('./controller/index');
const handlerModel = require('./model/index');
const handlerRouter = require('./utils/router');
const handlerEurekaApi = require('./utils/eurekaApi');
const handlerMkdirs = require('./utils/mkdirs');
const mwFaultTolerant = require('./utils/faultTolerant');
const mwCommon = require('./utils/mwCommon');

const {
    NODE_ENV,
    PATH_STATIC,
    PATH_VIEWS,
    PATH_UPLOAD_BASE,
    PATH_UPLOAD_URL,
    STATIC_CACHE,
    PORT,
    REMOTE_ADDR,
    EUREKA_FILE,
    EUREKA_NAME
} = process.env;


global.$log = new handlerPm2log(process.env.name);

handlerEurekaApi({
    eurekaPath: EUREKA_FILE,
    eurekaName: EUREKA_NAME,
    baseAddr: REMOTE_ADDR
}).then((res) => {
    global.$model = new handlerModel(res);
})

const controller = handlerController();
global.$route = new handlerRouter(controller.dataRoute);


const app = new Koa();


app.use(helmet());


app.use(views(__dirname + PATH_VIEWS, {
    map: { html: 'nunjucks' }
}));


app.use(compress({
    filter: function (content_type) {
        return /text|javascript/i.test(content_type)
    },
    flush: require('zlib').Z_SYNC_FLUSH
}))


handlerMkdirs.Sync(__dirname + PATH_UPLOAD_BASE + PATH_UPLOAD_URL, (src) => {
    app.use(koaBody({
        multipart: true,
        formidable:{
            keepExtensions: true,
            uploadDir: src,
            maxFieldsSize: 2 * 1024 * 1024,
            onFileBegin: (name, file) => {}
        }
    }));
})


app.use(mwFaultTolerant);


app.use(mwCommon);


app.use(controller.routes);


app.use(static(__dirname + PATH_STATIC, {
    maxage: STATIC_CACHE
}));

app.use(static(__dirname + PATH_UPLOAD_BASE, {
    maxage: STATIC_CACHE
}));


app.listen(PORT);

global.$log('INFO', `@@@@@@@@@@@@[[Server listen in localhost:${PORT}]]@@@@@@@@@@@@`);
