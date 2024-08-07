Feature: Generate and Download Report
  As Product Team Lead of the Customer Experience Team,
  I want to generate comprehensive reports within seconds that include detailed feedback analysis, sentiment trends, keyword analysis, and prediction results,
  So that I can share these structured insights efficiently with my team to make efficient data-driven decisions.
  
Scenario: Generate report
  Given I am on the Dashboard page
  When the date is set from '01/03/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'GENERATE REPORT' button
  Then I should download a .pdf file to my computer
  
Scenario: Generate report with no data
  Given I am on the Dashboard page
  When the date is set from '01/03/2024' to '01/03/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'GENERATE REPORT' button
  Then I should download a .pdf file to my computer
  
Scenario: Generate Report button disabled
  Given I am on the Dashboard page
  When no Products dropdown options are selected
  Then Generate Report button will be disabled
