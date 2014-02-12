#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//
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

	    
    // CONFIGURE HERE
    // with the names of the files that contain tokens you want replaced.  Replace files that have been copied via the prepare step.
    var filestoreplace = [
        "platforms/android/AndroidManifest.xml",
        "platforms/android/res/xml/config.xml"
    ];
    filestoreplace.forEach(function(val, index, array) {
        var fullfilename = path.join(rootdir, val);
        if (fs.existsSync(fullfilename)) {
            // removing permissions added by Urban Airship by default
        	replace_string_in_file(fullfilename, '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />', "");
        	replace_string_in_file(fullfilename, '<service android:label="Segments Service" android:name="com.urbanairship.location.LocationService" />', "");
        	replace_string_in_file(fullfilename, '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />', "");
  
        	// removing onload param added by Urban Airship and causing errors
        	replace_string_in_file(fullfilename, '<param name="onload" value="true" />', "");
        	
        	// if compiled with the following command, remove debuggable from APK
        	// TARGET=prod cordova build android
            replace_string_in_file(fullfilename, 'android:debuggable="false"', configobj[target].debuggable);
            replace_string_in_file(fullfilename, 'android:debuggable="true"', configobj[target].debuggable);
        } else {
            console.log("missing: "+fullfilename);
        }
    });

}
