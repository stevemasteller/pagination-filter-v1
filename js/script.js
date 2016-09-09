const STUDENTS_PER_PAGE = 10;										// number of students to display at one time
const PAGINATION_APPEND_SELECTOR = 'div.page';						// location to append pagination links
const SEARCH_APPEND_SELECTOR = 'div.page-header';					// location to append search markup
const SEARCH_INPUT_SELECTOR = 'input';								// selector to find the search input data
const ALL_STUDENTS_SELECTOR = 'li.student-item';					// selector	to find all student data
const STUDENT_NAME_SELECTOR = 'div.student-details h3';				// selector to find all student name data
const STUDENT_EMAIL_SELECTOR = 'div.student-details span.email';	// selector to find all student email data

var $searchSelected = $(ALL_STUDENTS_SELECTOR);	// stores current search results, initialized to all students

// remove existing pagination links from markup
var removeLinksMarkup = function() {
	$('div.pagination').remove();
}

// add links based on student count
var addLinksMarkup = function() {
	var numberOfStudents = $searchSelected.length;
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

// add search markup as follows:
//
//	  <div class='student-search'>
//	    <input placeholder='Search for students...'>
//	    <button>Search</button>
//	  </div>
//
//		append it to the end of the SEARCH_APPEND_SELECTOR
//		bind the input and the button to the activateSearch function.
var addSearchMarkup = function() {
	// create new elements
	var $new_div = $('<div></div>');
	var $new_input = $('<input>');
	var $new_button = $('<button></button>');
	
	// modify new elements.
	$new_div.addClass('student-search');
	$new_input.attr('placeholder', 'Search for students...');
	$new_button.text('Search');
	
	// attach the new elements to the document
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
	$searchSelected.slice(offset, offset + STUDENTS_PER_PAGE).fadeIn('slow');	// show slowly
}

// acivate the link clicked
//		reads the number of the link
//		calculates	offset based on link number
//		displays new set of students
//		removes 'active' from all links.
//		sets current link to 'active'
//
//	called by clicking on a pagination link
var activateLink = function() {
	var linkNumber = this.text;	
	var offset = (linkNumber - 1) * STUDENTS_PER_PAGE;	
	displayStudents(offset);

	$('div.pagination a.active').removeClass('active');	// remove all active links
	$(this).addClass('active');							// set current link to active
}

// perform search
//		converts input to lower case, since the html markup contains no upper case.
//		finds students with partial matches in names or emails
//		updates the display and changes the link markup based on number of matched students.
//
//	called by changes to search input and clicking on search button
//
// Note: Using :contains doesn't place the student selectors in the $searchSelected object 
//		 in the same order they appear in the html. As a result, students often end up on 
//		 different pages depending on the match string. For example, searching for 'i' puts
//		 the first student 'iboya vat' on page 4, while searching for 'b' puts her on page 1.

var activateSearch = function() {
	var searchString = $(SEARCH_INPUT_SELECTOR).val().toLowerCase();					// convert search box input to lower case
	$searchSelected = $(STUDENT_NAME_SELECTOR + ":contains(" + searchString + "), " +	// search names for searchString
					  STUDENT_EMAIL_SELECTOR + ":contains(" + searchString + ")")		// search emails for searchString
					  .parents(ALL_STUDENTS_SELECTOR);									// find parents of matched searches for display
	
	displayStudents(0);	// no offset, display from beginning
	removeLinksMarkup();
	addLinksMarkup();
}

// on load
displayStudents(0);		// no offset, display from beginning
addLinksMarkup();
addSearchMarkup();