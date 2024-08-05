Feature: Categories Stacked Graph (Overview)
  As a Customer Experience Team Member,
  I want to instantly see an overview of top 5 categories of positive sentiments on the landing page
  So that I can understand what aspects of our products or services are most appreciated by customers and reinforce these strengths to enhance overall satisfaction and loyalty
  
Scenario: Display at most top 5 positive categories
  Given I am on the Dashboard page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  Then I should see a widget titled 'Top 5 Negative Categories'
  And I should see 5 subcategories with the most negative sentiments
  And with the 5 most negative sentiments sorted in descending order
  
Scenario: Clicking widget redirects to Analytics page
  Given I am on the Dashboard page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'overall-sentimentcategoriesgraph' widget
  Then I should be redirected to 'Analytics' page
  
Scenario: Insufficient overall data
  Given I am on the Dashboard page
  When the date is set from '09/03/2024' to '10/03/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  Then I should see an error message 'No data'
  
Scenario: Less than 5 categories
  Given I am on the Dashboard page
  When the date is set from '08/03/2024' to '10/03/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And there are less than 5 categories in the category graph
  Then I should see only those categories