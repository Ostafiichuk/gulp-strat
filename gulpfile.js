const {src, dest, watch, series, parallel } = require('gulp');
const browserSync                  = require('browser-sync').create();
const sass                         = require('gulp-sass')(require('sass'));
const sourcemaps                   = require('gulp-sourcemaps');
const del                          = require('del');
const autoprefixer                 = require('gulp-autoprefixer');

// browserSync
function browserSyncServe(){
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

// function delited folder dist
function cleanDist(){
    return del('dist');
}

// function is wathining for folder "scss" and file "*.html" and if files will be change, reload browser and change css 

function watching(){
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/*.html']).on('change', browserSync.reload)
}


// scss => css + sourcemaps + autoprefixer
function styles(){
    return src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream())
}

// function takes files from src and puts in folder dist 

function build (){
    return src([
        'src/*.html',
        'src/css/**/*.*'
    ], {base: 'src'})
    .pipe(dest('dist'))
}




exports.browserSyncServe = browserSyncServe;
exports.styles = styles;
exports.watching = watching;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build) 

// defolt task
exports.default = parallel(styles, browserSyncServe, watching); 