

var config = require('../package.json').config || {};
var path = require("path");
var Builder = require('systemjs-builder');

// set basepath
var builder = new Builder(config.basepath, './build/system-config.js');

if (Array.isArray(config.js)) {
	console.log('is array');
} else {
	console.log('is object');
}

config.js.forEach(function(bundle) {
	
	let outputPath = path.join(config.basepath, bundle.output);

	builder
		.buildStatic(bundle.input,  outputPath, { minify: false, sourceMaps: true })
		.then(function() {
			console.log('bundled!');
		});
});