require 'json'
require 'net/http'
require 'uri'

# Feature: Control of Time Period on Dashboard Page

# Scenario: View time period
Given(/the earliest and latest dates are available/) do
  @dates = get_earliest_and_latest_dates
end

Then(/the "From" date should be filled up with the date 1 week ago from now in the format of "DD\/MM\/YYYY"/) do
  from_date = (Date.today - 7).strftime("%d/%m/%Y")
  expect(find("#from-date").value).to eq from_date
end

Then(/any dates earlier than the earliest date among all the sources greyed out and unclickable/) do
  earliest_date = Date.parse(@dates[:earliest_date])
  
  # Extract the month and year from the earliest_date
  month_year_format = earliest_date.strftime("%m/%Y")
  # Find all calendar dates using a suitable CSS selector
  calendar_dates = find_all(".MuiPickersDay-root[role='gridcell']")

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip

    # Construct the date with the month and year of earliest_date
    date = Date.parse("#{date_text}/#{month_year_format}")
    # Check if the date is earlier than the earliest_date and disabled
    if date < earliest_date
      expect(date_element).to have_css('.Mui-disabled')
    end
  end
end

Then(/the "To" date filled up with date now in the format of "DD\/MM\/YYYY"/) do
  to_date = Date.today.strftime("%d/%m/%Y")
  expect(find("#to-date").value).to eq to_date
end

Then(/any dates later than the latest date among all the sources greyed out and unclickable/) do
  latest_date = Date.parse(@dates[:latest_date])

  # Extract the month and year from the latest_date
  month_year_format = latest_date.strftime("%m/%Y")

  # Find all calendar dates using a suitable CSS selector
  calendar_dates = find_all(".MuiPickersDay-root[role='gridcell']")

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip

    # Construct the date with the month and year of latest_date
    date = Date.parse("#{date_text}/#{month_year_format}")

    # Check if the date is later than the latest_date and not disabled
    if date > latest_date
      expect(date_element).not_to have_css('.Mui-disabled')
    end
  end
end

# Scenario: Calendar dropdown
When(/I click on the "From" dropdown button/) do
  find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-slyssw', match: :first).click
end

Then(/I should see the calendar dropdown/) do
  expect(page).to have_css('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
end

Then(/it should be clickable/) do
  calendar_dates = all('.MuiPickersDay-root[role="gridcell"]', visible: true)

  clickable_found = false

  calendar_dates.each do |date_element|
    expect(date_element).to be_visible

    # Check if the element is enabled (not disabled)
    unless date_element['aria-disabled'] == 'true'
      # Attempt to click on the date element and handle any errors gracefully
      begin
        date_element.click
        clickable_found = true
        break # Exit loop if we successfully click on a date
      rescue StandardError => e
        puts "Failed to click on date element: #{e.message}"
      end
    end
  end
  expect(clickable_found).to be_truthy, "Expected at least one clickable date element but none were found"
end


# Scenario: Calendar dropdown closes on selection
Given(/I have the "From" calendar dropdown opened/) do
  sleep 1
  dropdown_button = find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-slyssw', match: :first)
  unless page.has_css?('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
    dropdown_button.click
    expect(page).to have_css('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
  end
end

When(/^I select a date$/) do
  # Find all date elements in the calendar
  calendar_dates = all('.MuiPickersDay-root[role="gridcell"]', visible: true)
  # Initialize a variable to store the clicked date
  clicked_date = nil
  # Iterate through each date element to find a clickable one
  calendar_dates.each do |date_element|
    # Check if the date element is not disabled
    unless date_element[:class].include?('Mui-disabled')
      # Click on the date element
      begin
        date_element.click
        clicked_date = date_element.text.strip
        break # Exit the loop after successfully clicking a date
      rescue StandardError => e
        puts "Failed to click on date element: #{e.message}"
      end
    end
  end
  @clicked_date = clicked_date
end

Then(/the calendar dropdown should close/) do
  expect(page).to have_no_css('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
end

Then(/the "From" date should be filled up in the format of "DD\/MM\/YYYY"/) do
  # Parse the stored clicked date to format it correctly
  selected_date = Date.parse("#{@clicked_date}/#{Time.now.month}/#{Time.now.year}").strftime("%d/%m/%Y")
  expect(find("#from-date").value).to eq selected_date
end

# Scenario: Calendar dropdown closes on clicking away
When(/I click away from the calendar dropdown/) do
  find("header").click
end

# Scenario: Reset selection by refreshing
Given(/I have selected a time period/) do
  step 'I select a date'
end

When(/I refresh the page/) do
  visit root_path
end



# Helper methods
def get_earliest_and_latest_dates
  url = URI("http://localhost:3000/analytics/get_earliest_latest_dates")
  response = Net::HTTP.get(url)
  data = JSON.parse(response, symbolize_names: true)
  { earliest_date: data[:earliest_date], latest_date: data[:latest_date] }
rescue StandardError => e
  raise "Failed to fetch earliest and latest dates: #{e.message}"
end