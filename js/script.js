/***********************************************************
*
*   Pagination filter
*
*  Adds pagination and a search function to a page.
*
*  Author: Steve Masteller
*  Email: stevermasteller@gmail.com
*
*  Reserved Classes:
*		pagination
*		student-search
*		active
*
*
*---------------------------------------------------------
*	Student Search HTML markup
*	
*	<div class='page-header'>
*		...
*		...
*		...
*	  <div class='student-search'>
*	    <input placeholder='Search for students...'>
*	    <button>Search</button>
*		<h1>No Match Found<h1>
*	  </div>
*	</div>
*	
*---------------------------------------------------------
*	Pagination HTML markup
*
*	Note: # of links = (number of students found in HTML markup) / STUDENTS_PER_PAGE
*
*	<div class='page'>
*		...
*		...
*		...
*	  <div class='pagination'>
*		<ul>
*			<li>
*				<a class='active'>1</a>
*				<a>2</a>
*				....
*				....
*				....# of links
*			</li>
*		</ul>
*	  </div>
*   </div>
***********************************************************/ 

//
//	External constants.
//		The following constants may be of interest for HTML markup
//
// Display constants
const STUDENTS_PER_PAGE = 10;										// number of students to display at one time

// Markup selector constants
const PAGINATION_APPEND_SELECTOR = 'div.page';						// location to append pagination links
const SEARCH_APPEND_SELECTOR = 'div.page-header';					// location to append search markup

// Search constants
const ALL_STUDENTS_SELECTOR = 'li.student-item';					// selector	to find all student data
const STUDENT_NAME_SELECTOR = 'div.student-details h3';				// selector to find student name data
const STUDENT_EMAIL_SELECTOR = 'div.student-details span.email';	// selector to find student email data 

// Animation constants
const ANIMATION_SPEED = 300;										// animation speed in milliseconds
const MESSAGE_FONTSIZE = '1em';										// Original font-size of search message in .css
const MESSAGE_MAX_SIZE = '1.3em';									// Size search message grows to
const STUDENT_MARGINLEFT = '0';										// Original margin-left of ALL_STUDENTS_SELECTOR
const STUDENT_ANIMATION_MARGINLEFT = '-500px';						// Point to start student animation

//
//	Internal constants.
//		The following constants are not dependent on HTML markup but may be of interest to css
//
const SEARCH_INPUT_SELECTOR = 'div.student-search input';			// selector to find the search input data
const SEARCH_MESSAGE_SELECTOR = 'div.student-search h1';			// selector to find the search message
const PAGINATION_SELECTOR = 'div.pagination';						// selector to find the pagination

// Global variables
var $searchSelected = $(ALL_STUDENTS_SELECTOR);	// stores current search results, initialized to all students


// animate display of students
//    upon display, students slide in from the side
jQuery.fn.extend({								// wanted to use $(this) in function so extended jQuery function
	animateShow: function () {
		$(this).animate(
			{marginLeft: STUDENT_ANIMATION_MARGINLEFT}, 0).show().animate(	// start off to the side
				{marginLeft: STUDENT_MARGINLEFT}, ANIMATION_SPEED);			// slide in
	}
});


// animate search failure message
//	 makes no match search message grow big and then shrink back to normal size.
var animateSearchMessage = function () {
	$(SEARCH_MESSAGE_SELECTOR).animate(	
		{fontSize: MESSAGE_MAX_SIZE}, (ANIMATION_SPEED / 2)).animate(		// grow big
			{fontSize: MESSAGE_FONTSIZE}, (ANIMATION_SPEED / 2));			// go back to normal size
};

// remove existing pagination links from markup
var removeLinksMarkup = function() {
	$(PAGINATION_SELECTOR).remove();						
};

// add pagination markup as follows:
// 		# of links = numberOfStudents / STUDENTS_PER_PAGE
//
//	  <div class='pagination'>
//		<ul>
//			<li>
//				<a>"i + 1"</a>
//				... i + 2
//				.........
//				....# of links
//			</li>
//		</ul>
//	  </div>
//
//		bind each <a> to the activateLink function.
//		append it to the end of the PAGINATION_APPEND_SELECTOR
var addLinksMarkup = function() {
	
	// Determine how many pagination links are needed.
	var numberOfStudents = $searchSelected.length;
	var numberOfLinks = Math.ceil( numberOfStudents / STUDENTS_PER_PAGE);
	
	// initialize new elements
	var $new_div = $('<div class="pagination"></div>');	
	var $new_ul = $('<ul></ul>');		
	var $new_li;
	var $new_a;
	
	// no need for pagination links if only 1 page of students
	if (numberOfLinks > 1) {	
	
		// only one div ul so append outside of loop
		$new_div.append($new_ul);

		// one li a per pagination link
		for (var i = 0; i < numberOfLinks; i++) {		
		
			// initialize new elements
			$new_li = $('<li></li>');
			$new_a = $('<a></a>');
			
			// add attributes
			$new_a.attr('href','#');
			$new_a.text(i + 1);
			if (i === 0) {
				$new_a.addClass('active'); // first link always the active one when pagination created.
			}
			
			// attach new elements to each other
			$new_li.append($new_a);
			$new_ul.append($new_li);
			
			// bind activateLink to each a
			$new_a.click( activateLink );
		}

		// attach new elements to the document
		$(PAGINATION_APPEND_SELECTOR).append($new_div);
	}
};

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
	var $new_div = $('<div class="student-search"></div>');
	var $new_input = $('<input placeholder="Search for students...">');
	var $new_button = $('<button>Search</button>');
	var $new_h1 = $('<h1>No Match Found</h1>');
	
	// attach the new elements to the document
	$new_div.append($new_input);
	$new_div.append($new_button);
	$new_div.append($new_h1);
	$(SEARCH_APPEND_SELECTOR).append($new_div);
	
	// bind the activateSearch function to the input and the button
	$(SEARCH_INPUT_SELECTOR).bind('input', activateSearch); 	// works with cut and paste
	$new_button.click( activateButtonSearch);  
};

// display students on page change
//		show/hide search message
//		animate search message
//		hide all students
//		display and animate students starting at offset
var displayStudents = function(offset) {
	
	// if search comes up empty show no matches message
	if ($searchSelected.length === 0) {
		$(SEARCH_MESSAGE_SELECTOR).show();
		animateSearchMessage();
	} else {
		$(SEARCH_MESSAGE_SELECTOR).hide();
	}
	
	// hide all students then show students on current page
	$(ALL_STUDENTS_SELECTOR).hide();					
	$searchSelected.slice(offset, offset + STUDENTS_PER_PAGE).animateShow(); // animateShow extends JQuery.fn
};

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
};

// perform button search
//
// 		in addition to the normal activate search
//		the button search clears the input value. Thus
//		if one were to cut and paste a huge amount of data
//		into the input it can be easily cleared without
//		backspacing through it all or reloading the page.
var activateButtonSearch = function() {
	activateSearch();
	$(SEARCH_INPUT_SELECTOR).val('');
};

// perform search
//		converts all strings to lower case for case insensitive search.
//		finds students with partial matches in names or emails
//		calls displayStudents, removeLinkMarkup, and addLinksMarkup to display
//		the search results.
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
};

// on load
addSearchMarkup();		// addSearchMarkup must run before displayStudents on load or no match message appears
displayStudents(0);		// no offset, display from beginning
addLinksMarkup();
