const STUDENTS_PER_PAGE = 10;
const ALL_STUDENTS_SELECTOR = 'li.student-item';

// add links based on student count
var addLinks = function(numberOfStudents) {
	var numberOfLinks = Math.ceil( numberOfStudents / STUDENTS_PER_PAGE);
	
	var $page = $('div.page');
	var $new_div = $('<div></div>');
	var $new_ul = $('<ul></ul>');
	var $new_li;
	var $new_a;
	
	$new_div.addClass('pagination');
	$new_div.append($new_ul);
	
	for (i = 0; i < numberOfLinks; i++) {
		$new_li = $('<li></li>');
	    $new_a = $('<a></a>');
		
		$new_a.attr('href','#');
		$new_a.text(i);
		
		$new_li.append($new_a);
		$new_ul.append($new_li);
		
	 	$new_a.on('click',activateLink);
	}
	
	$page.append($new_div);
}

// display students
var displayStudents = function(offset, selector) {
	$(ALL_STUDENTS_SELECTOR).hide();
	$(selector).slice(offset, offset + STUDENTS_PER_PAGE).show(); 
}

// acivate the link clicked
var activateLink = function() {
	var linkNumber = this.text;
	var offset = linkNumber * STUDENTS_PER_PAGE;
	displayStudents(offset, ALL_STUDENTS_SELECTOR);

	$('div.pagination a.active').removeClass('active');
	$(this).addClass('active');
}

// on load
addLinks($(ALL_STUDENTS_SELECTOR).length);
displayStudents(0, ALL_STUDENTS_SELECTOR);