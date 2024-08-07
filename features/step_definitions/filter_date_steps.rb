require 'json'
require 'net/http'
require 'uri'

# Feature: Control of Time Period on Dashboard Page

# Scenario: View time period
Given(/the earliest and latest dates are available/) do
  url = "#{Capybara.app_host}"
  puts url
  @dates = get_earliest_and_latest_dates(url)
end

Then(/the "From" date should be filled up with the date 1 week ago from now in the format of "DD\-MM\-YYYY"/) do
  from_date = (Date.today - 7).strftime("%d-%m-%Y")
  expect(find("#from-date").value).to eq from_date
end

Then(/the "To" date filled up with date now in the format of "DD\-MM\-YYYY"/) do
  to_date = Date.today.strftime("%d-%m-%Y")
  expect(find("#to-date").value).to eq to_date
end

# Scenario: Today's date is circled
Given(/I have the "To" calendar dropdown opened/) do
  sleep(0.1)
  dropdown_button = find('#to-date + .MuiInputAdornment-root button', match: :first)
  unless page.has_css?('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
    dropdown_button.click
    expect(page).to have_css('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
  end
end

Then(/today's date is circled/) do
  today_date = Date.today
  circled_date_element = find('.MuiPickersDay-root.Mui-selected')
  circled_date_text = circled_date_element.text.strip
  circled_date_full = Date.parse("#{circled_date_text}/#{today_date.month}/#{today_date.year}")
  expect(circled_date_full).to eq today_date
end

# Scenario: Clickable and unclickable dates based on earliest date
When(/^I select the earliest date$/) do
  earliest_date = Date.parse(@dates[:earliest_date])
  earliest_date_text = earliest_date.strftime("%d-%m-%Y")
  # Fill in the 'from-date' input field with the earliest date text
  fill_in 'from-date', with: earliest_date_text
end

When(/I have the "From" calendar dropdown opened/) do
  sleep(0.1)
  dropdown_button = find('#from-date + .MuiInputAdornment-root button', match: :first)
  unless page.has_css?('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
    dropdown_button.click
    expect(page).to have_css('.MuiPaper-root.MuiPickersPopper-paper', visible: true)
  end
end

Then(/any unclickable dates are earlier than the earliest date among all sources/) do
  earliest_date = Date.parse(@dates[:earliest_date])
  
  # Extract the month and year from the earliest_date
  month_year_format = earliest_date.strftime("%m/%Y")
  # Find all unclickable calendar dates
  calendar_dates = all('.MuiPickersDay-root.Mui-disabled[role="gridcell"]')
  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be < earliest_date
  end
end

Then(/any clickable dates are later than or equal to the earliest date among all sources/) do
  earliest_date = Date.parse(@dates[:earliest_date])
  # Extract the month and year from the earliest_date
  month_year_format = earliest_date.strftime("%m/%Y")
  
  # Find all clickable calendar dates
  calendar_dates = all('.MuiPickersDay-root:not(.Mui-disabled)[role="gridcell"]')
  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be >= earliest_date
  end
end

# Scenario: Clickable and unclickable dates based on today or latest date
When(/^I select the latest date$/) do
  latest_date = Date.parse(@dates[:latest_date])
  latest_date_text = latest_date.strftime("%d-%m-%Y")
  # Fill in the 'from-date' input field with the earliest date text
  fill_in 'from-date', with: latest_date_text
end

Then(/any unclickable dates are later than the latest date or today among all sources/) do
  latest_date = Date.parse(@dates[:latest_date])
  today_date = Date.today
  # Extract the month and year from the latest_date
  month_year_format = latest_date.strftime("%m/%Y")
  # Find all unclickable calendar dates
  calendar_dates = all('.MuiPickersDay-root.Mui-disabled[role="gridcell"]')
  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be > [latest_date, today_date].min
  end
end

Then(/any clickable dates are earlier than or equal to the latest date or today among all sources/) do
  latest_date = Date.parse(@dates[:latest_date])
  today_date = Date.today
  # Extract the month and year from the latest_date
  month_year_format = latest_date.strftime("%m/%Y")
  # Find all clickable calendar dates
  calendar_dates = all('button.MuiButtonBase-root:not(.Mui-disabled).MuiPickersDay-root[role="gridcell"]')
  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be <= [latest_date, today_date].min
  end
end

# Scenario: Calendar dropdown
When(/I click on the "From" dropdown button/) do
#  find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-slyssw', match: :first).click
  find('#from-date + .MuiInputAdornment-root button', match: :first).click
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

Then(/the "From" date should be filled up in the format of "DD\-MM\-YYYY"/) do
  # Parse the stored clicked date to format it correctly
  selected_date = Date.parse("#{@clicked_date}/#{Time.now.month}/#{Time.now.year}").strftime("%d-%m-%Y")
  expect(find("#from-date").value).to eq selected_date
end

# Scenario: Calendar dropdown closes on clicking away
When(/I click away from the calendar dropdown/) do
  find("header").click
end

# Scenario: Selected date is circled on calendar dropdown
When(/I reopen the calendar dropdown/) do
  step 'I click on the "From" dropdown button'
end

Then(/selected date is circled/) do
  selected_date = Date.parse("#{@clicked_date}/#{Time.now.month}/#{Time.now.year}")
  circled_date_element = find('.MuiPickersDay-root.Mui-selected')
  circled_date_text = circled_date_element.text.strip
  circled_date_full = Date.parse("#{circled_date_text}/#{selected_date.month}/#{selected_date.year}")
  expect(circled_date_full).to eq selected_date
end

# Scenario: Reset selection by refreshing
Given(/I have selected a time period/) do
  step 'I select a date'
end

When(/I refresh the page/) do
  visit current_path
end

# Scenario: Disable invalid date range (From later than To)
Then(/any unclickable from-dates are later than to-date/) do
  to_date_value = find("#to-date").value
  to_date = Date.parse(to_date_value)

  month_year_format = to_date.strftime("%m/%Y")
  calendar_dates = all('.MuiPickersDay-root.Mui-disabled[role="gridcell"]')

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be > to_date
  end
end

Then(/any clickable from-dates are earlier than or equal to to-date/) do
  to_date_value = find("#to-date").value
  to_date = Date.parse(to_date_value)

  month_year_format = to_date.strftime("%m/%Y")
  calendar_dates = all('.MuiPickersDay-root:not(.Mui-disabled)[role="gridcell"]')

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be <= to_date
  end
end

# Scenario: Disable invalid date range (To earlier than From)
When(/I click on the "To" dropdown button/) do
  find('#to-date + .MuiInputAdornment-root button', match: :first).click
end

Then(/any unclickable to-dates are earlier than from-date/) do
  from_date_value = find("#from-date").value
  from_date = Date.parse(from_date_value)

  month_year_format = from_date.strftime("%m/%Y")
  calendar_dates = all('.MuiPickersDay-root.Mui-disabled[role="gridcell"]')

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be < from_date
  end
end

Then(/any clickable to-dates are later than or equal to from-date/) do
  from_date_value = find("#from-date").value
  from_date = Date.parse(from_date_value)

  month_year_format = from_date.strftime("%m/%Y")
  calendar_dates = all('.MuiPickersDay-root:not(.Mui-disabled)[role="gridcell"]')

  calendar_dates.each do |date_element|
    date_text = date_element.text.strip
    date = Date.parse("#{date_text}/#{month_year_format}")
    expect(date).to be >= from_date
  end
end

def get_earliest_and_latest_dates(base_url)
  url = URI("#{base_url}/analytics/get_earliest_latest_dates")
  response = Net::HTTP.get_response(url)

  if response.content_type == "application/json"
    data = JSON.parse(response.body, symbolize_names: true)
    { earliest_date: data[:earliest_date], latest_date: data[:latest_date] }
  else
    raise "Unexpected response type: #{response.body[0..500]}"  # Shows first 500 chars of response for debugging
  end
rescue StandardError => e
  raise "Failed to fetch earliest and latest dates: #{e.message}"
end
