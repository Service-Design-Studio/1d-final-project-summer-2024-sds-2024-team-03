Feature: Source filter dropdown for Dashboard
As a customer experience team member,
I want to filter the data by sources
So that I can curate source-specific insights

Scenario: Hovering on a dropdown option updates its color
Given I am on the Dashboard/Analytics/Actionables page
And Products are selected
When I click on the "Sources" dropdown button
And I hover on a dropdown option
Then the dropdown option should be highlighted

Scenario: Available dropdown options
Given I am on the Dashboard/Analytics/Actionables page
When I have uploaded "Call Centre", "Product Survey", "Social Media", "5 Star Reviews", "Problem Solution Survey"
And I click on the "Select Sources" dropdown button
Then I should see only 5 sources: "Call Centre", "Product Survey", "Social Media", "5 Star Reviews", "Problem Solution Survey" arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
Given I am on the Dashboard/Analytics/Actionables page
And Products are selected
When no Sources dropdown options are selected
Then I should see "Sources" in the text field of the dropdown button
And  I should see the visualizations not updated with any data

Scenario: Reset selection by refreshing
Given I have selected a Source
When I refresh the page
Then I should just see "Source" in the text field of the dropdown button
