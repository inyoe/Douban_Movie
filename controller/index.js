const router = require('koa-router')();
const routeMap = require('./routeMap');
const fs = require('fs');
const MODULE_PATH = __dirname + '/module/';

const regRouter = (routeMap, handlers) => {
    const routeList = [];
    let regMessage = '';

    for (let routeItem of routeMap) {
        const { url: URL, method: METHOD, handler: HANDLER } = routeItem;

        if (routeItem.hasOwnProperty('redirect')) {

            router[METHOD](URL, (ctx) => {
                ctx.redirect(routeItem.redirect);
                ctx.status = 301;
            });

            routeList.push(routeItem);

            regMessage += ` [ ${METHOD.toLocaleUpperCase()} ${URL} -> ${routeItem.redirect} ] `;

        } else {
            const HANDLER_TYPE = Object.prototype.toString.call(HANDLER).toLowerCase();

            if (HANDLER_TYPE === '[object array]') {
                const arrHandler = [];

                HANDLER.forEach((item) => {
                    if (handlers.hasOwnProperty(item)) {
                        arrHandler.push(handlers[item])
                    }
                })

                if (arrHandler.length) {
                    router[METHOD](URL, ...arrHandler);

                    routeList.push(routeItem);
                    regMessage += ` [ ${METHOD.toLocaleUpperCase()} ${URL} ] `;
                }
            } else if (HANDLER_TYPE === '[object string]') {
                if (handlers.hasOwnProperty(HANDLER)) {
                    router[METHOD](URL, handlers[HANDLER]);

                    routeList.push(routeItem);
                    regMessage += ` [ ${METHOD.toLocaleUpperCase()} ${URL} ] `;
                }
            }
        }
    }

    global.$log('INFO', 'Register Router:' + regMessage);

    return routeList;
}

const addControllers = () => {
    const controllerFiles = fs.readdirSync(MODULE_PATH).filter((item) => {
        return item.endsWith('.js');
    });

    let handlers = {}, dataRoute;

    try {
        for (let item of controllerFiles) {
            const module = require(MODULE_PATH + item);
            handlers = Object.assign({}, handlers, module);
        }

        dataRoute = regRouter(routeMap, handlers);
    } catch (err) {
        global.$log('ERROR', `addControllers:${err}`)
    }

    return {
        dataRoute,
        routes: router.routes()
    }
}

module.exports = addControllers;