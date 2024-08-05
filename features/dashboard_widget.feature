Feature: Filter data for visualization widgets on Dashboard

Scenario: Sentiment distribution bars are appropriately colored
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '01/03/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  Then Frustrated bar is colored red
  And Unsatisfied bar is colored orange
  And Neutral bar is colored grey
  And Satisfied bar is colored green
  And Excited bar is colored darkgreen

Scenario: No selection of products
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then I should see the overall sentiment score as '0'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '0, 0, 0, 0, 0'
  And I should see the distribution of sentiment add up to '0'

Scenario: All Products and Sources Selected for 01/01/2024
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '01/01/2024'
  And All Sources are selected
  And All Products are selected
  Then I should see the overall sentiment score as '2.3'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '30.0, 40.0, 0, 20.0, 10.0'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting Investments as the product for all sources
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '10/01/2024'
  And All Sources are selected
  And the products selected are: 'Investments'
  Then I should see the overall sentiment score as '2.3'
  And I should see the percentage change as '▲ 67.9%'
  And I should see the distribution of sentiment as '11.1, 55.6, 22.2, 0, 11.1'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting Call Centre as the source for all products
  Given I am on the Dashboard page
  When the date is set from '10/04/2024' to '10/06/2024'
  And the sources selected are: 'Product Survey'
  And All Products are selected
  Then I should see the overall sentiment score as '2.5'
  And I should see the percentage change as '▼ 3.5%'
  And I should see the distribution of sentiment as '22.6, 28.4, 19.8, 20.0, 9.2'
  And I should see the distribution of sentiment add up to '100'

Scenario: All Products Sources Selected for Past 6 Months
  Given I am on the Dashboard page
  When Past 6 Months are selected
  And All Products are selected
  And All Sources are selected
  Then I should see the overall sentiment score as '2.5'
  And I should see the percentage change as '▲ 0.1%'
  And I should see the distribution of sentiment as '21.0, 28.8, 21.5, 20.3, 8.4'
  And I should see the distribution of sentiment add up to '100'

Scenario: Clicking on sentiment score widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'overall-sentiment-score' widget
  Then I should be redirected to 'Analytics' page

Scenario: Clicking on sentiment distribution widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on the 'sentiment-distribution' widget
  Then I should be redirected to 'Analytics' page
