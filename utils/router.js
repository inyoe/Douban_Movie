class handlerRouter {
    constructor(list) {
        this.routeList = [];

        this.__init(list);
    }

    __init(list) {
        if (Object.prototype.toString.call(list).toLowerCase() === '[object array]') {
            this.routeList = JSON.parse(JSON.stringify(list));
        }
    }

    link(routeName, option) {
        let totalUrl = '',
            strHash = '',
            strQuery = '';

        const target = this.routeList.filter((item) => {
            return item.name === routeName;
        })

        if (target.length) {
            let targetUrl = target[0].url;

            if (Object.prototype.toString.call(option).toLowerCase() === '[object object]') {
                if (option.hasOwnProperty('params')) {
                    for (let key in option.params) {
                        const rule = new RegExp(':' + key);
                        targetUrl = targetUrl.replace(rule, option.params[key]);
                    }
                }

                if (option.hasOwnProperty('query')) {
                    const aQuery = [];
                    for (let key in option.query) {
                        aQuery.push(`${key}=${option.query[key]}`);
                    }
                    strQuery += '?' + aQuery.join('&')
                }

                if (option.hasOwnProperty('hash')) {
                    strHash += `#${option.hash}`;
                }
            }

            totalUrl = targetUrl + strHash + strQuery;
        }

        return totalUrl;
    }
}

module.exports = handlerRouter;