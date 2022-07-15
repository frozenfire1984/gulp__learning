const {src, dest} = require("gulp");
const gulpif = require("gulp-if");
const imagemin = require("gulp-imagemin");
const log = require("fancy-log");

const {mode} = require("../env");
const f = require("../output_format");

const images = () => {
	return src(['src/images/**/*.*'], {base: 'src'})
	.pipe(gulpif(mode==="prod", imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: false},
				{cleanupIDs: false}
			]
		})
	])))
	.pipe(dest('dist'))
	.on('finish', () => {
		log(`${f.bold}${f.reverse} IMAGES ${f.reset} ${mode === "prod" ? "compressed and" : ""} copied!`)
	});
}

module.exports = images