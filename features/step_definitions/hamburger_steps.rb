Given(/I am on (Dashboard|Analytics|Actionables|Upload Data)/) do |page|
  @current_page = page
  case page
  when 'Dashboard'
    visit root_path
  else
    visit root_path
    find('#nav-hamburger').click
    within('.MuiList-root.MuiList-padding') do
      find('.MuiListItemText-primary', text: page).click
    end
    find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-1yxmbwk').click
  end
end

When /I select the hamburger menu/ do
  find('#nav-hamburger').click
end

Then /the hamburger menu should expand out to reveal "(.*?)", "(.*?)", "(.*?)", "(.*?)"/ do |dashboard, analytics, actions, upload|
  within('.MuiList-root.MuiList-padding') do
    expect(page).to have_css('.MuiListItemText-primary', text: dashboard, wait: 10)
    expect(page).to have_css('.MuiListItemText-primary', text: analytics, wait: 10)
    expect(page).to have_css('.MuiListItemText-primary', text: actions, wait: 10)
    expect(page).to have_css('.MuiListItemText-primary', text: upload, wait: 10)
  end
end

Then /the page I am currently on should be highlighted/ do
  highlighted_element = find('.menu-item-active') # highlight automatically applies to .menu-item-active
  expect(highlighted_element).to have_content(@current_page)
end

When /I select "(.*?)" and "(.*?)" for the Products/ do |product1, product2|
  select_products([product1, product2])
end

When /I select "(.*?)" and "(.*?)" for the Sources/ do |source1, source2|
  select_sources([source1, source2])
end

When /I click on "(.*?)" in the Hamburger Menu/ do |menu_item|
  find('#nav-hamburger').click
  expect(page).to have_css('.menu-item')
  within('.MuiList-root.MuiList-padding') do
    find('.MuiListItemText-primary', text: menu_item).click
  end
end

Then /I should be redirected to the Analytics Page with the same selected products and sources/ do
  product_values = all('.filter-product-value').map(&:text)
  expect(product_values).to include('Contact Center')
  expect(product_values).to include('Remittance')
  source_values = all('.filter-source-value').map(&:text)
  expect(source_values).to include('Product Survey')
  expect(source_values).to include('Call Centre')
end



# Helper methods
def selected_products
  find('.filter-product-value').value
end

def selected_sources
  find('.filter-source-value').value
end
