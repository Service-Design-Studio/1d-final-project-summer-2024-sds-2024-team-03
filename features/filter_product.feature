Feature: Product filter dropdown for Dashboard
  As a customer experience team member,
  I want to filter the data by products
  So that I can curate product-specific insights

Scenario: Hovering on a product dropdown option updates its color
  Given I am on the Dashboard page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  And I hover over a product dropdown option
  Then the product dropdown option should be highlighted on hover

Scenario: Selecting a product colors it red and adds it to the listbox
  Given I am on the Dashboard page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  And I select a product
  Then the selected product dropdown option should be red
  And the selected product is added to the listbox

Scenario: Deselecting a product resets its color and removes it from the listbox
  Given I am on the Dashboard page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  And I select a product
  And I deselect the same product
  Then the deselected product dropdown option should be reverted to white
  And the deselected product is removed from the listbox

Scenario: Available product dropdown options
  Given I am on the Dashboard page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  Then I should see all 13 products arranged alphabetically as dropdown options

Scenario: No selection of product dropdown option 
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then I should see "Products" in the text field of the dropdown button

Scenario: Reset product selection by refreshing
  Given I am on the Dashboard page
  And All Products are selected
  When I refresh the page
  Then I should see "Products" in the text field of the dropdown button
