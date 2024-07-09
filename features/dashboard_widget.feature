Feature: Filter data for visualization widgets on Dashboard

Background: Data has been added to the database

  Given the following feedback exists:
  |date       |feedback                      |product         |subcategory              |feedback_category|sentiment   |sentiment_score|source                  |
  |01/01/2024 |Great product!                |Investments     |Home Loan/Mortgage       |Others           |Frustrated  |0.2            |Product Survey          |
  |02/01/2024 |Not satisfied                 |Unsecured Loans |compliments              |Process Related  |Unsatisfied |1.7            |Call Centre             |
  |03/01/2024 |Average experience            |Others          |customer service issues  |application      |Unsatisfied |2.5            |Social Media            |
  |04/01/2024 |Excellent service             |DBS Treasure    |application process      |Fee Related      |Satisfied   |4.1            |Problem Solution Survey |
  |05/01/2024 |Could be better               |Secured Loans   |Others                   |Staff Related    |Neutral     |2.9            |Social Media            |
  |06/01/2024 |Loved the features!           |DBS Treasure    |Others                   |application      |Excited     |4.7            |Product Survey          |
  |07/01/2024 |Disappointed with the quality |Investments     |compliments              |fee Related      |Unsatisfied |1.3            |Call Centre             |
  |08/01/2024 |Satisfactory performance      |Others          |Home Loan/Mortgage       |process Related  |Satisfied   |3.6            |Problem Solution Survey |
  |09/01/2024 |Amazing user experience       |Others          |compliments              |application      |Excited     |4.9            |Social Media            |
  |10/01/2024 |Needs improvement             |Unsecured Loans |application process      |Others           |Unsatisfied |2.1            |Product Survey          |
  Then 10 seed feedback should exist

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

Scenario: All Products Sources Selected for all dates
  Given I am on the Dashboard page
  When the date is set from '01/01/2024' to '10/01/2024'
  And All Sources are selected
  And All Products are selected
  Then I should see the overall sentiment score as '2.2/5'
  And I should see the percentage change as '↑ 5.9% Increase'
  And I should see the distribution of sentiment as '28.6, 23.8, 27.0, 15.9, 4.8'
  And I should see the distribution of sentiment add up to '100'
