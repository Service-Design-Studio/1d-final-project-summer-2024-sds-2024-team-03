Feature: Filter data for visualization widgets on Dashboard

Scenario: Sentiment distribution bars are appropriately colored
  Given I am on the Dashboard page
  When the date is set from '01/03/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  Then Frustrated bar is colored red
  And Unsatisfied bar is colored orange
  And Neutral bar is colored grey
  And Satisfied bar is colored green
  And Promoter bar is colored darkgreen

Scenario: No selection of products
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then I should see the overall sentiment score as '0'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '0, 0, 0, 0, 0'
  And I should see the distribution of sentiment add up to '0'

Scenario: All Products and Sources Selected for 01/03/2024
  Given I am on the Dashboard page
  When the date is set from '01/03/2024' to '01/03/2024'
  And All Sources are selected
  And All Products are selected
  Then I should see the overall sentiment score as '1.8'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '50.0, 0, 50.0, 0, 0'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting Investments as the product for all sources
  Given I am on the Dashboard page
  When the date is set from '21/05/2024' to '31/05/2024'
  And All Sources are selected
  And the products selected are: 'Investments'
  Then I should see the overall sentiment score as '3.8'
  And I should see the percentage change as '▲ 23.3%'
  And I should see the distribution of sentiment as '5.0, 10.0, 20.0, 55.0, 10.0'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting CSS as the source for all products
  Given I am on the Dashboard page
  When the date is set from '10/04/2024' to '10/06/2024'
  And All Products are selected
  And the sources selected are: 'CSS'
  Then I should see the overall sentiment score as '3.3'
  And I should see the percentage change as '▼ 6.5%'
  And I should see the distribution of sentiment as '4.3, 15.5, 23.5, 47.2, 9.5'
  And I should see the distribution of sentiment add up to '100'

Scenario: All Products Sources Selected for Latest 3 Months
  Given I am on the Dashboard page
  When latest 3 months are selected
  And All Products are selected
  And All Sources are selected
  Then I should see the overall sentiment score as '3.1'
  And I should see the percentage change as '▲ 73.2%'
  And I should see the distribution of sentiment as '7.4, 17.6, 24.0, 39.6, 11.4'
  And I should see the distribution of sentiment add up to '100'

Scenario: Clicking on sentiment score widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'overall-sentiment-score' widget
  Then I should be redirected to 'Analytics' page

Scenario: Clicking on sentiment distribution widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'sentiment-distribution' widget
  Then I should be redirected to 'Analytics' page
