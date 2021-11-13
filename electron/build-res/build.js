'use strict';
//...   ...
var packager = require('electron-packager');
var pkg = require('../build/package.json');

var opts = {
    overwrite: true,
    asar: false,
    platform: 'win32',
    arch: 'ia32',
    icon: 'electron/build-res/icon.ico',
    prune: true,
    dir: './electron/build',
    out: './electron/electron-packager',
    appVersion: pkg.version,
    appCopyright: pkg.copyright,
    name: pkg.name,
    win32metadata: {
    	CompanyName: pkg.authors,
    	ProductName: pkg.name,
    	FileDescription: pkg.description,
    	OriginalFilename: `${pkg.name}.exe`
    }
};

// Build the electron app
console.log('Launching task to package binaries for ' + opts.name + ' v' + opts['appVersion']);

packager(opts, function (err, appPath) {
    console.log('<- packagerDone() ' + err + ' ' + appPath);
    console.log('All done!');
});