Feature: Date filter dropdown for Dashboard

Scenario: View time period
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  Then the "From" date should be filled up with the date 1 week ago from now in the format of "DD/MM/YYYY"
  And any dates earlier than the earliest date among all the sources greyed out and unclickable
  And the "To" date filled up with date now in the format of "DD/MM/YYYY"
  And any dates later than the latest date among all the sources greyed out and unclickable

Scenario: Calendar dropdown
  Given I am on the Dashboard page
  When I click on the "From" dropdown button
  Then I should see the calendar dropdown
  And it should be clickable

Scenario: Calendar dropdown closes on selection 
  Given I am on the Dashboard page
  And I have the "From" calendar dropdown opened
  When I select a date
  Then the calendar dropdown should close
  And the "From" date should be filled up in the format of "DD/MM/YYYY"

Scenario: Calendar dropdown closes on clicking away
  Given I am on the Dashboard page
  And I have the "From" calendar dropdown opened
  When I click away from the calendar dropdown
  Then the calendar dropdown should close

Scenario: Reset selection by refreshing
  Given I am on the Dashboard page
  And I have selected a time period
  When I refresh the page
  Then the "From" date should be filled up with the date 1 week ago from now in the format of "DD/MM/YYYY"
  And the "To" date filled up with date now in the format of "DD/MM/YYYY"
