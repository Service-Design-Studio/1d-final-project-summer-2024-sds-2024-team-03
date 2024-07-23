Feature: Hamburger menu functionality for Dashboard
  As a customer experience team member,
  I want to quickly navigate to other pages while my filter selection of time, products and sources are saved
  So that I can quickly access other pages with the same filter settings

Scenario: Navigation bar has correct page buttons
  Given I am on <page>
  Then the navigation bar should show "Dashboard", "Analytics", "Actionables", "Upload Data"
  And the page I am currently on should be highlighted

  Examples:
  | page       |
  | Dashboard  |
  | Analytics  |
  | Actionables |
  | Upload Data |

Scenario: Page title reflects selected page
  Given I am on the Dashboard page
  When I select a <page> on the navigation bar from Dashboard page
  Then the page I am currently on shows the correct page title

  Examples:
  | page       |
  | Analytics  |
  | Actionables |
  | Upload Data |

Scenario: Selections of filter carry over when going to Analytics page
  Given I am on the Dashboard page
  When I select "Contact Center" and "Remittance" for the Products
  And I select "Product Survey" and "Call Centre" for the Sources
  And I click on "Analytics" in the navigation bar
  Then I should be redirected to the selected page with the same selected products and sources.

Scenario: Selections of filter carry over when going to Actionables page
  Given I am on the Dashboard page
  When I select "General Insurance" and "Payments" for the Products
  And I select "5 Star Review" and "Social Media" for the Sources
  And I click on "Actionables" in the navigation bar
  Then I should be redirected to the selected page with the same selected products and sources.
