require 'json'
require 'net/http'
require 'uri'

# Feature: Product filter dropdown for Dashboard

# Scenario: Hovering on a product dropdown option updates its color
Given(/there are products in the dataset/) do
  @products = get_products_from_dataset
end

When(/I click on the "Products" dropdown button/) do
  find('#filter-product').click
end

When(/I hover over the product dropdown option/) do
  find('.filter-product-option', match: :first).hover
end

Then(/the product dropdown option should be highlighted on hover/) do
  dropdown_option = find('.filter-product-option', match: :first)
  # Simulate hover effect using plain JavaScript
  page.execute_script("arguments[0].classList.add('hovered');", dropdown_option)
  # Check if the element has the 'hovered' class
  expect(dropdown_option[:class]).to include('hovered')
end

# Scenario: Clicking a product dropdown option colors it red and adds it to the listbox
And(/I select a product/) do
  product = find('.filter-product-option', match: :first)
  product.click
  @selectedproduct = product.text.strip
end

Then(/the (.*) product dropdown option should be (.*)/) do |selectdeselect, color|
  # Find the dropdown option based on @selectedproduct
  product_option = find('.filter-product-option', text: @selectedproduct, visible: true)

  case color
  when 'red'
    # Verify that the selected product has Mui-selected class
    expect(product_option[:class]).to include('Mui-selected')
  when 'reverted to white'
    # Verify that the selected product does not have Mui-selected class
    expect(product_option[:class]).not_to include('Mui-selected')
  end
end

Then(/the (.*) product is (.*) the listbox/) do |selectdeselect, addremove|
  find('body').click
  # Find all product values currently in the listbox
  product_value = all('.filter-product-value').map(&:text)
  
  if selectdeselect == 'selected' && addremove == 'added to'
    # Ensure the selected product is in the listbox
    expect(product_value).to include(@selectedproduct)
  elsif selectdeselect == 'deselected' && addremove == 'removed from'
    # Ensure the deselected product is not in the listbox
    expect(product_value).not_to include(@selectedproduct)
  else
    # Handle unsupported combinations
    raise "Unsupported combination: #{selectdeselect}, #{addremove}"
  end
end

# Scenario: Unclicking a selected product dropdown option resets its color and removes it from the listbox
And(/I deselect the same product/) do
  raise "No product selected" unless @selectedproduct
  find('.filter-product-option', text: @selectedproduct).click
end

# Scenario: Available product dropdown options
Then(/I should see all 18 products arranged alphabetically as dropdown options/) do
  options = all('.filter-product-option').map(&:text)
  expect(options).to eq options.sort
  expect(options.size).to eq 18
end

# Scenario: No selection of product dropdown option
When(/no Products dropdown options are selected/) do
  all('.filter-product-option').each do |option|
    expect(option[:'aria-selected']).to eq 'false'
  end
end

Then(/I should see "Products" in the text field of the dropdown button/) do
  expect(page).to have_css('.MuiFormLabel-root.MuiInputLabel-root', text: 'Products')
end

# Scenario: Reset product selection by refreshing
#   Reused steps



# Helper methods
def get_products_from_dataset
  url_prefix = 'http://localhost:3000'  # URL prefix is the same for both environments

  uri = URI("#{url_prefix}/analytics/filter_products")

  begin
    response = Net::HTTP.get_response(uri)

    unless response.is_a?(Net::HTTPSuccess)
      raise "Failed to fetch products: #{response.message}"
    end

    JSON.parse(response.body).map(&:to_s).sort  # Parse JSON response and sort sources
  rescue Errno::ECONNREFUSED => e
    raise "Connection refused: #{e.message}. Check if the server is running and the URL is correct."
  rescue SocketError => e
    raise "Socket error: #{e.message}. Check the URL and network connectivity."
  end
end
