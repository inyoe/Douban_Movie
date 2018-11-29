# Douban_Movies
**Nodejs + Koa2** SSR Demo
<br>
<br>

## INSTALL
* **Nodejs**  Version.10 +
* **PM2** `npm install pm2 -g`
* **Gulp** `npm install gulp@next -g`
* `npm install`
<br>
<br>

## USAGE
* Start Node Server(Production): `npm run start`
* Stop Node Server(Production): `npm run stop`
* Restart Node Server(Production): `npm run restart`
<br>

* Start Node Server(Development): `npm run dev`
* Stop Node Server(Development): `npm run dev_stop`
* Restart Node Server(Development): `npm run dev_restart`
<br>

> More command about PM2: [PM2](https://github.com/Unitech/PM2/)
<br>

* Fronend Dev: `gulp dev`
* Fronend Build: `gulp build`
<br>
<br>

## CONFIG
**./process_pro.json**
```
{
    "apps" : [{
        "name": "Koa2",
        "script": "./app.js",
        "instances": "max",     *How many instances of script to create. Only relevant in exec_mode 'cluster'*
        "watch": false,
        "exec_mode": "cluster",
        "env": {
            "NODE_ENV": "production",
            "PATH_STATIC": "/static",                   *Static resource path*
            "PATH_VIEWS": "/view",                      *HTML path*
            "PATH_UPLOAD_BASE": "/uploadFiles",         *Upload files path*
            "PATH_UPLOAD_URL": "/temp_images",          *Upload files access path*
            "PORT": "3388",                             *Node server port*
            "STATIC_CACHE": 2592000000,                 *Static resource caching time*
            "REMOTE_ADDR": "https://api.douban.com",    *Remote API server address*
            "EUREKA_FILE": "",
            "EUREKA_NAME": ""
        },
        "log_date_format": "",
        "pid_file": "./logs/pid/app-id.pid",
        "out_file": "./logs/out/out.log",               *Server log*
        "error_file": "./logs/err/err.log"              *Error log*
    }]
}
```
<br>

**./process_dev.json**
```
{
    "apps" : [{
        "name": "Koa2_Dev",
        "script": "./app.js",
        "instances": "1",
        "watch": [              *The application will be restarted on change of the list file*
            "config.js",
            "app.js",
            "controller",
            "model",
            "utils"
        ],
        "exec_mode": "cluster",
        "env": {
            "NODE_ENV": "development",
            "PATH_STATIC": "/src/static",
            "PATH_VIEWS": "/src/view",
            "PATH_UPLOAD_BASE": "/uploadFiles",
            "PATH_UPLOAD_URL": "/temp_images",
            "STATIC_CACHE": 0,
            "PORT": "3366",
            "REMOTE_ADDR": "https://api.douban.com",
            "EUREKA_FILE": "",
            "EUREKA_NAME": ""
        },
        "log_date_format": "",
        "pid_file": "./logs/pid/app-id.pid",
        "out_file": "./logs/out/out.log",
        "error_file": "./logs/err/err.log"
    }]
}
```