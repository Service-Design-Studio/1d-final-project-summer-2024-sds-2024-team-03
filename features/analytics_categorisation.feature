Feature: Sentiment Categorisation
  
Scenario: Normal View
  Given I am on the Analytics page
  Then I should see a widget titled 'Sentiment Categorisation'
  
Scenario: Available dropdown options
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  Then I should see all the subcategories 'Vickers', 'digiPortfolio'
  
Scenario: Hovering on a subcategory
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I hover on 'digiPortfolio'
  Then the dropdown option 'digiPortfolio' should be highlighted
  
Scenario: Selecting a subcategory adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  Then I should see 'digiPortfolio' in the text field of the Sentiment Categorisation dropdown button
  And I should see 5 subcategories with the 2 most positive sentiments 'Others' and 'Rewards' sorted in descending order
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  Then the X-ticks are integers from 0 to 100 with step 10
  And the Y-ticks show 'Technical / System Related'
  And I should be able to hover over the yellow bar to reveal the label 'Unsatisfied' and percentage '40'
  And a 'sort' button and 'view all' button dropdown
  
Scenario: Sort positive to negative sentiment in descending order and vice versa
  Given I am on the Analytics page
  When the date is set from '01/03/2024' to '01/06/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  And the subcategories are currently sorted in this descending order of positive sentiment 'Rewards', 'Investment / Saving Plans', 'Technical / System Related', 'Others', 'Features'
  And I click on the 'sort' button
  Then I should see the subcategories sorted in this descending order of negative sentiment 'Technical / System Related', 'Process Related', 'Charges / Fees & Interest', 'Ui / Ux', 'Other'
  
Scenario: View all
  Given I am on the Analytics page
  When the date is set from '01/03/2024' to '01/06/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'Non-Unit Trust/Equities'
  And I click 'view all'
  Then I should see 4 more subcategories sorted in this order 'Technical / System Related', 'Ui / Ux', 'Staff Related', 'Charges / Fees & Interest'
  
Scenario: View less
  Given I am on the Analytics page
  When the date is set from '01/03/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  And I click 'view all'
  And I click 'view less'
  Then I should see no longer see the sixth subcategory 'Saving / Investment Plans'
  
Scenario: Look into a specific subcategory
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  And I click on the orange portion under 'Technical / System Related'
  Then I should see a pop-up with the relevant data
  
Scenario: Filter resets on page refresh
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I refresh the page
  Then I should see "Products" in the text field of the dropdown button
  Then I should see "Sources" in the text field of the dropdown button
  
Scenario: Insufficient overall data
  Given I am on the Analytics page
  When the date is set from '01/03/2024' to '01/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget
  And I click on 'digiPortfolio'
  Then I should see only 1 subcategory
  And clicking on 'view all' would not add more subcategories to view
  And clicking 'sort' does not change the displayed subcategory 'Technical / System Related'