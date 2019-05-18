const rp = require('request-promise');
const ch = require('cheerio');

function displayMeaning(meaning) {
	console.log(meaning[1]);
}

function getMeaning(displayMeaning, url, search) {
	var meaning;
	rp(url+search).then(function(html) {
			var meanings = ch('li', html).text();
			meanings = meanings.split("S: ");
			meaning = meanings;
			displayMeaning(meaning);
	});
}

getMeaning(displayMeaning, 'http://wordnetweb.princeton.edu/perl/webwn?s=', 'mumbai');