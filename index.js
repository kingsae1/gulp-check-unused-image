'use strict';
var through     = require('through2');
var rocambole   = require('rocambole');
var gutil       = require('gulp-util');

var imageObjs = {},
    imageObj = {},
    imageFileObj = {};
var variable;

var checkImageVariable = function(string){
    rocambole.moonwalk(string, function (node) {
        variable = node.toString();

        if( node.type == "Literal" && variable.indexOf('.png')!== - 1 ){
            if(variable.indexOf("http")!== -1){
                return ;
            }
            variable = variable.substr(0 ,variable.indexOf('.png')+4);
            variable = variable.substr(variable.lastIndexOf("/")+1,variable.length);
            variable = variable.replace(/'/gi, '');
            variable = variable.replace(/"/gi, '');

            if( variable!== ".png" ){
                if( imageObjs[variable] >= 1 ){
                    imageObjs[variable] ++;
                }else{
                    imageObjs[variable] = 1;
                }
            }
        }
    });
    return imageObjs;
}


module.exports = function( file, opt ){
    return through.obj(function(file, encoding, callback){
        if (file.isNull()) return callback(null, file); // pass along
        if (file.isStream()) return callback(new Error('gulp-check-ununsed-image: Streaming not supported'));

        try {
            imageObj = checkImageVariable(file.contents.toString());

            this.push( file );
        } catch (err) {
            var imageFile = file.relative;
            if( imageFile.indexOf(".png")!== -1 ){
                var imageFileName = imageFile.substr(imageFile.lastIndexOf("\\")+1,imageFile.length);

                if( imageFileObj[imageFileName] >= 1 ){
                    imageFileObj[imageFileName] ++;
                }else{
                    imageFileObj[imageFileName] = 1;
                }
            }
        }
        callback( null, imageObj );
    }, function( callback ){

        for( var key in imageFileObj ){
            if(!imageObj[key]){
                gutil.log('gulp-check-unused-image: Not use file ' + gutil.colors.blue(key) + ' in your project');
            }
        }

        for( var key in imageObj ){
            if(!imageFileObj[key]){
                gutil.log('gulp-check-unused-image: Not use variable ' + gutil.colors.magenta(key) + ' in your project');
            }
        }

        callback();
    });
}