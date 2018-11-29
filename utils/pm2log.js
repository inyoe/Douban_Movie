class pm2log {
    constructor(name) {
        this.projectName = 'undefined';

        if (typeof name === 'string') {
            this.projectName = name;
            return this.__log.bind(this);
        } else {
            console.error('pm2log: projectName is not defined');
            return null;
        }
    }

    __toDouble(num) {
        return num > 9 ? num : '0' + num;
    }

    __log(type, content) {
        if (type === undefined || content === undefined) return;
    
        /**
        * 日志采集要求格式：
        * 日期 日志级别 [项目名称,..其他三个参数(留空)] 进程ID --- 进程名称       : 主内容
        * 2018-07-04 12:01:02.456 INFO [sccf-pc-node,,,] 1234 --- node       : Start Service
        */

        const now = new Date();
        const date = `${now.getFullYear()}-${this.__toDouble(now.getMonth() + 1)}-${this.__toDouble(now.getDate())} ${this.__toDouble(now.getHours())}:${this.__toDouble(now.getMinutes())}:${this.__toDouble(now.getSeconds())}.${now.getMilliseconds()}`;
        const msg = `[${this.projectName},,,] ${process.pid} --- [${process.title}]       : ${JSON.stringify(content).replace(/ +: +/g, ':')}`;

        type = type.toUpperCase();
        if (type !== 'DEBUG' && type !== 'WARN' && type !== 'ERROR') {
            type = 'INFO';
        }

        console.log(`${date} ${type} ${msg}`);
    }
}

module.exports = pm2log;