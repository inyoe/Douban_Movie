const env = process.argv.indexOf('dev') >= 0 ? 'dev' : 'build';

const gulp         = require('gulp'),
      del          = require('del'),
      fs           = require('fs'),
      uglify       = require('gulp-uglify'),
      sass         = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      csso         = require('gulp-csso'),
      sourcemaps   = require('gulp-sourcemaps'),
      replace      = require('gulp-replace'),
      rev          = require('gulp-rev'),
      revCollector = require('gulp-rev-collector'),
      tinypng      = require('gulp-tinypng-compress'),
      fileInclude  = require('gulp-file-include'),
      spritesmith  = require('gulp.spritesmith'),
      merge        = require('merge-stream'),
      browserSync  = require('browser-sync').create();

const config = require('./gulpconfig');
const koaPort = require('./process_dev.json').apps[0].env.PORT;

const { DIST, SOURCE, STATIC, CSS, SCSS, JS, IMG, HTML, SPRITE, STATIC_ROOT } = config.path;


const DIST_STATIC = DIST + STATIC,
      DIST_CSS = DIST_STATIC + CSS,
      DIST_JS = DIST_STATIC + JS,
      DIST_IMG = DIST_STATIC + IMG,
      DIST_HTML = DIST + HTML,
      SOURCE_CSS = SOURCE + STATIC + CSS,
      SOURCE_SCSS = SOURCE + STATIC + SCSS,
      SOURCE_JS = SOURCE + STATIC + JS,
      SOURCE_IMG = SOURCE + STATIC + IMG,
      SOURCE_HTML = SOURCE + HTML,
      SOURCE_OTHER = SOURCE + STATIC + 'other/',
      sSprite = SOURCE + STATIC + SPRITE,
      tinyPath = SOURCE + STATIC + 'tinypngBak/',
      revPath = './rev/';

const { js: EXCLUDE_JS, css: EXCLUDE_CSS, img: EXCLUDE_IMG } = config.exclude;



gulp.task('jsUglify', () => {
    const source = [SOURCE_JS + '**/*.js'],
          replaceList = config.replace.js;

    EXCLUDE_JS.forEach((item) => {
        source.push('!' + SOURCE_JS + item);
    })

    let stream = gulp.src(source);

    replaceList.forEach((item, index) => {
        stream = stream.pipe(replace(item[0], item[1]));
    })

    return stream.pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(DIST_JS))
            .pipe(rev.manifest('rev-js.json'))
            .pipe(replace(/\"module\/(\S*\.js)\"/g, '\"$1\"'))
            .pipe(replace(/\"(\S*\/\S*)\.js\"/g, '\"$1\"'))
            .pipe(gulp.dest(revPath));
})


gulp.task('jsRev', () => {
    return gulp.src([revPath + '*.json', DIST_JS + '**/*.js'])
            .pipe(revCollector())
            .pipe(gulp.dest(DIST_JS));
})


gulp.task('copyExcludeJs', () => {
    const source = EXCLUDE_JS.map((item) => {
        return SOURCE_JS + item;
    })

    return new Promise((resolve, reject) => {
        if (source.length) {
            return gulp.src(source, { base: SOURCE_JS })
                    .pipe(gulp.dest(DIST_JS))
                    .on('end', resolve);
        } else {
            return resolve();
        }
    })
})


gulp.task('copyOther', () => {
    return gulp.src([SOURCE + STATIC_ROOT + '**/*.*', '!' + SOURCE + STATIC + '**/**'], { base: SOURCE + STATIC_ROOT})
            .pipe(gulp.dest(DIST + STATIC_ROOT));
})


const fnScss = (file) => {
    const target = typeof file === 'string' ? file : SOURCE_SCSS + '**/*.scss';

    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            return gulp.src(target, { base: SOURCE_SCSS })
                    .pipe(sourcemaps.init())
                    .pipe(sass())
                    .pipe(autoprefixer('last 2 version'))
                    .on('error', (e) => {
                        console.log('error')
                        return reject(e) && this.end();
                    })
                    .pipe(sourcemaps.write())
                    .pipe(gulp.dest(SOURCE_CSS))
                    .on('end', resolve)
                    .pipe(browserSync.stream());
        }, 500);
    }).catch((e) => {
        return console.error(e.messageFormatted);
    });
}

gulp.task('scss', fnScss)


gulp.task('cssMinify', () => {
    return gulp.src(SOURCE_CSS + '**/*.css')
            .pipe(csso())
            .pipe(rev())
            .pipe(gulp.dest(DIST_CSS))
            .pipe(rev.manifest('rev-css.json'))
            .pipe(gulp.dest(revPath));
})


gulp.task('tinypng', () => {
    const source = [SOURCE_IMG + '**/*.png'];

    EXCLUDE_IMG.forEach((item) => {
        source.push('!' + SOURCE_IMG + item);
    })

    return gulp.src(source)
        .pipe(tinypng({
            key: config.tinypngKey,
            sigFile: tinyPath + '.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest(tinyPath));
});


gulp.task('imgRev', () => {
    const source = [SOURCE_IMG + '**/*.*'];

    if (config.tinypngKey) {
        source.push('!' + SOURCE_IMG + '**/*.png', tinyPath + '**/*.png');
    }

    EXCLUDE_IMG.forEach((item) => {
        source.push('!' + SOURCE_IMG + item);
        source.push('!' + tinyPath + item);
    })

    return gulp.src(source)
            .pipe(rev())
            .pipe(gulp.dest(DIST_IMG))
            .pipe(rev.manifest('rev-img.json'))
            .pipe(gulp.dest(revPath));
})

gulp.task('copyExcludeImg', () => {
    const source = EXCLUDE_IMG.map((item) => {
        return SOURCE_IMG + item;
    })

    return new Promise((resolve, reject) => {
        if (source.length) {
            return gulp.src(source, { base: SOURCE_IMG })
                    .pipe(gulp.dest(DIST_IMG))
                    .on('end', resolve);
        } else {
            return resolve();
        }
    })
})


gulp.task('cssRev', () => {
    return gulp.src([revPath + '*.json', DIST_CSS + '**/*.css'])
            .pipe(revCollector())
            .pipe(gulp.dest(DIST_CSS));
})


gulp.task('htmlRev', () => {
    const replaceList = config.replace.html;

    let stream = gulp.src([revPath + '*.json', SOURCE_HTML + '**/*.html', ]);
    
    replaceList.forEach((item, index) => {
        stream = stream.pipe(replace(item[0], item[1]));
    })

    return stream.pipe(revCollector())
                 .pipe(gulp.dest(DIST_HTML));
})


gulp.task('clearDist', () => {
    return del([DIST_HTML + '**/*.*', DIST_STATIC + '**/*.*', revPath + '**/**']);
})


gulp.task('sprite', () => {
    const spriteData = gulp.src([sSprite + 'i-*.png'])
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        cssTemplate:(data)=> {
            const { ratio, unit } = config.sprite;

            let arr = [`.icon{display:inline-block; background-image:url(../img/sprite.png); background-size:${(data.spritesheet.width / ratio) + unit}; background-repeat:no-repeat; vertical-align:middle; -webkit-transition:none; -moz-transition:none; transition:none;}\n\n`];

            data.sprites.forEach((sprite) => {
                arr.push(
                    `.${sprite.name.replace('-hover', ':hover')}{width:${(sprite.width / ratio) + unit}; height:${(sprite.height / ratio) + unit}; background-position:${(sprite.offset_x / ratio) + unit} ${(sprite.offset_y / ratio) + unit};}\n`
                )
            });
            return arr.join('');
        }
    }));

    const imgStream = spriteData.img
        .pipe(gulp.dest(SOURCE_IMG));

    const cssStream = spriteData.css
        .pipe(gulp.dest(SOURCE_SCSS));

    return merge(imgStream, cssStream);
});


gulp.task('browserSync', function(){
    browserSync.init({
        proxy: {
            target: 'localhost:' + koaPort
        }
    });

    gulp.watch(SOURCE_JS + '**/*.js').on('change', browserSync.reload);
    gulp.watch(SOURCE_IMG + '**/*.*', browserSync.reload);
    gulp.watch(sSprite + '**/*.png', gulp.series('sprite'));
    gulp.watch(SOURCE_SCSS + '**/*.scss').on('change', file => fnScss(file));
    gulp.watch(SOURCE_HTML + '**/*.html').on('change', browserSync.reload);

})

gulp.task('dev', gulp.series('scss', 'browserSync'));

const buildTaskList = [
    'clearDist',
    'sprite',
    'tinypng',
    'imgRev',
    'copyExcludeImg',
    'jsUglify',
    'jsRev',
    'copyExcludeJs',
    'scss',
    'cssMinify',
    'copyOther',
    'cssRev',
    'htmlRev',
];

if (!config.tinypngKey) {
    buildTaskList.splice(buildTaskList.indexOf('tinypng'), 1);
}

gulp.task('build', gulp.series(...buildTaskList));
