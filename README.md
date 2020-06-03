# 1000.tech Web Starter Pack

This is Web Starter Kit, which contains all the standard Front-end Developer tasks:

* Build styles and layout;
* Image optimization, support WEBP; 
* Favicons generate for all platforms;
* Creating icon-font from SVG;
* JS and CSS minification; 
* CSS class obfuscation; 
* Layout standardization. 

## Benefits
* Works Offline;
* Uses compression algorithms Brotli;
* Supports HTTP/2;
* Ability to Install the Web App;
* Mobile Device Support.

## On MacOS
* Install [Xcode](https://developer.apple.com/xcode/download/)
* Install Node.js
* Install ``npm -g i gulp && npm i -g bower``

## On Windows
* Install Node.js
* Install all the required tools and configurations using Microsoft's windows-build-tools using ``npm install --global --production windows-build-tools`` from an elevated PowerShell or CMD.exe (run as Administrator).
* Install ``npm install -g gulp && npm install -g bower``
* Install ``npm install -g node-gyp``

## Install 1000.tech Web Starter

```smartyconfig
$ git clone https://github.com/1000tech/web-starter-kit.git MyApp && cd MyApp
$ npm i
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
### Run server:
```smartyconfig
node app
```
or
```smartyconfig
npm start
```

## Tested on:
 
**NPM v5.6.0** and **NodeJS v9.5.0**

## Demo
Used on [MobiDevices](https://mobidevices.ru)

## Developer
Developed by [1000.tech](https://1000.tech/en) company. 