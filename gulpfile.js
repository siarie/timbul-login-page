var gulp = require("gulp"),
  sass = require("gulp-sass"),
  nunjucksRender = require("gulp-nunjucks"),
  rename = require("gulp-rename"),
  cleanCSS = require("gulp-clean-css"),
  browserSync = require("browser-sync").create(),
  del = require("del");

var paths = {
  input: {
    dir: "./src/",
    scss: "./src/scss/main.scss",
    html: "./src/html/*.html",
  },
  output: {
    html: "./public",
    css: "./public/css",
  },
  watch: {
    public: "./public/**/*.{html,css}",
    sass: "./src/scss/**/*.scss",
  },
};

function cleanFirst(done) {
  del.sync([paths.output.html]);

  return done();
}

function style() {
  return gulp
    .src(paths.input.scss)
    .pipe(
      sass({
        outputStyle: "nested",
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(paths.output.css))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.output.css))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src(paths.input.html)
    .pipe(nunjucksRender.compile())
    .pipe(gulp.dest(paths.output.html));
}

function startServer(cb) {
  browserSync.init({
    server: {
      baseDir: paths.output.html,
    },
  });

  cb();
}

function reloadServer(cb) {
  browserSync.reload();
  cb();
}

function watch() {
  gulp.watch(paths.input.dir, gulp.series(style, html, reloadServer));
}

exports.default = gulp.series(style, html, startServer, watch);
exports.build = gulp.series(cleanFirst, style, html);
