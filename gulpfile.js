var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    twig = require('gulp-twig'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    svgSprite = require('gulp-svg-sprite'),
    svg2png = require('gulp-svg2png'),
    size = require('gulp-size'),
    spritesmith = require("gulp.spritesmith"),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    mainBowerFiles = require('gulp-main-bower-files'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    gulpFilter = require('gulp-filter'),
    sassVars = require('gulp-sass-vars'),
    package = require('./package.json');

var finishPath = package.finishPath;

var filterBower = './bower_components/**/dist/**/';

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

var paths = {
    images: {
        src: 'src/img/'
    },
    sprite: {
        src: 'src/sprite/*.svg',
        svg: 'sprite.svg'
    }
};

var changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/src/img/)/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task("bower", ['bower_1', 'bower_2']);

gulp.task("bower_1", function(){
    var filterCSS = gulpFilter('**/*.{css,scss}', { restore: true }),
        filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterCSS)
    .pipe(concat('_plugins.scss'))
    .pipe(gulp.dest('src/scss/vendor'))
    .pipe(filterCSS.restore)
    .pipe(filterJS)
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(filterJS.restore);
});

gulp.task("bower_2", function(){
    var filterIMG = gulpFilter(['**/*.{png,gif,svg,jpeg,jpg}', '!**/fonts/**/*.svg'], { restore: true }),
        filterFont = gulpFilter('**/*.{ttf,woff,woff2,eot,svg}', { restore: true });
    return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterIMG)
    .pipe(flatten())
    .pipe(gulp.dest(finishPath+'/img'))
    .pipe(filterIMG.restore)
    .pipe(filterFont)
    .pipe(flatten())
    .pipe(gulp.dest(finishPath+'/fonts'))
    .pipe(filterFont.restore);
});

gulp.task('html', function () {
    return gulp.src('src/html/*.twig')
    .pipe(twig({
        data: {
           imgPath: '/img',
           linkPath: '/' 
        }
    }))
    .pipe(gulp.dest(finishPath))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html_static', function () {
    return gulp.src('src/html/*.twig')
    .pipe(twig({
        data: {
           imgPath: 'img',
           linkPath: ''
        }
    }))
    .pipe(gulp.dest(finishPath))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('css', function () {
    var variables = {
        imgPathCss: "/img"
    }
    return gulp.src('src/scss/style.scss')
    .pipe(sassVars(variables, { verbose: true }))
    .pipe(sass({
        includePaths: require("bourbon").includePaths,
        errLogToConsole: true
    }))
    .pipe(autoprefixer('last 4 version'))
//    .pipe(urlAdjuster({
//        prependRelative: '../img/',
//    }))
    .pipe(gulp.dest(finishPath+'/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(finishPath+'/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('css_static', function () {
    var variables = {
        imgPathCss: "../img"
    }
    return gulp.src('src/scss/style.scss')
    .pipe(sassVars(variables, { verbose: true }))
    .pipe(sass({
        includePaths: require("bourbon").includePaths,
        errLogToConsole: true
    }))
    .pipe(autoprefixer('last 4 version'))
//    .pipe(urlAdjuster({
//        prependRelative: '../img/',
//    }))
    .pipe(gulp.dest(finishPath+'/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(finishPath+'/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(finishPath+'/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(finishPath+'/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('svgSprite', function () {
    return gulp.src(paths.sprite.src)
        .pipe(svgSprite({
            shape: {
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: "./",
                    layout: "diagonal",
                    sprite: paths.sprite.svg,
                    bust: false,
                    render: {
                        scss: {
                            dest: "../scss/utils/_sprite.scss",
                            template: "src/scss/utils/sprite-template.scss"
                        }
                    }
                }
            },
            variables: {
                mapname: "icons"
            }
        }))
        .pipe(gulp.dest(paths.images.src));
});

gulp.task('pngSprite', ['svgSprite'], function() {
    return gulp.src(paths.images.src + paths.sprite.svg)
        .pipe(svg2png())
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.images.src));
});

gulp.task('sprite', ['pngSprite']);

gulp.task('png_sprite', function () {
    return gulp.src('src/sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite-png.png',
            imgPath: '../img/sprite-png.png',
            cssName: '../scss/utils/_sprite-png.scss',
            cssTemplate: 'src/scss/utils/sprite-png-template.scss.handlebars',
            algorithm: 'diagonal',
            padding: 5
        }))
        .pipe(gulp.dest(paths.images.src));
});

gulp.task('favicon', function() {
    return gulp.src('src/favicon/*')
    .pipe(plumber())
    .pipe(gulp.dest(finishPath))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
    .pipe(plumber())
    .pipe(gulp.dest(finishPath+'/fonts'));
});

gulp.task('images', ['favicon', 'sprite', 'png_sprite'], function() {
    return gulp.src('src/img/*')
    .pipe(plumber())
    .pipe(gulp.dest(finishPath+'/img'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: finishPath
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('build', ['bower', 'html', 'images', 'fonts', 'css', 'js']);

gulp.task('build_static', ['bower', 'html_static', 'images', 'fonts', 'css_static', 'js']);

gulp.task('default', ['html', 'images', 'css', 'js', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/html/**/*.twig", ['html']);
    gulp.watch(paths.sprite.src, ['sprite', 'png_sprite']).on('change', function(evt) {
        changeEvent(evt);
    });
    gulp.watch("src/img/*", ['images']);
    gulp.watch(finishPath+"/*.html", ['bs-reload']);
});