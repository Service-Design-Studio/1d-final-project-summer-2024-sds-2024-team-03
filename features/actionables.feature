Feature: Action Items
  
Scenario: Normal view
  Given I am on the Actionables Page,
  Then I should see four action items widgets titled 'To Fix', 'To Keep In Mind', 'To Amplify', 'To Promote'
  And the Date, Products, and Sources dropdown buttons
  
Scenario: Update widgets
  Given I am on the Actionables Page,
  When Date, Products and Sources are selected
  Then I should see each widget updated with a list of action items
  
Scenario: Details of action item
  Given I am on the Actionables Page,
  When Date, Products and Sources are selected
  Then I should see the Date of each action item
  And I should see the Priority Level of each action item
  And I should see the Description of each action item
  
Scenario: Delete option for action item
  Given I am on the Actionables Page,
  When Date, Products and Sources are selected
  Then I should see a delete option for each action item
  And I should see a confirm-delete button upon hovering
  
Scenario: Editable action item box
  Given I am on the Actionables Page,
  When Date, Products and Sources are selected
  Then I should a clickable 'Add New Card' button on each widget
  And I should see an editable action item box upon clicking
  
Scenario: Editable action item box
  Given I am on the Actionables Page,
  When Date, Products and Sources are selected
  Then I should a tag option for each action item
  And I should see an avatar icon appear upon tagging

Scenario: Reselect a product with no data
  Given I am on the Actionables Page,
  When Date, Product and Source are selected
  And I see each widget updated with a list of action items
  And I reselect a product with no data
  Then I should see four empty widgets