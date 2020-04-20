@wip
Feature: homework page
	The page that allows for management of homework.
	
	Background: On the homework page
		Given that the user is logged in
		And that the user is on the homework page
	
	Scenario: Viewing homework details
		Given that there are homework items on the page
		When the user clicks on an item
		Then a homework details modal opens
		

