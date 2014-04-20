# jsl-seed -- the seed for Jade, Stylus, LiveScript apps

This project is an application skeleton for anyone who loves Jade, Stylus and LiveScript.

It includes jQuery and semantci-ui as examples, but the core idea of this project is creating a minimum template without any additional libs.

## Usage

```bash
npm install
npm start
```

## Layout

```
# all of the sources
src/
  stylus/
    *.styl
  ls/
    *.ls
  *.jade

# all of the files which are created and watched by gulp
# you can host them with gh-pages
css/
  vendor.css  # from bower packages
  style.css   # from src/stylus/*.styl
js/
  vendor.js   # from bower packages
  main.js     # from src/ls/*.ls
*.html    # from src/index.jade
```
