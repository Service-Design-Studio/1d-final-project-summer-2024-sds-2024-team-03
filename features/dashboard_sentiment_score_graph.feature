Feature: Sentiment Score Graph (Overview)
  As a member of the customer experience team,
  I want to see trends relating the average sentiment over time for all products,
  So that I can monitor changes in customer sentiment and identify any emerging issues or improvements over specific periods, helping to inform strategic decisions.
  
Scenario: Normal View
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '31/05/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  Then I should see a widget titled 'Sentiment Trend for Selected Product(s)'
  And the X-ticks are dates in the format MMM 'YY
  And the Y-ticks are 0 to 5 in step 1
  
Scenario: Clicking widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'overall-sentimentscoregraph' widget
  Then I should be redirected to 'Analytics' page
  
Scenario: Insufficient overall data
  Given I am on the Dashboard page
  When the date is set from '09/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  Then I should see an error message 'No data'