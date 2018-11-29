const fs = require('fs');
const MODULE_PATH = __dirname + '/module/';
const request = require('superagent');

class model {
    constructor(arrRemoteAddr) {
        this.REMOTE_ADDR = [];
        this.MODEL_LIST = {};
        this.addrIndex = 0;
        this.addrSize = 0;
        this.timeOut = 3e3;
        
        if (Object.prototype.toString.call(arrRemoteAddr).toLowerCase() === '[object array]' && arrRemoteAddr.length > 0) {
            this.__init(arrRemoteAddr);
            return this.__callModel.bind(this);
        } else {
            global.$log('ERROR', 'params:arrRemoteAddr must be Array');
            return null;
        }
    }

    __init(arrRemoteAddr) {
        this.REMOTE_ADDR = arrRemoteAddr;
        this.addrSize = this.REMOTE_ADDR.length;

        const modelFiles = fs.readdirSync(MODULE_PATH).filter((item) => {
            return item.endsWith('.js');
        });
        
        for (let item of modelFiles) {
            try {
                const module = require(MODULE_PATH + item);
                this.MODEL_LIST = Object.assign(this.MODEL_LIST, module);
            } catch (err) {
                global.$log('ERROR', err)
            }
        }

        global.$log('INFO', `REMOTE_ADDR:${JSON.stringify(this.REMOTE_ADDR)}`)
    }

    __balance() {
        this.addrIndex = this.addrIndex < this.addrSize - 1 ? this.addrIndex + 1 : 0;
        return this.REMOTE_ADDR[this.addrIndex];
    }

    async __callModel(methodName, oParams, oHeader, timeOut) {
        const remoteAddr = this.__balance();
        let result = {};

        try {
            if (this.MODEL_LIST.hasOwnProperty(methodName)) {
                const { type = 'GET', url, data = {}, header = {} } = this.MODEL_LIST[methodName];
                const totalParams = Object.assign(data, oParams);
                let totalUrl = remoteAddr + url;

                for (let key in totalParams) {
                    const rule = new RegExp(':' + key);
                    totalUrl = totalUrl.replace(rule, totalParams[key]);
                }

                result = await this[type](totalUrl, totalParams, Object.assign(header, oHeader), timeOut);
            } else {
                throw {
                    code: 500,
                    msg: 'Method is Undefined'
                };
            }
        } catch (err) {
            global.$log('ERROR', `Model[${methodName}]:${JSON.stringify(err)}`);
        }

        return result.body;
    }

    POST(url = '', params = {}, header = {}, timeOut = this.timeOut) {
        return request.post(url)
                      .send(params)
                      .set(header)
                      .timeout(timeOut)
    }

    GET(url = '', params = {}, header = {}, timeOut = this.timeOut) {
        return request.get(url)
                      .query(params)
                      .set(header)
                      .timeout(timeOut)
    }
}

module.exports = model;