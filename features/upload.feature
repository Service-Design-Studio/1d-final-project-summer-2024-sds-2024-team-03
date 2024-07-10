Feature: Select Products, Sources, and Upload

Scenario: Hovering on a dropdown option updates its color
Given I am on the Upload page
When I click on the "Products" dropdown button
And I hover over the product dropdown option
Then the product dropdown option should be highlighted on hover

Scenario: Available dropdown options
Given I am on the Upload page
And there are products in the dataset
When I click on the "Products" dropdown button
Then I should see all 18 products arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
Given I am on the Upload page
And the sources selected are: 'Product Survey'
When no Products dropdown options are selected
Then I should see "Products" in the text field of the dropdown button

Scenario: Reset selection by refreshing
Given I am on the Upload page
When I refresh the page
Then I should still be on the Upload Page
Then I should see "Products" in the text field of the dropdown button

Scenario: Hovering on a dropdown option updates its color
Given I am on the Upload page
When I click on the "Sources" dropdown button
And I hover over the source dropdown option
Then the source dropdown option should be highlighted on hover

Scenario: Available dropdown options
Given I am on the Upload page
And there are sources in the dataset
When I click on the "Sources" dropdown button
Then I should see all 5 sources arranged alphabetically as dropdown options

Scenario: No selection of dropdown option 
Given I am on the Upload page
And the products selected are: 'Investments'
When no Sources dropdown options are selected
Then I should see "Sources" in the text field of the dropdown button

Scenario: Reset selection by refreshing
Given I am on the Upload page
When I click on the "Sources" dropdown button
When I refresh the page
Then I should still be on the Upload Page
And I should see "Sources" in the text field of the dropdown button

Scenario: Drag and Drop 1 file
Given I am on the Upload page
And the sources selected are: 'Product Survey'
And the products selected are: 'Investments'
When I drag a file into the Upload area
And a Modal should open, informing a successful upload of the Investments + Product Survey + name of my file
And the filters and visualizations on the other pages should make use of the uploaded data

Scenario: Drag and Drop 2+ files
Given I am on the Upload page
When I drag multiple files into the Upload area
Then the Upload area should be highlighted
And a Modal should open, informing a successful upload of the product + source + names of my files
And the filters and visualizations on the other pages should make use of the uploaded data

Scenario: Close modal
Given I am on the Upload page
And I have the modal open
When I click out of the modal area or the X on the modal
Then the modal should close