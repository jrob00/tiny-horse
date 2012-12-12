$("document").ready(function() {
    
    // globals
	activePage = ""; // save our active page name
    counter = {}; // globalize our counter so we can turn it on/off
   	
    
    
	// if we land on a url with an already selected non-home page
	if (hash = window.location.hash) {
		
		if (hash != "#") {
			
			var newSectionClass = hash.replace("#", "");
			var $selectedNavLink = $("#main-nav a[href='#"+newSectionClass+"']");
			
			//console.log('newSectionClass', newSectionClass);
			//console.log('$selectedNavLink', $selectedNavLink);
			
			// load the new content without animation
			loadNewNavContent(newSectionClass, $selectedNavLink, true);
			
		} else {
			
			setActivePage("home");
		}
		
	} else {
		
		// otherwise start our counter
		setActivePage("home");
	}
	
	
	// event listener for nav clicks
	$("#left-content a, #main-nav a").click(function() {
		
		var $selectedNavLink = $(this);	
		var newSectionClass = $selectedNavLink.attr("href").replace("#", "");
		
		// we took the "home" out of "#home"
		if (newSectionClass == "") newSectionClass = "home";
		
		// load the new content w/animation
		loadNewNavContent(newSectionClass, $selectedNavLink);
		
	});
	
	
	// event listenter for the case studies form
	$(".case-studies-content form").submit(function(e) {
		
		var submitBtn = $(".case-studies-content input[type='submit']");
		
		// disable the submit to make it hard to send multiple copies
		submitBtn.attr("disabled", "disabled");
		
		// display a thank you message
		$('<span class="thank-you-msg">request sent, thank you.</span>').insertAfter(submitBtn).fadeIn();
		
		// stop the page refresh
		e.preventDefault();
	});
	
	
});



// functions

function setActivePage(page) {
	
	activePage = page;
	
	if (activePage == "home") {
		
		startCounter();
		
	} else {
		
		stopCounter();
	}
}


function startCounter() {
	
	// determine our starting count
	baseNumber = 6945789610;
	
	// determine our starting timestamp
	var baseTimestamp = 1354908540000;
	//new Date(2012, 11, 7, 11, 29, 00).getTime();
	
	// determine our current timestamp
	var currentTimestamp = new Date().getTime();
	
	// determine the difference in milliseconds between the two
	var secondsSinceBase = Math.round((currentTimestamp - baseTimestamp) / 1000);
	var increaseSinceBase = 948 * secondsSinceBase;
	
	// determine our starting count
	var currentCount = (baseNumber + increaseSinceBase);
	
	// update the text to reflect this
	var $countText = $("#site-counter .total");
	$countText.text(numberWithCommas(currentCount));
	
	// oh and do the same for our secondary text
	$("#secondary-count-total").text(numberWithCommas(currentCount));
	
	
	// every second increases the count by 948
    var rate = 948;
    
    var newCount = i = 0;
    
    // run this function every 1 second, animate the increase 10 times and then
    // skip animation going forward because this seems to trigger a redraw that kills
    // browser memory
    counter = setInterval(function() {
    	
        if (i > 10) {
	        
	        $countText.text(numberWithCommas(currentCount));
	        currentCount = parseInt(currentCount) + parseInt(rate);
        	
        } else {
	        
	        newCount = Math.round(parseInt(currentCount) + parseInt(rate));
	       	
			// Animate the element's value from n to n
			jQuery({someValue: currentCount}).animate({someValue: newCount}, {
				duration: 1000,
				queue: false,
				step: function() { // called on every step
					// Update the element's text with rounded-up value:
					$countText.text(numberWithCommas(Math.round(this.someValue)));
				}
			});
			
			currentCount = newCount;
        }
        
        i++;
        
    }, 1000);
	
}


function stopCounter() {
	
	clearInterval(counter);
}


function loadNewNavContent(newSectionClass, $selectedNavLink, skipAnimation) {
	
	
	var $newSection = $("#right-content .content-holder section."+newSectionClass+"-content");
	
	//console.log('newSectionClass', newSectionClass);
	//console.log('$newSection', $newSection);
	
	// deselect and fade out the previously displayed section
	var $previousSection = $("#right-content .content-holder section.selected");
	
	// deselect our previous section
	$previousSection.removeClass("selected");
	
	var previousSectionClass = $previousSection.attr("class").replace("-content", "");
	
	//console.log('previousSectionClass', previousSectionClass);
	//console.log('$previousSection', $previousSection);
	

	// if this was any page besides home remove the selected state from the nav
	$("#main-nav a[href='#"+previousSectionClass+"']").parent().removeClass("selected");
	
	if (!skipAnimation) {
		
		// fade out the previous section
		$previousSection.fadeOut(function() {
			
			/*// special formatting for the team page
			if (newSectionClass == "team") {
				
				$("#right-content").css("max-width", "673px");
				$("#right-content .content-holder").css("max-width", "600px");
				
			} else if (previousSectionClass == "team") {
				
				$("#right-content").css("max-width", "548px");
				$("#right-content .content-holder").css("max-width", "475px");
			}*/
			
			// select and fade in the newly displayed section
			$newSection.fadeIn();
		});
	
	} else {
		
		$previousSection.hide();
		
		/*// special formatting for the team page
		if (newSectionClass == "team") {
			
			$("#right-content").css("max-width", "673px");
			$("#right-content .content-holder").css("max-width", "600px");
			
		} else if (previousSectionClass == "team") {
			
			$("#right-content").css("max-width", "548px");
			$("#right-content .content-holder").css("max-width", "475px");
		}*/
		
		$newSection.show();
	}
	
	// mark the section as selected
	$newSection.addClass("selected");
	
	// if we selected a page other than home, indicate the selection
	if (newSectionClass != "home") $selectedNavLink.parent().addClass("selected");
	
	
	// update our active page
	setActivePage(newSectionClass);
	
}


// utility functions

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}