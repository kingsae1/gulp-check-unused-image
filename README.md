# gulp-check-unused-image

## Usage

To use gulp please ensure gulp is installed globally as well as locally. 
```
npm install gulp -g
npm install gulp -D
```

Install `gulp-check-unused-image` as a development dependency
```shell
npm install gulp-check-unused-image -D
```

Add it to your `gulpfile`
```javascript
var gulp  = require('gulp');
var check = require('gulp-check-unused-image');
var util = require('gulp-util');

gulp.task('check', function () {
  gulp.src(['test/**/*.*'])
    .pipe(check()
    .on('error', function (err) {
      util.beep();
      util.log(util.colors.red(err));
    });
});
```

This plugin will throw errors on the file stream and it is up to you to handle them. The first error found will stop the stream showing you what was found and what file it was found in.

### Changelog
#### 2017/02/07 - 1.0.0 - First release
#### 2017/02/07 - 1.0.1 - Release Readme.md