Feature: Date filter dropdown for Dashboard

Scenario: View time period
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  Then the "From" date should be filled up with the date 1 week ago from now in the format of "DD/MM/YYYY"
  And the "To" date filled up with date now in the format of "DD/MM/YYYY"

Scenario: Clickable and unclickable dates based on earliest date
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  When I select the earliest date
  And I have the "From" calendar dropdown opened
  Then any unclickable dates are earlier than the earliest date among all sources
  And any clickable dates are later than or equal to the earliest date among all sources

Scenario: Clickable and unclickable dates based on latest date
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  When I select the latest date
  And I have the "From" calendar dropdown opened
  Then any unclickable dates are later than the latest date or today among all sources
  And any clickable dates are earlier than or equal to the latest date or today among all sources

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

Scenario: Disable invalid date range (From later than To)
  Given I am on the Dashboard page
  And I have the "To" calendar dropdown opened
  And I select a date
  When I click on the "From" dropdown button
  Then any unclickable from-dates are later than to-date
  And any clickable from-dates are earlier than or equal to to-date

Scenario: Disable invalid date range (To earlier than From)
  Given I am on the Dashboard page
  And I have the "From" calendar dropdown opened
  And I select a date
  When I click on the "To" dropdown button
  Then any unclickable to-dates are earlier than from-date
  And any clickable to-dates are later than or equal to from-date
