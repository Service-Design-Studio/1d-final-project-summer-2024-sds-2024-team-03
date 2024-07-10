Feature: Filter data for visualization widgets on Dashboard

Scenario: Sentiment distribution score is appropriately colored
  Given I am on the Dashboard page
  Then Frustrated score is colored red
  And Unsatisfied score is colored orange
  And Neutral score is colored grey
  And Satisfied score is colored green
  And Excited score is colored darkgreen

Scenario: No selection of products
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then I should see the overall sentiment score as '0/5'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '0, 0, 0, 0, 0'
  And I should see the distribution of sentiment add up to '0'

Scenario: All Products and Sources Selected for 01/01/2024
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '01/01/2024'
  And All Sources are selected
  And All Products are selected
  Then I should see the overall sentiment score as '2.3/5'
  And I should see the percentage change as 'Not Applicable'
  And I should see the distribution of sentiment as '30.0, 40.0, 0, 20.0, 10.0'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting Investments as the products for all dates and sources
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '10/01/2024'
  And All Sources are selected
  And the products selected are: 'Investments'
  Then I should see the overall sentiment score as '2.3/5'
  And I should see the percentage change as '↑ 67.9% Increase'
  And I should see the distribution of sentiment as '11.1, 55.6, 22.2, 0, 11.1'
  And I should see the distribution of sentiment add up to '100'

Scenario: Only selecting Call Centre as the source for all dates and products
  Given I am on the Dashboard page
  When the date is set from '10/04/2024' to '10/06/2024'
  And the sources selected are: 'Product Survey'
  And All Products are selected
  Then I should see the overall sentiment score as '2.5/5'
  And I should see the percentage change as '↓ -3.5% Decrease'
  And I should see the distribution of sentiment as '22.6, 28.4, 19.8, 20.0, 9.2'
  And I should see the distribution of sentiment add up to '100'

Scenario: All Products Sources Selected for All Dates
  Given I am on the Dashboard page
  And the earliest and latest dates are available
  When All Dates are selected
  And All Sources are selected
  And All Products are selected
  Then I should see the overall sentiment score as '2.5/5'
  And I should see the percentage change as '↓ -13.8% Decrease'
  And I should see the distribution of sentiment as '21.1, 29.3, 20.6, 19.9, 9.1'
  And I should see the distribution of sentiment add up to '100'

Scenario: Clicking on sentiment score widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on 'overall-sentiment-score' widget
  Then I should be redirected to 'Analytics' page

Scenario: Clicking on sentiment distribution widget redirects to Analytics page
  Given I am on the Dashboard page
  When I click on 'sentiment-distribution' widget
  Then I should be redirected to 'Analytics' page
