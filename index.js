'use strict';
var through     = require('through2');
var rocambole   = require('rocambole');
var gutil       = require('gulp-util');

var imageObjs = {},
    imageFileObj = {};
var variable,
    imageType,
    imageCheck;
var imageTypeArray = [".jpg",".gif",".bmp",".png",".tif",".raw","psd"];

var checkImageVariable = function(string){
    rocambole.moonwalk(string, function (node) {
        variable = node.toString();

        if( node.type == "Literal" ){
            imageCheck = isImageFile(variable);

            if(imageCheck){
                imageType = imageCheck;
            }else if(variable.indexOf("http")!== -1){
                return ;
            }else{
                return;
            }

            variable = variable.substr(0 ,variable.indexOf(imageType)+4);
            variable = variable.substr(variable.lastIndexOf("/")+1,variable.length);
            variable = variable.replace(/'/gi, '');
            variable = variable.replace(/"/gi, '');

            if( variable!== imageType ){
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

var isImageFile = function( stringFIle ){
    if(stringFIle.indexOf(imageTypeArray[0]) !== -1){
        return imageTypeArray[0];
    }else if(stringFIle.indexOf(imageTypeArray[1]) !== -1){
        return imageTypeArray[1];
    }else if(stringFIle.indexOf(imageTypeArray[2]) !== -1){
        return imageTypeArray[2];
    }else if(stringFIle.indexOf(imageTypeArray[3]) !== -1){
        return imageTypeArray[3];
    }else if(stringFIle.indexOf(imageTypeArray[4]) !== -1){
        return imageTypeArray[4];
    }else if(stringFIle.indexOf(imageTypeArray[5]) !== -1){
        return imageTypeArray[5];
    }else if(stringFIle.indexOf(imageTypeArray[6]) !== -1){
        return imageTypeArray[6];
    }else{
        return false;
    }
}

module.exports = function( file, opt ){
    return through.obj(function(file, encoding, callback){
        if (file.isNull()) return callback(null, file); // pass along
        if (file.isStream()) return callback(new Error('gulp-check-ununsed-image: Streaming not supported'));

        try {
            checkImageVariable(file.contents.toString());

            this.push( file );
        } catch (err) {
            var imageFile = file.relative;

            if(isImageFile(imageFile)){

                var imageFileName = imageFile.substr(imageFile.lastIndexOf("\\")+1,imageFile.length);

                if( imageFileObj[imageFileName] >= 1 ){
                    imageFileObj[imageFileName] ++;
                }else{
                    imageFileObj[imageFileName] = 1;
                }
            }
        }
        callback( null );
    }, function( callback ){

        for( var key in imageFileObj ){
            if(!imageObjs[key]){
                gutil.log('gulp-check-unused-image: Not use file ' + gutil.colors.blue(key) + ' in your project');
            }
        }

        for( var key in imageObjs ){
            if(!imageFileObj[key]){
                gutil.log('gulp-check-unused-image: Not use variable ' + gutil.colors.magenta(key) + ' in your project');
            }
        }

        callback();
    });
}