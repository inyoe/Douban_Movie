const DIST   = './',
      SOURCE = 'src/',
      STATIC = 'static/assets/',
      CSS    = 'css/',
      SCSS   = 'scss/',
      JS     = 'js/',
      IMG    = 'img/',
      HTML   = 'view/',
      SPRITE = 'sprite/',
      STATIC_ROOT = 'static/';

module.exports = {
    path: {
        DIST,
        SOURCE,
        STATIC,
        CSS,
        SCSS,
        JS,
        IMG,
        HTML,
        SPRITE,
        STATIC_ROOT
    },
    sprite: {
        ratio: 1,
        unit: 'px'
    },
    tinypngKey: '',
    replace: {
        html: [],
        js: [],
        css: []
    },
    exclude: {
        js: [],
        img: []
    }
}