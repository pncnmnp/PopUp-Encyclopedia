function getSelectedTextObj() {
	var textObj;
	if (typeof window.getSelection != "undefined") {
		textObj = window.getSelection();
	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		textObj = document.selection.createRange().text;
	}
	return textObj;
}

function doSomethingWithSelectedText(obj) {
	var textObj = getSelectedTextObj();
	if (textObj.toString() && textObj.toString().trim().split(" ").length <= 2) {
		var NewPara = document.createElement("div");
		NewPara.setAttribute("id", "infoDiv");
		NewPara.setAttribute("class", "tooltipDiv");
		NewPara.appendChild(document.createTextNode(textObj.toString().trim()));

		if (document.getElementsByClassName("tooltipDiv").length) {
			var OldPara = document.getElementById("infoDiv");
			document.documentElement.replaceChild(NewPara, OldPara);
		}

		else {
			document.documentElement.appendChild(NewPara);
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
		document.getElementById("infoDiv").style.zIndex = "101";
		document.getElementById("infoDiv").style.backgroundColor = "#F5DEB3";
		document.getElementById("infoDiv").style.border = "3px solid #666";
		document.getElementById("infoDiv").style.padding = "12px 12px 12px 12px";
		document.getElementById("infoDiv").style.borderRadius = "0px 0px 25px 0px";
		document.getElementById("infoDiv").style.position = "absolute";

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
		doSomethingWithSelectedText();
});