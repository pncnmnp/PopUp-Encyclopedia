function getSelectedText() {
	var text = "";
	if (typeof window.getSelection != "undefined") {
		text = window.getSelection().toString();
	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		text = document.selection.createRange().text;
	}
	return text;
}

function doSomethingWithSelectedText() {
	var selectedText = getSelectedText();
	if (selectedText && selectedText.split(" ").length <= 2) {
		var NewPara = document.createElement("p");
		NewPara.setAttribute("id", "infoDiv");
		NewPara.setAttribute("class", "tooltipDiv");
		NewPara.appendChild(document.createTextNode(selectedText));

		if (document.getElementsByClassName("tooltipDiv").length) {
			var OldPara = document.getElementById("infoDiv");
			document.body.replaceChild(NewPara, OldPara);
		}

		else {
			document.body.appendChild(NewPara);
		}

		document.getElementById("infoDiv").style.display = "block";
		document.getElementById("infoDiv").style.width = "250px";
		document.getElementById("infoDiv").style.zIndex = "101";
		document.getElementById("infoDiv").style.backgroundColor = "#F5DEB3";
		document.getElementById("infoDiv").style.border = "3px solid #666";
		document.getElementById("infoDiv").style.padding = "12px 12px 12px 12px";
		document.getElementById("infoDiv").style.borderRadius = "0px 0px 25px 0px";
		document.getElementById("infoDiv").style.position = "absolute";

		if(event.clientX + 300 > document.documentElement.clientWidth) {
			document.getElementById("infoDiv").style.left = event.clientX - 300;
		}

		else {
			document.getElementById("infoDiv").style.left = event.clientX;
		}

		document.getElementById("infoDiv").style.top = event.clientY;	
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
		doSomethingWithSelectedText();
});
