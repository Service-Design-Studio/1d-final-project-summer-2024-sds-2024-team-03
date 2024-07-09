Feature: Source filter dropdown for Dashboard
  As a customer experience team member,
  I want to filter the data by sources
  So that I can curate source-specific insights

Scenario: Hovering on a source dropdown option updates its color
  Given I am on the Dashboard page
  And there are sources in the dataset
  When I click on the "Sources" dropdown button
  And I hover over the source dropdown option
  Then the source dropdown option should be highlighted on hover

Scenario: Selecting a source colors it red and adds it to the listbox
  Given I am on the Dashboard page
  And there are sources in the dataset
  When I click on the "Sources" dropdown button
  And I select a source
  Then the selected source dropdown option should be red
  And the selected source is added to the listbox

Scenario: Deselecting a source resets its color and removes it from the listbox
  Given I am on the Dashboard page
  And there are sources in the dataset
  When I click on the "Sources" dropdown button
  And I select a source
  And I deselect the same source
  Then the deselected source dropdown option should be reverted to white
  And the deselected source is removed from the listbox

Scenario: Available source dropdown options
  Given I am on the Dashboard page
  When I click on the "Sources" dropdown button
  Then I should see all sources arranged alphabetically as dropdown options

Scenario: No selection of source dropdown option 
  Given I am on the Dashboard page
  When no Sources dropdown options are selected
  Then I should see "Sources" in the text field of the dropdown button

Scenario: Reset source selection by refreshing
  Given I am on the Dashboard page
  And All Sources are selected
  When I refresh the page
  Then I should see "Sources" in the text field of the dropdown button
