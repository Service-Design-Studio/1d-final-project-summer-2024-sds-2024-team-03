Feature: Actionables
  As a Customer Experience Team Member,
  I want to find out the list of action items to work on based on the data
  So that I can provide recommendations to the respective product teams.
  
Scenario: Normal view
  Given I am on the Actionables page
  Then I should see a '+' button
  And 3 actionable statuses titled 'GENERATED ACTIONS', 'IN PROGRESS', 'DONE'
  And each of the actionable statuses have 4 types of actionable categories 'To Fix', 'To Keep In Mind', 'To Amplify', 'To Promote'
  
Scenario: Get GENERATED ACTIONS (Yes)
  Given I am on the Actionables page
  And I look at the count for 'IN PROGRESS' and 'DONE'
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'GENERATE ACTIONABLES' button
  Then I should see a confirmation dialog
  And when I click 'YES'
  And I should see an indication it is 'Processing...'
  And the 'GENERATED ACTIONS' is not empty
  And the other actionable statuses 'IN PROGRESS' and 'DONE' remain the same
  
Scenario: Get GENERATED ACTIONS (No)
  Given I am on the Actionables page
  And I look at the count for 'GENERATED ACTIONS', 'IN PROGRESS', and 'DONE'
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'GENERATE ACTIONABLES' button
  Then I should see a confirmation dialog
  And when I click 'NO'
  And all actionables remain the same
  
Scenario: Details of actionable items
  Given I am on the Actionables page
  Then I should see the 'Subcategory' of each actionable
  And I should see the 'Feedback Category' of each actionable
  And I should see the content of each actionable
  And I should see a button to 'CHANGE STATUS' of each actionable
  And I should see a button to 'VIEW DATA' of each actionable
  And I should see a button to delete each actionable
  
Scenario: Delete actionable
  Given I am on the Actionables page
  When I see an actionable
  And I click the delete icon for an actionable
  Then I should not see the actionable
  
Scenario: 'CHANGE STATUS' on actionable
  Given I am on the Actionables page
  And I reinitialise the actionables
  When I see an actionable
  And I click the 'CHANGE STATUS' button of the actionable
  Then I should see the button 'Done'
  And when I click 'Done' 
  Then I should see that actionable moved to the 'DONE' status
  
Scenario: 'VIEW DATA' on actionable
  Given I am on the Actionables page
  When I see an actionable
  And I click on the 'VIEW DATA' button of an actionable
  Then I should see a dialog popup where I can see all the relevant feedbacks contributing to that action
  
Scenario: Manually add actionable
  Given I am on the Actionables page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the plus icon to manually add an actionable
  Then I enter my action 'Improve latency', enter my subcategory 'digiPortfolio', enter my feedback category 'Features' and enter my actionable category 'To Fix', and click 'ADD'
  Then I should see that actionable with that action, subcategories, feedback categories under the 'In Progress' status under the actionable category I chose
  
Scenario: Refresh preserves all actionables 
  Given I am on the Actionables page
  And I look at the count for 'GENERATED ACTIONS', 'IN PROGRESS', and 'DONE'
  When I refresh the page
  Then all actionables remain the same
  
Scenario: Unable to generate actions due to unselected product and source
  Given I am on the Actionables page
  When no Products dropdown options are selected
  And no Sources dropdown options are selected
  Then Generate Actions button will be disabled
  
Scenario: Unable to generate actions due to insufficient data
  Given I am on Actionables page
  When the date is set from '31/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'GENERATE ACTIONABLES' button
  Then I should see a confirmation dialog
  And when I click 'YES'
  Then I should see an indication it is 'Processing...'
  And I should see a message 'There are no actionables to be generated from this data.'