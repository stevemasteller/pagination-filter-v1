// count students
var studentElements = document.getElementsByClassName("student-item");
var page = document.getElementsByClassName("page");
var studentList = document.getElementsByClassName("student-list");
const STUDENTS_PER_PAGE = 10;

// add links based on student count
var addLinks = function() {
	var numberOfLinks = Math.ceil( studentElements.length / STUDENTS_PER_PAGE);
	
	var div = document.createElement("div");
	var ul = document.createElement("ul");
	var li;
	var a;
	
	div.className = "pagination";
	div.appendChild(ul);
	
	for (i = 0; i < numberOfLinks; i++) {
		li = document.createElement("li");
	    a = document.createElement("a");
		
		a.href = "#";
		a.innerText = i;
		
		li.appendChild(a);
		ul.appendChild(li);
		
		a.onclick = activateLink;
	}
	
	page[0].appendChild(div);
}

// display students
var displayStudents = function(offset) {
	for (i = 0; i < studentElements.length; i++) {
		
		if (i >= offset && i < offset + STUDENTS_PER_PAGE) {
			studentElements[i].style.display = "inline"; 	// inline is default
		} else {
			studentElements[i].style.display = "none";
		}
	}
}

// acivate the link clicked
var activateLink = function() {
	var linkNumber = this.text;
	var offset = linkNumber * STUDENTS_PER_PAGE;
	displayStudents(offset);
	
	
}

// on load
addLinks();
displayStudents(0);