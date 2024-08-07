Feature: Actionables Tracking

Scenario: Display Actionables tracked
Given I am on the Dashboard page
Then I should see a two numbers indicating my progress for the number of "Done" actions and "In Progress" actions
And a progress bar

Scenario: Clicking widget redirects to Actionables page
Given I am on the Dashboard page
When I click on the 'actions-Tracked' widget
Then I should be redirected to 'Actionables' page

Scenario: Data persists
Given I am on the Dashboard page
And the 'actions-Tracked' widget has a progress bar
When I refresh the page
Then the 'actions-Tracked' widget should display the same progress bar
