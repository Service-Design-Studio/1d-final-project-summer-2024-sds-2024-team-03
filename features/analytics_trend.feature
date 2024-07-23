Feature: Sentiment Trend Graph
  
Scenario: Normal View
  Given I am on the Analytics page
  Then I should see a section titled 'Sentiment Trend for Selected Subcategories'
  And I should see a section titled 'Sentiment Categorisation'
  
Scenario: Available Subcategory dropdown options
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  Then I should see all the subcategories 'United Trust (UT) products' and 'NonUT products'
  
Scenario: Available Feedback Category dropdown options
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  And I click on 'United Trust (UT) products'
  When I click on the 'Feedback Category' dropdown button
  Then I should see all the feedback categories 'Staff Related' and 'Application Related'
  
Scenario: Hovering on a dropdown option updates
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  And I hover on 'United Trust (UT) products'
  Then the dropdown option 'United Trust (UT) products' should be highlighted
  
Scenario: Selecting a subcategory highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  And I click on 'United Trust (UT) products'
  Then I should see 'United Trust (UT) products' in the text field of the dropdown button
  
Scenario: Selecting a feedback category  highlights it and adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  And I click on 'United Trust (UT) products'
  When I click on the 'Feedback Category' dropdown button
  And I click on 'Application Related'
  Then I should see 'Application Related' in the text field of the dropdown button
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' in the sentiment trend dropdown button
  And I click on 'United Trust (UT) products'
  When I click on the 'Feedback Category' dropdown button
  And I click on 'Application Related'
  Then I should see a section titled 'Sentiment Trend for United Trust (UT) products'
  And the X-ticks as dates in format 'MONTH DATE'
  And the Y-ticks as float numbers
  And I should be able to hover over it to reveal its MONTH DATE and sentiment score