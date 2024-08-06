Feature: Actionables Tracking

Scenario: Display Actionables tracked
Given I am on the dashboard page
Then I should see a progress bar indicating my progress for the number of "Done" actions and "In Progress" actions
And a progress bar

Scenario: Clicking widget redirects to Actionables page
Given I am on the dashboard page
And the "Actionables Tracked" widget is clickable
When I click on the widget
Then I should be redirected to the 'Actionables' page

Scenario: Data persists
Given I am on the dashboard page
When I refresh the page
Then the "Actionables Tracked" widget should display the same progress bar
