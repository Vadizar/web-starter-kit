# 1000.tech Web Starter Kit

Starter Kit, which contains all the standard Front-end Developer tasks:

* Build styles and layout;
* Image optimization, support WEBP; 
* Favicons generate for all platforms;
* Creating icon-font from SVG;
* JS and CSS minification; 
* Layout standardization. 

## Benefits
* Works Offline;
* Ability to Install the Web App;
* Mobile Device Support.

## Install

```smartyconfig
$ Install Node.js
$ npm -g i gulp && npm i -g bower
$ git clone https://github.com/1000tech/web-starter-kit.git MyApp && cd MyApp
$ npm i && bower i
$ gulp
```
## Usage

Run ``gulp dev`` if you are working on project. Or ``gulp``, if you want to compile a template. The project is compiled into the ``public`` folder.

## Commands

### Run tasks:
```smartyconfig
gulp
```

### Run development tasks with sourcemaps and notify errors:
```smartyconfig
gulp dev
```

### Run on your host:
```smartyconfig
gulp dev --port 7000
```

### Selectors minify:
```smartyconfig
gulp gs
```

### Generate icon font:
```smartyconfig
gulp iconfont
```

### Favicons generate:
```smartyconfig
gulp favicons
```

### Delete build files:
```smartyconfig
gulp clean
```

## Tested on:
 
**NPM v5.5.1** and **NodeJS v8.9.0 LTS**

## Demo
Used on [MobiDevices](https://mobidevices.ru)

## Developer
Developed by [1000.tech](http://1000.tech) company. 