require! <[gulp nib]>
webpack    = require \gulp-webpack
connect    = require \gulp-connect
livescript = require \gulp-livescript
babel      = require \gulp-babel
stylus     = require \gulp-stylus
jade       = require \gulp-jade

path =
  src:    './src'
  dest:   './dest'
  build:  '.'

gulp.task \js:livescript ->
  gulp.src "#{path.src}/**/*.ls"
    .pipe livescript!
    .pipe gulp.dest "#{path.dest}/"

gulp.task \js:ecmascript ->
  gulp.src "#{path.src}/**/*.js"
    .pipe babel { presets: <[@babel/preset-env @babel/preset-react]> }
    .pipe gulp.dest "#{path.dest}/"

gulp.task \js:app <[js:livescript js:ecmascript]>

gulp.task \webpack <[js:app]> ->
  gulp.src "#{path.dest}/main.js"
    .pipe webpack do
      #devtool: \source-map
      context: "#{path.dest}/"
      output:
        filename: 'build.js'
    .pipe gulp.dest "#{path.build}/js"
    .pipe connect.reload!

gulp.task \css:app ->
  gulp.src "#{path.src}/**/main.styl"
    .pipe stylus use: [nib!]
    .pipe gulp.dest "#{path.build}/css"
    .pipe connect.reload!
  gulp.src [
    "#{path.src}/**/*.styl"
    "!#{path.src}/**/main.styl"
  ]
    .pipe stylus use: [nib!]
    .pipe gulp.dest "#{path.dest}/"

gulp.task \html ->
  gulp.src "#{path.src}/*.jade"
    .pipe jade!
    .pipe gulp.dest path.build
    .pipe connect.reload!

gulp.task \build <[webpack css:app html]>

gulp.task \watch <[build]> ->
  gulp
    ..watch "#{path.src}/**/*.ls"    <[webpack]>
    ..watch "#{path.src}/**/*.styl"  <[css:app]>
    ..watch "#{path.src}/*.jade"     <[html]>

gulp.task \server <[watch]> ->
  connect.server do
    root: path.build
    livereload: on

gulp.task \default <[server]>
