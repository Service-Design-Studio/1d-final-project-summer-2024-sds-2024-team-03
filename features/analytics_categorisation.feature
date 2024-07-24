Feature: Sentiment Categorisation
  
Scenario: Normal View
  Given I am on the Analytics page
  Then I should see a widget titled 'Sentiment Categorisation'
  
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
  And I hover on 'NonUT products'
  Then the dropdown option 'NonUT products' should be highlighted
  
Scenario: Selecting a subcategory adds it to the listbox
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  When I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  Then I should see 'United Trust (UT) products' in the text field of the dropdown button
  And I should see 2 subcategories with the most positive sentiments '> Application Related' and '> Staff Related' sorted in descending order
  
Scenario: Selection from 1 dropdown option updates the visualizations
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '10/01/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  Then the X-ticks are integers from 0 to 100 with step 10
  And the Y-ticks show 'United Trust (UT) products' > 'Staff Related'
  And I should be able to hover over it to reveal the label 'Frustrated' and percentage '50'
  And a 'sort' button and 'view all' button dropdown
  
Scenario: Sort positive to negative sentiment in descending order and vice versa
  Given I am on the Analytics page
  When the date is set from '01/01/2024' to '01/06/2024'
  And the sources selected are: 'Product Survey'
  And the products selected are: 'Investments'
  And I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  And the subcategories are currently sorted in descending order of positive sentiment '> Staff Related' and '> Fee Related' 
  And I click on the 'sort' button
  Then I should see the subcategories sorted in descending order of negative sentiment '> Application Related' and '> Staff Related'
  
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
  And I click on the 'Subcategory' dropdown button
  And I click on 'United Trust (UT) products'
  And I click on the red portion in the 'United Trust (UT) products > Staff Related'
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