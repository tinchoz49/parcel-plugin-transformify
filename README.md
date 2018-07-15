# Parcel Transformify Plugin
> This is an **experimental** :microscope: parcel plugin to run your **browserify transforms**.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![Build Status](https://travis-ci.org/tinchoz49/parcel-plugin-transformify.svg?branch=master)](https://travis-ci.org/tinchoz49/parcel-plugin-transformify)

## Usage

### Install transformify
```
$ npm install --save-dev parcel-plugin-transformify
```

### Configure your transforms using the `browserify` key in the package.json

```json
{
  ...
  "browserify": {
    "transform": [
      ...
    ]
  }
}
```
