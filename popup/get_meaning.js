var subButton = document.getElementById('sub-button');
subButton.addEventListener('click', fetch_dictionary, false);
document.addEventListener('dblclick', function(e) {fetch_dictionary(window.getSelection().toString())});

function display_meaning(meaning) {
	var parent = document.querySelector('.meaning');
	if (document.querySelector('.meaning p') == null) {
		var meaningPara = document.createElement('p');
		meaningPara.textContent = meaning;
		parent.appendChild(meaningPara);
	}
	else {
		var prevNode = document.querySelector('.meaning p');
		var newNode = document.createElement('p');
		newNode.textContent = meaning;
		parent.replaceChild(newNode, prevNode);
	}	
}

function fetch_wiki(api_link, word) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if (response[2][0] != "" && response[2][0] != undefined) {
				// document.getElementById("meaning").innerHTML = response[2][0];
				display_meaning(response[2][0]);
			}
			else {
				// document.getElementById("meaning").innerHTML = "Makes no sense to me 🙂. Let the giant serve you: <a href='http://www.google.com/search?q="+word+"'> google </a>";
				display_meaning("Makes no sense to me 🙂. Let the giant serve you: <a href='http://www.google.com/search?q="+word+"'> google </a>");
			}
		}
	}
	xmlhttp.open("GET", api_link, true);
	xmlhttp.setRequestHeader('Content-Type','application/json; charset=UTF-8');
	xmlhttp.send();
}

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
				display_meaning(myObj[word]);
			}

			else {
				var front_str = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=';
				var end_str = '&limit=1&namespace=0&format=json';
				fetch_wiki(front_str+word+end_str, word);
			}
		}
	};	

	if (new_word.toString() != '[object MouseEvent]') {
		var word = new_word.toString();
		word = word.toLowerCase();
		document.querySelector(".input-meaning").value = word;
	}

	else {
		var word = document.querySelector('.text-input input');
		word = word.value.toLowerCase();
	}
	// var word = document.getElementById("input-meaning").value.toLowerCase();
	xmlhttp.open("GET", "dictionary.txt", true);
	xmlhttp.overrideMimeType("text/plain");	
	xmlhttp.send();
}