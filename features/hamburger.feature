Feature: Hamburger menu functionality for Dashboard
  As a customer experience team member,
  I want to quickly navigate to other pages while my filter selection of time, products and sources are saved
  So that I can quickly access other pages with the same filter settings

Scenario: Expansion of hamburger menu
  Given I am on <page>
  When I select the hamburger menu
  Then the hamburger menu should expand out to reveal "Dashboard", "Analytics", "Actionables", "Upload Data"
  And the page I am currently on should be highlighted

  Examples:
  | page       |
  | Dashboard  |
  | Analytics  |
  | Actionables |
  | Upload Data |

Scenario: Selections of filter carry over when going to analytics or actionables page
  Given I am on the Dashboard page
  When I select "Contact Center" and "Remittance" for the Products
  And I select "Product Survey" and "Call Centre" for the Sources
  When I click on "Analytics" in the Hamburger Menu
  Then I should be redirected to the Analytics Page with the same selected products and sources.
