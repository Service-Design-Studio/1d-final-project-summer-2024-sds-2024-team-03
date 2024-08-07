When(/I have selected the Time period '(.*)' to '(.*)'/) do |start_date, end_date|
  set_date_range(start_date, end_date)
end

When(/I have selected the Products/) do
  select_all_products
end

When(/I have selected the Sources/) do
  select_all_sources
end

When(/I click on the generate report button/) do
  find('button', text: 'Generate Report').click
end

Then(/I should download a .pdf file to my computer/) do
  expect(downloads).to include('generated_report.pdf')
end

Given(/Products or Sources is not selected/) do
  deselect_all_products
end

Then(/Generate Report button will be disabled/) do
  expect(find('button', text: 'Generate Report')['disabled']).to be_truthy
end

# helper methods
def select_all_products
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  dropdown.click  # Open the dropdown to see the options

  # Wait for options to be visible
  page.has_css?('.filter-product-option', wait: 1) 

  # Select all options by clicking each one
  all('.filter-product-option').each do |option|
    option.click
  end

  # Wait a moment for any JS processing
  sleep(0.1)

  # Click outside to close the dropdown if necessary
  find('body').click
end

def select_all_sources
  # Open the dropdown for sources
  find('#filter-source').click

  page.has_css?('.filter-source-option', wait: 1)

  # Select all options by clicking each one
  all('.filter-source-option').each do |option|
    option.click
  end

  # Wait a moment for any JS processing
  sleep(0.1)

  # Close dropdown by clicking outside of it
  find('body').click
end

def set_date_range(start_date, end_date)
  # Fill in the 'From Date' input
  find('#from-date').set(start_date)
  # Fill in the 'To Date' input
  find('#to-date').set(end_date)
end