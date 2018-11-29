const request = require('superagent');
const parseString = require('xml2js').parseString;
const fs = require('fs');

const findInstance = async (url, instanceName) => {
    const XML = await request.get(url).buffer(true),
          aServers = [];

    parseString(XML.text, (err, result) => {
        if (!err) {
            const data = result.applications.application;

            for (let apps of data) {
                if (apps.name[0] == instanceName) {
                    for (let instance of apps.instance) {
                        aServers.push(instance.homePageUrl[0]);
                    }
                    break;
                }
            }
        }
    });

    return aServers;
}

module.exports = async (options) => {
    const { eurekaPath, eurekaName, baseAddr } = options;
    const addrList = [ baseAddr ];

    return new Promise((resolve, reject) => {
        if (!eurekaPath || !eurekaName) {
            resolve(addrList);
        } else {
            fs.readFile(eurekaPath, 'utf-8', (err, data) => {
                if (!err) {
                    const params = {};
                    data.split('\n').forEach((item) => {
                        const arrTemp = item.split('=');
                        if (arrTemp.length === 2) {
                            params[arrTemp[0].trim()] = arrTemp[1].replace(/"/g, '').trim();
                        }
                    })

                    if (params.EUREKA_URL) {
                        let totalURL = params.EUREKA_URL.split(',')[0];
                        totalURL = totalURL + (totalURL.charAt(totalURL.length - 1) === '/' ? 'apps' : '/apps');

                        findInstance(totalURL, eurekaName).then(res => resolve(res), res => {
                            global.$log('ERROR', 'Can not find instance' + JSON.stringify(res));
                            resolve(addrList);
                        })
                    } else {
                        global.$log('ERROR', 'EUREKA_URL is Null');
                        resolve(addrList);
                    }
                } else {
                    global.$log('ERROR', err);
                    resolve(addrList);
                }
            })
        }
    })
}