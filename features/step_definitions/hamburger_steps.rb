Given(/I am on (Dashboard|Analytics|Actionables|UploadData)/) do |page|
  visit('/')
  ## if there are multiple paths:
  #case page.downcase
  #when 'dashboard'
  #  visit('/')
  #else
  #  visit("/#{page.downcase}")
  #end
end

When /I select the hamburger menu/ do
  find('#nav-hamburger').click
end

Then /the hamburger menu should expand out to reveal "(.*?)", "(.*?)", "(.*?)", "(.*?)"/ do |dashboard, analytics, actions, upload|
  expect(page).to have_content(dashboard)
  expect(page).to have_content(analytics)
  expect(page).to have_content(actions)
  expect(page).to have_content(upload)
end

Then /the page I am currently on should be highlighted/ do
  highlighted_element = find('.menu-item-active')
  expect(highlighted_element).to have_content('Dashboard')
  ## expect(highlighted_element).to have_css('color', 'grey') fix this
end

When /I select "(.*?)" and "(.*?)" for the Products/ do |product1, product2|
  select_products([product1, product2])
end

When /I select "(.*?)" and "(.*?)" for the Sources/ do |source1, source2|
  select_sources([source1, source2])
end

When /I click on "(.*?)" in the Hamburger Menu/ do |menu_item|
  find('#nav-hamburger').click_on(menu_item) ## fix this
end

Then /I should be redirected to the Analytics Page with the same selected products and sources/ do
  expect(page).to have_current_path('/analytics')
  expect(selected_products).to include('Contact Center', 'Remittance')
  expect(selected_sources).to include('Product Survey', 'Call Centre')
end



# Helper methods
def selected_products
  find('.filter-product-value').value
end

def selected_sources
  find('.filter-source-value').value
end
