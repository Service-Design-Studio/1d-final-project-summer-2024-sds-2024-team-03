Feature: Product filter dropdown for Dashboard

Scenario: Hovering on a dropdown option updates its color
  Given I am on the Dashboard page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  And I hover over a dropdown option
  Then the dropdown option should be highlighted on hover

Scenario: Available dropdown options
  Given I am on the Dashboard page
  When I click on the "Products" dropdown button
  Then I should see all 18 products arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then I should see "Products" in the text field of the dropdown button

Scenario: Reset selection by refreshing
  Given I am on the Dashboard page
  And All Products are selected
  When I refresh the page
  Then I should see "Products" in the text field of the dropdown button
