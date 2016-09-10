// Display constants
const STUDENTS_PER_PAGE = 10;										// number of students to display at one time

// Markup selector constants
const PAGINATION_APPEND_SELECTOR = 'div.page';						// location to append pagination links
const SEARCH_APPEND_SELECTOR = 'div.page-header';					// location to append search markup

// Search constants
const SEARCH_INPUT_SELECTOR = 'input';								// selector to find the search input data
const ALL_STUDENTS_SELECTOR = 'li.student-item';					// selector	to find all student data
const STUDENT_NAME_SELECTOR = 'div.student-details h3';				// selector to find student name data
const STUDENT_EMAIL_SELECTOR = 'div.student-details span.email';	// selector to find student email data 

// Animation constants
const HEADER_SELECTOR = 'div.page-header h2';						// selector to find the page header
const ANIMATION_SPEED = 300;										// 1/2 x the animation speed in milliseconds
const HEADER_FONTSIZE = '22px';										// Original font-size of Header in .css
const STUDENT_MARGINLEFT = '0';										// Original margin-left of ALL_STUDENTS_SELECTOR
const STUDENT_ANIMATION_MARGINLEFT = '-500px';						// Point to start animation at

// Global variables
var $searchSelected = $(ALL_STUDENTS_SELECTOR);	// stores current search results, initialized to all students


// animate display of students
jQuery.fn.extend({								// wanted to use $(this) in function so extended jQuery function
	animateShow: function () {
		$(this).animate(
			{marginLeft: STUDENT_ANIMATION_MARGINLEFT}, 0).show().animate(	// start off to the side
				{marginLeft: STUDENT_MARGINLEFT}, ANIMATION_SPEED);			// slide in
	}
});


// animate header
//	 makes header grow big and then shrink back to normal size.
var animateHeader = function () {
	$(HEADER_SELECTOR).animate(
		{fontSize: '1.5em'}, ANIMATION_SPEED).animate(			// grow really big
			{fontSize: HEADER_FONTSIZE}, ANIMATION_SPEED);		// go back to normal size
}

// remove existing pagination links from markup
var removeLinksMarkup = function() {
	$('div.pagination').remove();						
}

// add links based on student count
var addLinksMarkup = function() {
	var numberOfStudents = $searchSelected.length;
	var numberOfLinks = Math.ceil( numberOfStudents / STUDENTS_PER_PAGE);
	
	var $new_div = $('<div></div>');	// only 1 div so create it outside of the loop
	var $new_ul = $('<ul></ul>');		// only 1 ul so create it outside of the loop
	var $new_li;
	var $new_a;
	
	// no need for pagination links if only 1 page of students
	if (numberOfLinks > 1) {	
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
			
			$new_a.click( activateLink );
		}

		$(PAGINATION_APPEND_SELECTOR).append($new_div);
	}
}

// add search markup as follows:
//
//	  <div class='student-search'>
//	    <input placeholder='Search for students...'>
//	    <button>Search</button>
//		<h1>No Match Found<h1>
//	  </div>
//
//		append it to the end of the SEARCH_APPEND_SELECTOR
//		bind the input and the button to the activateSearch function.
var addSearchMarkup = function() {
	// create new elements
	var $new_div = $('<div></div>');
	var $new_input = $('<input>');
	var $new_button = $('<button></button>');
	var $new_h1 = $('<h1></h1>');
	
	// modify new elements.
	$new_div.addClass('student-search');
	$new_input.attr('placeholder', 'Search for students...');
	$new_button.text('Search');
	$new_h1.attr('class', 'no-match');
	$new_h1.text('No Match Found');
	
	// attach the new elements to the document
	$new_div.append($new_input);
	$new_div.append($new_button);
	$new_div.append($new_h1);
	$(SEARCH_APPEND_SELECTOR).append($new_div);
	
	$(SEARCH_INPUT_SELECTOR).bind('input', activateSearch); 	// works with cut and paste
	$new_button.click( activateSearch);  // redundant, left it in just in case there is a condition I missed
}

// display students
//		animate header on page change
//		hide all students
//		display students starting at offset
var displayStudents = function(offset) {
	animateHeader();
	
	if ($searchSelected.length === 0) {
		$('h1.no-match').show();
	} else {
		$('h1.no-match').hide();
	}
	
	$(ALL_STUDENTS_SELECTOR).hide();					
	$searchSelected.slice(offset, offset + STUDENTS_PER_PAGE).animateShow();
}

// acivate the link clicked
//		reads the number of the link from the html
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
//		converts all strings to lower case for case insensitive search.
//		finds students with partial matches in names or emails
//		calls displayStudents, removeLinkMarkup, and addLinksMarkup to display
//		the search results.
//
//	NOTE: 	Decided to use indexOf instead of a regular expression because the search string
//			is from a user input. This way a bunch of meta characters don't have to be 
//			escaped.

var activateSearch = function() {
	var searchString = $(SEARCH_INPUT_SELECTOR).val().toLowerCase();					// get search string
	var $newSearch = $('');																// $newSearch is empty
	
	$(ALL_STUDENTS_SELECTOR).each( 														// iterate over all students			
		function () {
			
			var nameString = $(this).find(STUDENT_NAME_SELECTOR).html().toLowerCase();	// find name to match 
			var emailString = $(this).find(STUDENT_EMAIL_SELECTOR).html().toLowerCase();// find email to match
			
			if (nameString.indexOf(searchString) != -1 || 								// if searchString in nameString
				emailString.indexOf(searchString) != -1) {								// or searchString in emailString 
					
				$newSearch = $newSearch.add(this);										// on a match add this student to collection
			}
		});
	
	$searchSelected = $newSearch;	// set $newSearch to global $searchSelected
	
	displayStudents(0);				// no offset, display from beginning
	removeLinksMarkup();			// redo the links
	addLinksMarkup();
}

// on load
addSearchMarkup();		// addSearchMarkup must run before displayStudents on load or no match message appears
displayStudents(0);		// no offset, display from beginning
addLinksMarkup();
