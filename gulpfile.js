let projects_folder = 'dist';
let source_folder = 'src';

let patch = {
    build: {
        html: projects_folder+'/',
        css: projects_folder + '/css/',
        js: projects_folder + '/js/',
        img: projects_folder + '/img/',
        fonts: projects_folder + '/fonts/',
    },
    src: {
        html: [source_folder +'/*.html', "!" + source_folder + "/_*.html"],
        css: source_folder + '/css/**.scss',
        js: source_folder + '/js/main.js',
        img: source_folder + '/img/*.{jpg,png,svg}',
        fonts: source_folder + '/fonts/*',
    },
    watch: {
        html: source_folder +'/**/*.html',
        css: source_folder + '/css/**/*.scss',
        js: source_folder + '/js/main.js',
        img: source_folder + '/img/*.{jpg,png,svg}',
    },
    clean: './' + projects_folder + '/'
};

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass")(require('sass')),
    autoprefixer = require("gulp-autoprefixer"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + projects_folder + "/"
        },
        port:3000,
        notify: false
    });
}

function html() {
    return src(patch.src.html)
        .pipe(fileinclude())
        .pipe(dest(patch.build.html))
        .pipe(browsersync.stream());
}

function js() {
    return src(patch.src.js)
        .pipe(dest(patch.build.js))
        .pipe(fileinclude())
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(patch.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(patch.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(patch.build.img))
        .pipe(browsersync.stream());
}

function fonts() {
    return src(patch.src.fonts)
        .pipe(dest(patch.build.fonts));
}

function css() {
    return src(patch.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowsersList: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(patch.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        
        .pipe(dest(patch.build.css))
        .pipe(browsersync.stream());
}

function watchFiles(params) {
    gulp.watch([patch.watch.html], html);
    gulp.watch([patch.watch.css], css);
    gulp.watch([patch.watch.js], js);
    gulp.watch([patch.watch.img], images);
}

function clean(params) {
    return del(patch.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;