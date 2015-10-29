#!/usr/bin/env node

/*
	#To-do

	Read this again:
	http://javascriptplayground.com/blog/2015/02/promises/

	// stream instead? https://github.com/davidrekow/less-stream

	• [ ] autoprefixer
		- [ ] Allow running without sourcemap

	• [ ] clean-css
		- [ ] create clean-css function

	• [ ] Watch
		– [ ] Use sourcemaps to grab list of dependencies to watch?
			• So when multiple root less files are used, only the correct less files are compiled

	• [ ] Setup build.js as script with arguments — to allow dev / live / test

	#Notes

	• Need common interface when returning css/map for promises
		input = {
			css, map, 	
		}
	• Sourcemap is optional

	folder structure:
		/build/
			less.js
			autoprefix.js
			clean-css.js
			-
			browserify.js

	Want to be able to do `npm run dev`, which:
		- runs less, autoprefixer, with sourcemaps, and watches for changes

	Want to be able to do `npm run dev-test`, which:
		– runs less, autoprefixer, clean-css with sourcemaps, and watches for changes

	Want to be able to do `npm run build`, which:
		– runs less, autoprefixer, clean-css, without sourcemaps

*/


var fs = require('fs'),
	path = require('path'),
	less = require('less'),
	autoprefixer = require('autoprefixer-core'),
	postcss = require('postcss'),
	config = require('../package.json').config || {};


function FileList(items, root) {

	if (!(this instanceof FileList)) {
		return new FileList(items, root);
	}

	var files = this.files = [];

	if (items.length) { // is iterable

		items.forEach(function(item) {

			files.push({
				input : path.join(root, item.input),
				dist : path.join(root, item.output),
				map : path.join(root, item.output + '.map')
			});
		});

	} else { // is single

		files.push({
			input : path.join(root, items.input),
			dist : path.join(root, items.output),
			map : path.join(root, items.output + '.map')
		});
	}
}

FileList.prototype.getFileByInput = function(path) {
	// return first file with same input
	return this.files.some(function(file) {
		return (file.input === path) ? file.input : false;
	});
}

var lessfilelist = new FileList(config.less, config.root);

console.log(lessfilelist);


function watch() {

	// https://www.npmjs.com/package/chokidar

	// dev or test?
	
	// run less once

	// get imports

	// foreach import, watch.

	// on change, rerun less on path.input

	// update imports

		// loop over, if added. add.
		// loop over imports, if not in new imports, remove.
}

function run(env) {

	if (env === 'dev') {

		// do intial less 
		// get imports
		// add callback to less to update imports
		// watch

	} else if (env === 'test') {

		// do less 
		// get imports
		// add callback to less to update imports

	} else if (env === 'production') {

		// do less

	}
}



function addSourceMapReference(css, sourcemapPath) {

	var sourcemapPath = path.basename(sourcemapPath),
		reference = '\n/*# sourceMappingURL={path} */';

	// return css
	return css + reference.replace('{path}', sourcemapPath);
}



function autoprefix(css, map, fromPath, toPath) {

	// options
	var autoprefixerOptions = { 
		browsers: config.autoprefix || ['Firefox > 20', '> 1%']
	};

	var processOptions = {
		from: fromPath,
		to: toPath,
		map: { 
			prev: map,
			inline: false
		}
	};

	// transform output to next promise output
	function transform(output) {

		return new Promise(function(resolve, reject) {

			if (!output.warnings().length) {

				// pass on result
				resolve({
					css : output.css,
					map : output.map.toString()
				});

			} else {

				reject(output.warnings()); 
				// array of warnings to loop over and:
				// output.warnings().forEach(function(warning) {
					// console.warn(warn.toString());
				// });
			}
		});
	}

	// get autoprefixer processor
	var processor = postcss([ autoprefixer(autoprefixerOptions) ]);

	// return promise
	return processor.process(css, processOptions).then(transform);
}


function lessbuild(filelist) {

	filelist.forEach(function(file) {

		// less options
		var options = {
			filename : path.resolve(file.input),
			sourceMap : {} // allows output.css and output.map
		};

		// read input file
		fs.readFile(file.input, function(error, data) {
			// get file contents
			data = data.toString();

			// render less
			less
				.render(data, options)
				.then(function(output) {

					return new Promise(function(resolve, reject) {

					});

				}, function(error) {
					// log any errors to the console
					console.warn(error);
			});
		});

	});


	// read input file
	fs.readFile(filelist.files[0].input, function(error, data) {

		// get file contents
		data = data.toString();

		

		// render less
		less
			.render(data, options)
			.then(function(output) {

				// imports
				// console.log(output.imports);

				// output.css = string of css
				// output.map = string of sourcemap

				// add map reference to end of css file
				// output.css = addSourceMapReference(output.css, paths.sourcemap);

				autoprefix(output.css, output.map, filelist.files[0].output, filelist.files[0].sourcemap).then(function(test) {
					// next
				})

				// TODO: cleancss

				// make directory if it doesn't exist
				// fs.mkdir(path.dirname(getPaths()[0].dist), function() {

				// 	// write css file
				// 	fs.writeFile(getPaths()[0].dist, output.css);
				// 	// write map file
				// 	fs.writeFile(getPaths()[0].map, output.map);
				// });

			}, function(error) {
				// log any errors to console
				console.warn(error);
			});

	});

}

