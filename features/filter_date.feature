Feature: Date filter dropdown for Dashboard
  As a Customer Experience Team Member,
  I want to select different time periods to visualize VOCs.
  So that I can analyze dynamic, time-sensitive data to ensure the most relevant data is used in our decision-making processes

Scenario: View time period
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  Then the "From" date should be filled up with the date 1 week ago from now in the format of "DD-MM-YYYY"
  And the "To" date filled up with date now in the format of "DD-MM-YYYY"

Scenario: Today's date is circled
  Given I am on the Dashboard page
  When I have the "To" calendar dropdown opened
  Then today's date is circled

Scenario: Clickable and unclickable dates based on earliest date
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  When I select the earliest date
  And I have the "From" calendar dropdown opened
  Then any unclickable dates are earlier than the earliest date among all sources
  And any clickable dates are later than or equal to the earliest date among all sources

Scenario: Clickable and unclickable dates based on today or latest date
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  When I select the latest date
  And I have the "To" calendar dropdown opened
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
  And the "From" date should be filled up in the format of "DD-MM-YYYY"

Scenario: Calendar dropdown closes on clicking away
  Given I am on the Dashboard page
  And I have the "From" calendar dropdown opened
  When I click away from the calendar dropdown
  Then the calendar dropdown should close

Scenario: Selected date is circled on calendar dropdown
  Given I am on the Dashboard page
  When I click on the "From" dropdown button
  And I select a date
  And I reopen the calendar dropdown
  Then selected date is circled

Scenario: Reset selection by refreshing
  Given I am on the Dashboard page
  And I click on the "From" dropdown button
  And I select a date
  And I click on the "To" dropdown button
  And I select a date
  When I refresh the page
  Then the "From" date should be filled up with the date 1 week ago from now in the format of "DD-MM-YYYY"
  And the "To" date filled up with date now in the format of "DD-MM-YYYY"

Scenario: Disable invalid date range (From later than To)
  Given I am on the Dashboard page
  And I select a date in the "To" calendar input
  When I click on the "From" dropdown button
  Then any unclickable from-dates are later than to-date
  And any clickable from-dates are earlier than or equal to to-date

Scenario: Disable invalid date range (To earlier than From)
  Given I am on the Dashboard page
  And I select a date in the "From" calendar input 
  When I click on the "To" dropdown button
  Then any unclickable to-dates are earlier than from-date
  And any clickable to-dates are later than or equal to from-date
