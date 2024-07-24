Feature: Sentiment Categorisation
  
Scenario: Normal view
  Given I am on the Analytics page
  Then I should see a section titled 'Sentiment Trend for Selected Subcategories'
  And I should see a section titled 'Sentiment Categorisation'
  
Scenario: Available dropdown options
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  Then I should see all the subcategories 'United Trust (UT) products' and 'NonUT products'
  
Scenario: Hovering on a subcategory
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  And I hover on 'United Trust (UT) products'
  Then the dropdown option 'United Trust (UT) products' should be highlighted
  
Scenario: Selecting a subcategory adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  Then I should see 'United Trust (UT) products' in the text field of the dropdown button
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  Then I should see at most top 2 subcategories with the highest positive sentiments, sorted in descending order
  And the X-ticks as integers from -100 to 100
  And the Y-ticks as 'Subcategory> Feedback category'
  And I should be able to hover over it to reveal its 'Sentiment - Subcategory > Feedback category: {Percentage}'
  And a 'sort' button and 'view all' button dropdown
  
Scenario: Sort positive to negative sentiment in descending order and vice versa
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  And the categories are currently sorted in descending order of positive sentiment
  When I click on the 'sort' button
  Then I should see the categories sorted in descending order of negative sentiment
  
Scenario: View all
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click 'view all'
  Then I should see the top 3 categories sorted in the same previous order of sentiment
  
Scenario: View less
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click 'view all'
  And I click 'view less'
  Then I should see only the top 2 categories sorted in the same previous order of sentiment
  
Scenario: Look into a specific category
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the red portion in the 'United Trust (UT) products > Staff Related'
  Then I should see a pop-up with the relevant data
  
Scenario: Filter resets on page refresh
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I refresh the page
  Then I should see "Products" in the text field of the dropdown button
  And I should see "Sources" in the text field of the dropdown button
  
Scenario: Insufficient overall data
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '06/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  Then I should see only 1 category
  And clicking on 'view all' would not add more categories to view
  And clicking 'sort' would seem like it did not change the order