"use strict";

var root = "app/**/";
var	dest = "www/";

module.exports = {
	root: root,
  bower: 'bower.json',
  env: 'env.json',
	dest: dest,
  destBower: dest + 'lib/',
  icons: root + '/sass/icons/*',
	html: [root + 'www/**/*', '!'+root+'www/**/_*'],
	binJs: root + "**/.bin/*.js",
	destJs: dest + 'js/',
	binCss: root+"**/.bin/*.css",
	destCss: dest + 'css/',
  destFonts: dest + 'fonts/',
  destIcons: dest + 'css/icons/'
};
