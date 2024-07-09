Given(/the following feedback exists/) do |feedback_table|
  feedback_table.hashes.each do |feedback|
      Analytic.create(
        date: feedback['date'],
        feedback: feedback['feedback'],
        product: feedback['product'],
        subcategory: feedback['subcategory'],
        sentiment: feedback['sentiment'],
        sentiment_score: feedback['sentiment_score'],
        source: feedback['source']
      )
  end
end

Then(/(.*) seed feedback should exist/) do |n_seeds|
  expect(Analytic.count).to eq(n_seeds.to_i)
end

Given(/I am on the Dashboard page/) do
  visit root_path
end

Then(/^(.*) score is colored (.*)$/) do |sentiment, color|
  # Find the element with the specified sentiment text
  element = find("p.MuiTypography-root.MuiTypography-body1.css-9l3uo3", text: /#{sentiment}/)
  style = element[:style]

  # Verify that the style contains the expected color
  case color
    when "red"
      expect(style).to include("color: red")
    when "orange"
      expect(style).to include("color: orange")
    when "grey"
      expect(style).to include("color: grey")
    when "green"
      expect(style).to include("color: green")
    when "darkgreen"
      expect(style).to include("color: darkgreen")
    else
      raise "Unknown color: #{color}"
  end
end

And(/All Products are selected/) do
  select_all_products
end

And(/the products selected are: '(.*)'/) do |products|
  select_products(products.split(', '))
end

And(/All Sources are selected/) do
  select_all_sources
end

And(/the sources selected are: '(.*)'/) do |sources|
  select_sources(sources.split(', '))
end

When(/the date is set from '(.*)' to '(.*)'/) do |start_date, end_date|
  set_date_range(start_date, end_date)
end

Then(/I should see the overall sentiment score as '(.*)'/) do |expected_score|
  full_text = find('#overall-sentiment-score').text
  actual_score = full_text.split("\n")[1]
  expect(actual_score).to eq(expected_score)
end

Then(/I should see the percentage change as '(.*)'/) do |expected_change|
  # Find the element containing the percentage change text
  element = find('h6.MuiTypography-subtitle1', text: expected_change)
  
  # Verify the text content
  expect(element).to have_text(expected_change)
  
  # Verify the color based on the class attribute
  class_attribute = element[:class]
  
  if expected_change.include?("Increase")
    expect(class_attribute).to include('css-1p46rei') # Assuming this class indicates green color
  elsif expected_change.include?("Decrease")
    expect(class_attribute).to include('css-s5aq4g') # Assuming this class indicates red color
  elsif expected_change.include?("Not Applicable")
    expect(class_attribute).to include('css-1gcnt69') # Assuming this class indicates red color
  end
end

Then(/I should see the distribution of sentiment as '(.*)'/) do |expected_distribution|
  # Find the element containing the sentiment distribution
  full_text = find('#sentiment-distribution').text
  # Extract the numerical values from the string, including zeros
  actual_distribution = full_text.scan(/\b(\d+\.\d+|\d+(?=%))/).flatten.join(', ')
  # Compare the extracted numbers with the expected distribution
  expect(actual_distribution).to eq(expected_distribution)
end

Then(/I should see the distribution of sentiment add up to '(.*)'/) do |distribution_sum|
  full_text = find('#sentiment-distribution').text
  actual_distribution = full_text.scan(/\b(\d+\.\d+|\d+(?=%))/).flatten.join(', ')
  actual_values = actual_distribution.split(', ').map(&:to_f)

  expected_sum = distribution_sum.to_f
  tolerance = 0.11 # account for rounding error

  expect((actual_values.sum - expected_sum).abs).to be <= tolerance
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


def select_products(products)
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  using_wait_time(2) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown to see the options
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Loop through each product, find it in the dropdown by text, and click to select
  products.each do |product|
    find('.MuiMenuItem-root', text: product, match: :prefer_exact).click
  end

  # Click outside to close the dropdown if necessary
  # This step depends on whether your dropdown closes automatically upon selection or not
  find('body').click(x: 0, y: 200)
end


def select_all_sources
  # Open the dropdown for sources
  find('#filter-source').click

  page.has_css?('.filter-source-option', wait: 1)

  # Select all options by clicking each one
  all('.filter-source-option').each do |option|
    option.click
  end

  # Close dropdown by clicking outside of it
  find('body').click
end


def select_sources(sources)
  # Ensure the dropdown is interactable
  dropdown = find('#filter-source')
  using_wait_time(2) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Iterate through the sources to select
  sources.each do |source|
    find('.MuiMenuItem-root', text: source, match: :prefer_exact).click
  end

  # Close dropdown by clicking outside of it
  find('body').click
end


def set_date_range(start_date, end_date)
  # Fill in the 'From Date' input
  find('#from-date').set(start_date)
  # Fill in the 'To Date' input
  find('#to-date').set(end_date)
  # Additional actions like submitting the form or clicking away to trigger any validations or updates can be added here
  find('header').click # to close date picker if it stays open
end
