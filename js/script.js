const STUDENTS_PER_PAGE = 10;	
const PAGINATION_APPEND_SELECTOR = 'div.page';
const SEARCH_APPEND_SELECTOR = 'div.page-header';
const SEARCH_INPUT_SELECTOR = 'input';
const ALL_STUDENTS_SELECTOR = 'li.student-item';	
const STUDENT_NAME_SELECTOR = 'div.student-details h3';
const STUDENT_EMAIL_SELECTOR = 'div.student-details span.email';

var $searchSelector = $(ALL_STUDENTS_SELECTOR);

// remove links from markup
var removeLinksMarkup = function() {
	$('div.pagination').remove();
}

// add links based on student count
var addLinksMarkup = function() {
	var numberOfStudents = $searchSelector.length;
	var numberOfLinks = Math.ceil( numberOfStudents / STUDENTS_PER_PAGE);
	
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
		$new_a.text(i + 1);
		if (i === 0) {
			$new_a.addClass('active');
		}
		
		$new_li.append($new_a);
		$new_ul.append($new_li);
		
	 	$new_a.on('click', activateLink);
	}
	
	$(PAGINATION_APPEND_SELECTOR).append($new_div);
}

// add search markup
var addSearchMarkup = function() {
	var $new_div = $('<div></div>');
	var $new_input = $('<input>');
	var $new_button = $('<button></button>');
	
	$new_div.addClass('student-search');
	$new_input.attr('placeholder', 'Search for students...');
	$new_button.text('Search');
	
	$new_div.append($new_input);
	$new_div.append($new_button);
	
	$(SEARCH_APPEND_SELECTOR).append($new_div);
	
	$(SEARCH_INPUT_SELECTOR).bind('input', activateSearch);		// works with cut and paste
	$new_button.click(activateSearch);							// redundant, left it in just in case there is a condition I missed
}

// display students
//		hide all students
//		display students starting at offset
var displayStudents = function(offset) {
	$(ALL_STUDENTS_SELECTOR).hide();											// hide immediately
	$searchSelector.slice(offset, offset + STUDENTS_PER_PAGE).fadeIn('slow');	// show slowly
}

// acivate the link clicked
//		reads the number of the link
//		calculates	offset based on link number
//		displays new set of students
//		removes 'active' from all links.
//		sets current link to 'active'
var activateLink = function() {
	var linkNumber = this.text;	
	var offset = (linkNumber - 1) * STUDENTS_PER_PAGE;	
	displayStudents(offset);

	$('div.pagination a.active').removeClass('active');	// remove all active links
	$(this).addClass('active');							// set current link to active
}

// perform search
//		converts input to lower case
//		finds students with partial matches in names or emails
//		updates the display and changes the link markup based on number of matched students.
var activateSearch = function() {
	var searchString = $(SEARCH_INPUT_SELECTOR).val().toLowerCase();					// convert search box input to lower case.
	$searchSelector = $(STUDENT_NAME_SELECTOR + ":contains(" + searchString + "), " +	// search names for searchString
						STUDENT_EMAIL_SELECTOR + ":contains(" + searchString + ")")		// search emails for searchString
						.parents(ALL_STUDENTS_SELECTOR);								// find parents of matched searches for display
	
	displayStudents(0);	// no offset, display from beginning
	removeLinksMarkup();
	addLinksMarkup();
}

// on load
displayStudents(0);		// no offset display from beginning
addLinksMarkup();
addSearchMarkup();