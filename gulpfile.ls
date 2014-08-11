require! <[gulp gulp-concat gulp-filter gulp-flatten]>
require! <[bower main-bower-files]>
connect    = require \gulp-connect
gutil      = require \gulp-util
livescript = require \gulp-livescript
stylus     = require \gulp-stylus
jade       = require \gulp-jade

path =
  src:   './src'
  build: '.'

gulp.task \bower ->
  bower.commands.install!on \end (results) ->
    for pkg, data of results
      gutil.log do
        gutil.colors.magenta data.pkgMeta.name
        gutil.colors.cyan data.pkgMeta.version
        "installed"

gulp.task \fonts:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.eof **/*.ttf **/*.svg **/*.woff]>
    .pipe gulp-flatten!
    .pipe gulp.dest "#{path.build}/fonts"

gulp.task \images:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.jpg **/*.jpeg **/*.png **/*.gif]>
    .pipe gulp-flatten!
    .pipe gulp.dest "#{path.build}/images"

gulp.task \js:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.js !**/*.min.js]>
    .pipe gulp-concat 'vendor.js'
    .pipe gulp.dest "#{path.build}/js"

gulp.task \js:app ->
  gulp.src [
    "#{path.src}/**/*.ls"
  ]
    .pipe gulp-concat 'main.ls'
    .pipe livescript!
    .pipe gulp.dest "#{path.build}/js"
    .pipe connect.reload!

gulp.task \css:vendor <[bower]> ->
  gulp.src main-bower-files!
    .pipe gulp-filter <[**/*.css !**/*.min.css]>
    .pipe gulp-concat 'vendor.css'
    .pipe gulp.dest "#{path.build}/css"

gulp.task \css:app ->
  gulp.src [
    "#{path.src}/**/*.styl"
  ]
    .pipe gulp-concat 'style.styl'
    .pipe stylus use: <[nib]>
    .pipe gulp.dest "#{path.build}/css"
    .pipe connect.reload!

gulp.task \vendor <[fonts:vendor images:vendor js:vendor css:vendor]>

gulp.task \html ->
  gulp.src "#{path.src}/*.jade"
    .pipe jade!
    .pipe gulp.dest path.build
    .pipe connect.reload!

gulp.task \build <[vendor js:app css:app html]>

gulp.task \watch <[build]> ->
  gulp
    ..watch 'bower.json'             <[vendor]>
    ..watch "#{path.src}/**/*.ls"    <[js:app]>
    ..watch "#{path.src}/**/*.styl"  <[css:app]>
    ..watch "#{path.src}/*.jade"     <[html]>

gulp.task \server <[watch]> ->
  connect.server do
    root: path.build
    livereload: on

gulp.task \default <[server]>
