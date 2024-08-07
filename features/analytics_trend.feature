Feature: Sentiment Trend Graph
  
Scenario: Normal View
  Given I am on the Analytics page
  Then I should see a widget titled 'Sentiment Trend for Selected Subcategories'
  
Scenario: Available Subcategory dropdown options
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  Then I should see all the subcategories 'digiPortfolio', 'Vickers'
  
Scenario: Available Feedback Category dropdown options
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'Vickers'
  And I click on the 'Feedback Category' dropdown button
  Then I should see all the feedback categories 'Staff Related' and 'Technical / System Related'
  
Scenario: Hovering on a dropdown option updates
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I hover on 'digiPortfolio'
  Then the dropdown option 'digiPortfolio' should be highlighted
  
Scenario: Selecting a subcategory highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'digiPortfolio'
  Then I should see 'digiPortfolio' in the text field of the Sentiment Trend Subcategory dropdown button
  
Scenario: Selecting a feedback category highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '21/05/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'Vickers'
  And I click on the 'Feedback Category' dropdown button
  And I click on 'Staff Related'
  Then I should see 'Staff Related' in the text field of the Sentiment Trend Feedback Category dropdown button
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '01/03/2024' to '31/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'digiPortfolio'
  And I click on the 'Feedback Category' dropdown button
  And I click on 'Technical / System Related'
  Then I should see a widget titled 'Sentiment Trend for digiPortfolio'
  And the X-ticks show two months in the format MMM 'YY: 'Apr '24', 'May '24'
  And the Y-ticks are 0 to 5 in steps of 1

Scenario: Label appears when hovering over data plot
  Given I am on the Analytics page
  When the date is set from '02/05/2024' to '02/05/2024'
  And the sources selected are: 'CSS'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'digiPortfolio'
  And I click on the 'Feedback Category' dropdown button
  And I click on 'Technical / System Related'
  Then I should be able to hover over it to reveal the date "02 May '24" and score '+4.1'