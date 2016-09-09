const STUDENTS_PER_PAGE = 10;	
const PAGINATION_LOCATION_SELECTOR = 'div.page';
const SEARCH_LOCATION_SELECTOR = 'div.page-header';
const ALL_STUDENTS_SELECTOR = 'li.student-item';	
const STUDENT_NAME_SELECTOR = 'div.student-details h3';
const STUDENT_EMAIL_SELECTOR = 'div.student-details span.email';
var $searchSelector = $(ALL_STUDENTS_SELECTOR);

// add links based on student count
var addLinksMarkup = function(numberOfStudents) {
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
	
	$(PAGINATION_LOCATION_SELECTOR).append($new_div);
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
	
	$(SEARCH_LOCATION_SELECTOR).append($new_div);
	
	$new_button.on('click', activateSearch);
}

// display students
var displayStudents = function(offset) {
	$(ALL_STUDENTS_SELECTOR).hide();
	$searchSelector.slice(offset, offset + STUDENTS_PER_PAGE).show(); 
}

// acivate the link clicked
var activateLink = function() {
	var linkNumber = this.text;
	var offset = (linkNumber - 1) * STUDENTS_PER_PAGE;
	displayStudents(offset);

	$('div.pagination a.active').removeClass('active');
	$(this).addClass('active');
}

// perform search
var activateSearch = function() {
	var searchString = $(this).prev().val().toLowerCase();
	$searchSelector = $(STUDENT_NAME_SELECTOR + ":contains(" + searchString + ")").parents(ALL_STUDENTS_SELECTOR);
	displayStudents(0);
}

// on load
addLinksMarkup($searchSelector.length);
displayStudents(0);
addSearchMarkup();