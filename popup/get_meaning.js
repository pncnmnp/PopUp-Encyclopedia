var subButton = document.getElementById("sub-button");

/* Clicks the button when ENTER key is pressed */
document.getElementById("input-meaning")
	.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		document.getElementById("sub-button").click();
	}
});

/* Fetches the meaning when button is CLICKED */
subButton.addEventListener("click", fetch_dictionary, false);

/* Fetches meaning when TEXT is DOUBLE CLICKED  */
document.addEventListener("dblclick", 
	function(e) {
		fetch_dictionary(window.getSelection().toString());
});

/*
   Displays meaning by creating a 'p' tag inside 'meaning' class if it does not exists,
   Else it replaces the 'p' tag with new tag to prevent appending of text.
*/
function display_meaning(meaning) {
		var parent = document.querySelector(".meaning");
		if (meaning.search("</a>") != -1) {
			var url_arr = meaning.split("</a>");
			var googleURL = document.createElement("a");
			googleURL.href = url_arr[0];
			googleURL.title = url_arr[1];
			googleURL.appendChild(document.createTextNode(url_arr[1]));

			var meaningPara = document.createElement("p");
			meaningPara.appendChild(
				document.createTextNode("David is unable to help 🙂. For a change let the Goliath serve you: ")
			);
			meaningPara.appendChild(googleURL);

			if(document.querySelector(".meaning p") == null) {
				parent.appendChild(meaningPara);
			}

			else {
				var prevNode = document.querySelector(".meaning p");
				parent.replaceChild(meaningPara, prevNode);
			}
		}

		else {
			meaningPara = document.createElement("p");
			meaningPara.appendChild(document.createTextNode(meaning));
			prevNode = document.querySelector(".meaning p");

			if(prevNode == null) {
				parent.appendChild(meaningPara);
			}

			else {
				parent.replaceChild(meaningPara, prevNode);
			}
		}
}

/*
    As a last resort, it tries getting a summary from wikipedia,
    if no result found, will return a link to google query wrt the word.
*/
function fetch_wiki_summary(word) {
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
				display_meaning(summary);
			}

			else {
				display_meaning("https://www.google.com/search?q="+word+"</a>"+word);
			}
		}
	}

	var api_head = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="
	var api_tail = "&origin=*"
	xmlhttp.open("GET", api_head+word+api_tail, true);
	/* This is necessary for mediawiki API's */
	xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.send();
}

/*
    Searches Wikipedia using mediawiki's API, 
    if no result found, it will call fetch_wiki_summary().
*/
function fetch_wiki(api_link, word) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if (response[2] != undefined && response[2][0] != undefined && response[2][0] != "") {
				// document.getElementById("meaning").innerHTML = response[2][0];
				// checking the 'may refer to:' condition
				if (response[2][0].substr(-13) == "may refer to:") {
					display_meaning(response[2][1]);
				}
				else {
					display_meaning(response[2][0]);
				}
			}

			else if(word != "") {
				fetch_wiki_summary(word);
				// document.getElementById("meaning").innerHTML = "Makes no sense to me 🙂. Let the giant serve you: <a href='http://www.google.com/search?q="+word+"'> google </a>";
			}
		}
	}

	xmlhttp.open("GET", api_link, true);
	/* This is necessary for mediawiki API's */
	xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.send();
}


/*
    The input's origin is segregated on the basis of double-click text or input-box text.
    The word[s] obtained is/are matched in the inbuilt dictionary,
    If no result found, the word[s] is/are stemmed and again searched,
    If still no result, fetch_wiki() is executed.
*/
function fetch_dictionary(new_word) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			var search = myObj[word];
			var stemmed = stemmer(word);
			if (search != undefined) { 
				// document.getElementById("meaning").innerHTML = myObj[word];
				display_meaning(myObj[word]);
			}	

			else if (myObj[stemmed] != undefined && myObj[stemmed] != stemmed) {
				// document.getElementById("meaning").innerHTML = myObj[stemmed];
				display_meaning(myObj[stemmed]);
			}

			else {
				var front_str = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=";
				var end_str = "&limit=2&namespace=0&format=json";
				fetch_wiki(front_str+word+end_str, word);
			}
		}
	};	

	// checks if the word is a double-click text
	if (new_word.toString() != "[object MouseEvent]") {
		var word = new_word.toString();
		word = word.toLowerCase();
		document.querySelector(".input-meaning").value = word;
	}

	// else word is from the input box
	else {
		var word = document.querySelector(".text-input input");
		word = word.value.toLowerCase();
	}
	// var word = document.getElementById("input-meaning").value.toLowerCase();
	xmlhttp.open("GET", "dictionary.txt", true);
	xmlhttp.overrideMimeType("text/plain");	
	xmlhttp.send();
}