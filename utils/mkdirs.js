const fs = require("fs");  
const path = require("path");

const mkdirsAsync = (dirname, callback) => {  
    fs.exists(dirname, (exists) => {  
        if (exists) {  
            typeof callback === 'function' && callback(dirname);
        } else {  
            mkdirsAsync(path.dirname(dirname), () => {  
                fs.mkdir(dirname, callback);  
            });  
        }  
    });  
}

const mkdirsSync = (dirname, callback) => {
    if (fs.existsSync(dirname)) {
        typeof callback === 'function' && callback(dirname);
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            typeof callback === 'function' && callback(dirname);
            return true;
        }
    }
}

module.exports = {
    Async: mkdirsAsync,
    Sync: mkdirsSync
}