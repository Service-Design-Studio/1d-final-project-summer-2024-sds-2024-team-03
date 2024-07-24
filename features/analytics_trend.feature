Feature: Sentiment Trend Graph
  
Scenario: Normal View
  Given I am on the Analytics page
  Then I should see a widget titled 'Sentiment Trend for Selected Subcategories'
  
Scenario: Available Subcategory dropdown options
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  Then I should see all the subcategories 'United Trust (UT) products' and 'NonUT products'
  
Scenario: Available Feedback Category dropdown options
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'United Trust (UT) products'
  When I click on the 'Feedback Category' dropdown button
  Then I should see all the feedback categories 'Staff Related' and 'Application Related'
  
Scenario: Hovering on a dropdown option updates
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I hover on 'United Trust (UT) products'
  Then the dropdown option 'United Trust (UT) products' should be highlighted
  
Scenario: Selecting a subcategory highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'United Trust (UT) products'
  Then I should see 'United Trust (UT) products' in the text field of the Sentiment Trend Subcategory dropdown button
  
Scenario: Selecting a feedback category highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'United Trust (UT) products'
  When I click on the 'Feedback Category' dropdown button
  And I click on 'Application Related'
  Then I should see 'Application Related' in the text field of the Sentiment Trend Feedback Category dropdown button
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '31/05/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'United Trust (UT) products'
  And I click on the 'Feedback Category' dropdown button
  And I click on 'Application Related'
  Then I should see a widget titled 'Sentiment Trend for United Trust (UT) products'
  And the X-ticks are dates in the format MMM 'YY
  And the Y-ticks are 0 to 5 in step 1

Scenario: Label appears when hovering over data plot
  Given I am on the Analytics page
  When the date is set from '20/04/2024' to '20/04/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button in the Sentiment Trend widget
  And I click on 'United Trust (UT) products'
  And I click on the 'Feedback Category' dropdown button
  And I click on 'Application Related'
  Then I should be able to hover over it to reveal the date '20 Apr 24' and score '+0.9'