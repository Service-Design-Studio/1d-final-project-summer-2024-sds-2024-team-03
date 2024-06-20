Feature: Control of Time Period on Dashboard Page 

Scenario: View time period
  Given I am on any page
  Then from date must fill up with the date 1 week ago from now
  And to date must fill with the date now

Scenario: Calendar dropdown
  Given I am on any page
  When I click on the "From" dropdown button
  Then I should see the calendar dropdown

Scenario: Calendar dropdown closes on selection 
  Given I am on any page
  And I have the "From" calendar dropdown opened
  When I select a date
  Then the calendar dropdown should close
  And from date must have be in dd/mm/yyyy

Scenario: Calendar dropdown closes on clicking away
  Given I have the "From" calendar dropdown opened
  When I click away from the calendar dropdown
  Then the calendar dropdown should close