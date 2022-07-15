const {src, dest} = require("gulp");
const log = require("fancy-log");
const f = require("../output_format");

const fonts = () => {
	return src(['src/fonts/**/*.*'],{base: 'src'})
	.pipe(dest('dist'))
	.on('finish', () => {
		log(`${f.bold}${f.reverse} FONTS ${f.reset} copied!`)
	});
}

module.exports = fonts