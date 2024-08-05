Feature: Categories Sunburst Chart

Scenario: Normal View
  Given I am on the Dashboard page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  Then I should see a widget titled 'Distribution of Categories'
  And columns "Categories", "Total Mentions" and "Avg Sentiment"
  And top 3 rows with the highest 'Total Mentions', sorted in descending order
  And the percentages as float numbers
  
Scenario: Clicking widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'overall-categoriessunburstchart' widget
  Then I should be redirected to 'Analytics' page
  
Scenario: Insufficient overall data
  Given I am on the Dashboard page
  When the date is set from '09/03/2024' to '10/03/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  Then I should see an error message 'No data'