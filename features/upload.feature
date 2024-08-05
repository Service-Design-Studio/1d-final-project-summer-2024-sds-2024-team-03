Feature: Select Subcategories, Sources, and Upload

Scenario: Hovering on a subcategory dropdown option updates its color
  Given I am on the Upload Data page
  When I click on the "Subcategories" dropdown button
  And I hover over a subcategory dropdown option
  Then the subcategory dropdown option should be highlighted on hover

Scenario: Available dropdown options
  Given I am on the Upload Data page
  And there are subcategories in the dataset
  When I click on the "Subcategories" dropdown button
  Then I should see all 36 subcategories arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
  Given I am on the Upload Data page
  And the sources selected are: 'Product Survey'
  When no Subcategories dropdown options are selected
  Then I should see "Subcategories" in the text field of the dropdown button

Scenario: Reset selection by refreshing
  Given I am on the Upload Data page
  When I refresh the page
  Then I should still be on the Upload Data page
  And I should see "Subcategories" in the text field of the dropdown button

Scenario: Hovering on a source dropdown option updates its color
  Given I am on the Upload Data page
  When I click on the "Sources" dropdown button
  And I hover over a source dropdown option
  Then the source dropdown option should be highlighted on hover

Scenario: Available dropdown options
  Given I am on the Upload Data page
  And there are sources in the dataset
  When I click on the "Sources" dropdown button
  Then I should see all 5 sources arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
  Given I am on the Upload Data page
  And the subcategories selected are: 'Cheque'
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
  And the sources selected are: 'Call Centre'
  And the subcategories selected are: 'Cheque'
  When I upload a valid file using the file input
  Then a Modal should open, informing a successful upload of the 'Cheque' and 'Call Centre' and filename

Scenario: Unable to upload due to unselected subcategory and source
  Given I am on the Upload page
  When I click on the "Subcategories" dropdown button
  And I do not select any subcategory or source
  And I upload a valid file using the file input
  Then I should be alerted "Please select a subcategory and source."

Scenario: Unable to upload due to invalid file extension
  Given I am on the Upload page
  When I select a subcategory and source
  And I upload an invalid file using the file input
  Then I should be alerted "Invalid file format."