#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

var target = "dev";
if (process.env.TARGET) {
    target = process.env.TARGET;
}

if (rootdir) {
    var ourconfigfile = path.join(rootdir, "config", "project.json");
    var configobj = JSON.parse(fs.readFileSync(ourconfigfile, 'utf8'));

    var filestoreplace = [
        "www/config.xml",
    ];
    filestoreplace.forEach(function(val, index, array) {
        var fullfilename = path.join(rootdir, val);
        if (fs.existsSync(fullfilename)) {
           // placing Urban Airship in production (or development) if following command is executed
        	// TARGET=prod cordova build ios
            replace_string_in_file(fullfilename, "com.urbanairship.in_production' value='false", configobj[target].ua);
            replace_string_in_file(fullfilename, "com.urbanairship.in_production' value='true", configobj[target].ua);
            
        } else {
            //console.log("missing: "+fullfilename);
        }
    });

}
