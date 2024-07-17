Feature: Select Products, Sources, and Upload

Scenario: Hovering on a dropdown option updates its color
  Given I am on the Upload Data page
  When I click on the "Products" dropdown button
  And I hover over the product dropdown option
  Then the product dropdown option should be highlighted on hover

Scenario: Available dropdown options
  Given I am on the Upload Data page
  And there are products in the dataset
  When I click on the "Products" dropdown button
  Then I should see all 18 products arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
  Given I am on the Upload Data page
  And the sources selected are: 'Product Survey'
  When no Products dropdown options are selected
  Then I should see "Products" in the text field of the dropdown button

Scenario: Reset selection by refreshing
  Given I am on the Upload Data page
  When I refresh the page
  Then I should still be on the Upload Data page
  And I should see "Products" in the text field of the dropdown button

Scenario: Hovering on a dropdown option updates its color
  Given I am on the Upload Data page
  When I click on the "Sources" dropdown button
  And I hover over the source dropdown option
  Then the source dropdown option should be highlighted on hover

Scenario: Available dropdown options
  Given I am on the Upload Data page
  And there are sources in the dataset
  When I click on the "Sources" dropdown button
  Then I should see all 5 sources arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
  Given I am on the Upload Data page
  And the products selected are: 'Investments'
  When no Sources dropdown options are selected
  Then I should see "Sources" in the text field of the dropdown button

Scenario: Reset selection by refreshing
  Given I am on the Upload Data page
  When I click on the "Sources" dropdown button
  And I refresh the page
  Then I should still be on the Upload Data page
  And I should see "Sources" in the text field of the dropdown button

Scenario: Upload 1 file
  Given I am on the Upload Data page
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I upload a valid file using the file input
  Then a Modal should open, informing a successful upload of the 'Investments' + 'Product Survey' + filename

Scenario: Upload multiple files
  Given I am on the Upload Data page
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I upload multiple valid files using the file input
  Then a Modal should open, informing a successful upload

Scenario: Invalid upload
  Given I am on the Upload Data page
  When I upload an invalid file using the file input
  Then a Modal should open, informing an unsuccessful upload
