Feature: Hamburger Menu
  As a customer experience team member,
  I want to quickly navigate to other pages while my selection of projects, sources, and time period are saved
  So that I can quickly access other pages with the same filter settings

  Scenario: Expansion of hamburger menu
    Given I am on page
    When I select the hamburger menu
    Then the hamburger menu should expand out to reveal "Dashboard, Analytics, Actionables, Upload Data"

