require! <[gulp nib]>
connect    = require \gulp-connect
livescript = require \gulp-livescript
babel      = require \gulp-babel
stylus     = require \gulp-stylus

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

gulp.task \build <[js:app css:app]>

gulp.task \watch <[build]> ->
  gulp
    ..watch "#{path.src}/**/*.{js,ls}" <[js:app]>
    ..watch "#{path.src}/**/*.styl"    <[css:app]>

gulp.task \default <[watch]>
