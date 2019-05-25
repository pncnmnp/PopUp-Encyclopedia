var stemmer = (function(){
	var step2list = {
			"ational" : "ate",
			"tional" : "tion",
			"enci" : "ence",
			"anci" : "ance",
			"izer" : "ize",
			"bli" : "ble",
			"alli" : "al",
			"entli" : "ent",
			"eli" : "e",
			"ousli" : "ous",
			"ization" : "ize",
			"ation" : "ate",
			"ator" : "ate",
			"alism" : "al",
			"iveness" : "ive",
			"fulness" : "ful",
			"ousness" : "ous",
			"aliti" : "al",
			"iviti" : "ive",
			"biliti" : "ble",
			"logi" : "log"
		},

		step3list = {
			"icate" : "ic",
			"ative" : "",
			"alize" : "al",
			"iciti" : "ic",
			"ical" : "ic",
			"ful" : "",
			"ness" : ""
		},

		c = "[^aeiou]",          // consonant
		v = "[aeiouy]",          // vowel
		C = c + "[^aeiouy]*",    // consonant sequence
		V = v + "[aeiou]*",      // vowel sequence

		mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
		meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
		mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
		s_v = "^(" + C + ")?" + v;                   // vowel in stem

	function dummyDebug() {}

	function realDebug() {
		console.log(Array.prototype.slice.call(arguments).join(' '));
	}

	return function (w, debug) {
		var
			stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4,
			debugFunction,
			origword = w;

		if (debug) {
			debugFunction = realDebug;
		} else {
			debugFunction = dummyDebug;
		}

		if (w.length < 3) { return w; }

		firstch = w.substr(0,1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) { 
			w = w.replace(re,"$1$2"); 
			debugFunction('1a',re, w);

		} else if (re2.test(w)) {
			w = w.replace(re2,"$1$2"); 
			debugFunction('1a',re2, w);
		}

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
				debugFunction('1b',re, w);
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				debugFunction('1b', re2, w);

				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

				if (re2.test(w)) { 
					w = w + "e"; 
					debugFunction('1b', re2, w);

				} else if (re3.test(w)) { 
					re = /.$/; 
					w = w.replace(re,""); 
					debugFunction('1b', re3, w);

				} else if (re4.test(w)) { 
					w = w + "e"; 
					debugFunction('1b', re4, w);
				}
			}
		}

		// Step 1c
		re = new RegExp("^(.*" + v + ".*)y$");
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			w = stem + "i";
			debugFunction('1c', re, w);
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
				debugFunction('2', re, w);
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
				debugFunction('3', re, w);
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
				debugFunction('4', re, w);
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
				debugFunction('4', re2, w);
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
				debugFunction('5', re, re2, re3, w);
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re,"");
			debugFunction('5', re, re2, w);
		}

		// and turn initial Y back to y
		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}


		return w;
	}
})();

function getSelectedTextObj() {
	var textObj;
	if (typeof window.getSelection != "undefined") {
		textObj = window.getSelection();
	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		textObj = document.selection.createRange().text;
	}
	fetch_meaning(textObj);
}

function fetch_meaning(newWordObj) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			var search = myObj[word];
			var stemmed = stemmer(word);
			if (search != undefined) {
				display_meaning(myObj[word], newWordObj);
			} else if (myObj[stemmed] != undefined && myObj[stemmed] != stemmed) {
				display_meaning(myObj[stemmed], newWordObj);
			} else {
				fetch_wiki(word, newWordObj);
			}
		}
	};

	var wordObj = newWordObj;
	var word = wordObj.toString().trim().toLowerCase();
	xmlhttp.open("GET", chrome.extension.getURL("popup/dictionary.txt"), true);
	xmlhttp.overrideMimeType("text/plain");
	xmlhttp.send();
}

function fetch_wiki_summary(newWord, newWordObj) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		var summary;
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			for(var key in response["query"]["pages"]) {
				if (response["query"]["pages"]) {
					if (response["query"]["pages"][key]["extract"]) {
						summary = response["query"]["pages"][key]["extract"];
						break;
					}
				}
			}

			if (summary != undefined) {
				display_meaning(summary, newWordObj);
			} else {
				display_meaning("https://www.google.com/search?q="+ newWord +"</a>" + newWord, newWordObj);
			}
		}
	}

	var api_head = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="
	var api_tail = "&origin=*"
	xmlhttp.open("GET", api_head+newWord+api_tail, true);
	/* This is necessary for mediawiki API's */
	xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.send();
}

function fetch_wiki(newWord, newWordObj) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if (response[2] != undefined && response[2][0] != undefined && response[2][0] != "") {
				if (response[2][0].substr(-13) == "may refer to:") {
					display_meaning(response[2][1], newWordObj);
				} else {
					display_meaning(response[2][0], newWordObj);
				}
			}

			else if(word != "") {
				fetch_wiki_summary(newWord, newWordObj);
			}
		}
	};

	var wordObj = newWordObj;
	var word = wordObj.toString().trim().toLowerCase();
	var front_str = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=";
	var end_str = "&limit=2&namespace=0&format=json";
	xmlhttp.open("GET", front_str+word+end_str, true);
	xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.send();
}

function display_meaning(meaning, textObj) {
	if (textObj.toString() && textObj.toString().trim().split(" ").length <= 2) {
		if (meaning.search("</a>") != -1) {
			var url_arr = meaning.split("</a>");
			var googleURL = document.createElement("a");
			googleURL.href = url_arr[0];
			googleURL.title = url_arr[1];
			googleURL.appendChild(document.createTextNode(url_arr[1]));
			googleURL.style.color = "#ff0000";

			var meaningPara = document.createElement("div");
			meaningPara.setAttribute("id", "infoDiv");
			meaningPara.setAttribute("class", "tooltipDiv");
			meaningPara.appendChild(
				document.createTextNode("David is unable to help 🙂. For a change let the Goliath serve you: ")
			);
			meaningPara.appendChild(googleURL);

			if(document.getElementsByClassName("tooltipDiv").length) {
				var OldMeaning = document.getElementById("infoDiv");
				document.documentElement.replaceChild(meaningPara, OldMeaning);
			}

			else {
				document.documentElement.appendChild(meaningPara);
			}
		}

		else {
			var NewPara = document.createElement("div");
			NewPara.setAttribute("id", "infoDiv");
			NewPara.setAttribute("class", "tooltipDiv");
			NewPara.appendChild(document.createTextNode(meaning));

			if (document.getElementsByClassName("tooltipDiv").length) {
				var OldPara = document.getElementById("infoDiv");
				document.documentElement.replaceChild(NewPara, OldPara);
			}

			else {
				document.documentElement.appendChild(NewPara);
			}
		}	

		var oRect = textObj.getRangeAt(0).getBoundingClientRect();
		var leftOffset, topOffset;
		var pageWidth, pageHeight;
		var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0],

		pageWidth = w.innerWidth || e.clientWidth || g.clientWidth,
		pageHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

		leftOffset = oRect.left + oRect.width + 1 + 12;
		if (300 + leftOffset > pageWidth - 12) {
			leftOffset = pageWidth - 350 - 12;
		}

		topOffset = oRect.top;
		if (topOffset + 12 > pageHeight) {
			topOffset -= 12;
		}

		leftOffset += window.scrollX;
		topOffset += window.scrollY;

		document.getElementById("infoDiv").style.display = "block";
		document.getElementById("infoDiv").style.width = "250px";
		document.getElementById("infoDiv").style.height = "300px";
		document.getElementById("infoDiv").style.overflow = "auto";
		document.getElementById("infoDiv").style.zIndex = "101";
		document.getElementById("infoDiv").style.backgroundColor = "#F5DEB3";
		document.getElementById("infoDiv").style.border = "3px solid #666";
		document.getElementById("infoDiv").style.padding = "12px 12px 12px 12px";
		document.getElementById("infoDiv").style.borderRadius = "25px 0px 25px 0px";
		document.getElementById("infoDiv").style.position = "absolute";
		document.getElementById("infoDiv").style.fontFamily = "monospace";

		document.getElementById("infoDiv").style.left = String(leftOffset) + "px";
		document.getElementById("infoDiv").style.top = String(topOffset) + "px";
	}

	else {
		document.getElementById("infoDiv").style.display = "none";
	};
};

document.addEventListener("click", 
	function(e) {
		if(document.getElementById("infoDiv")) {
			document.getElementById("infoDiv").style.display = "none";
		}
});

document.addEventListener("dblclick", 
	function(e) {
		getSelectedTextObj();
});