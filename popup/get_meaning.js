var subButton = document.getElementById('sub-button');

/* Clicks the button when ENTER key is pressed */
document.getElementById("input-meaning")
	.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		document.getElementById("sub-button").click();
	}
});

/* Fetches the meaning when button is CLICKED */
subButton.addEventListener('click', fetch_dictionary, false);

/* Fetches meaning when TEXT is DOUBLE CLICKED  */
document.addEventListener('dblclick', function(e) {fetch_dictionary(window.getSelection().toString())});

/*
   Displays meaning by creating a 'p' tag inside 'meaning' class if it does not exists,
   Else it replaces the 'p' tag with new tag to prevent appending of text.
*/
function display_meaning(meaning) {
		var parent = document.querySelector('.meaning');
		if (document.querySelector('.meaning p') == null) {
			var meaningPara = document.createElement('p');
			meaningPara.innerHTML = meaning;
			parent.appendChild(meaningPara);
		}

		else {
			var prevNode = document.querySelector('.meaning p');
			var newNode = document.createElement('p');
			newNode.innerHTML = meaning;
			parent.replaceChild(newNode, prevNode);
		}
}

/*
    Searches Wikipedia using mediawiki's API, 
    if no result found, will return a link to google query wrt the word.
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
					browser.runtime.sendMessage(response[2][1]);
				}
				else {
					display_meaning(response[2][0]);
					browser.runtime.sendMessage(response[2][0]);
				}
			}

			else if(word != "") {
				// document.getElementById("meaning").innerHTML = "Makes no sense to me 🙂. Let the giant serve you: <a href='http://www.google.com/search?q="+word+"'> google </a>";
				display_meaning("David is unable to help 🙂. For a change let the Goliath serve you: " + "<a href=\"https://www.google.com/search?q="+word+"\">"+word+"</a>");
			}
		}
	}

	xmlhttp.open("GET", api_link, true);
	/* This is necessary for mediawiki API's */
	xmlhttp.setRequestHeader('Content-Type','application/json; charset=UTF-8');
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
    console.log("here", document.querySelector(".input-meaning").value);
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
				var front_str = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=';
				var end_str = '&limit=2&namespace=0&format=json';
				fetch_wiki(front_str+word+end_str, word);
			}
		}
	};	

	// checks if the word is a double-click text
	if (new_word.toString() != '[object MouseEvent]') {
		var word = new_word.toString();
		word = word.toLowerCase();
		document.querySelector(".input-meaning").value = word;
	}

	// else word is from the input box
	else {
		var word = document.querySelector('.text-input input');
		word = word.value.toLowerCase();
	}
	// var word = document.getElementById("input-meaning").value.toLowerCase();
	xmlhttp.open("GET", "dictionary.txt", true);
	xmlhttp.overrideMimeType("text/plain");	
	xmlhttp.send();
}