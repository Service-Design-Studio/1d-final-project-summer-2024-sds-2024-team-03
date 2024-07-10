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

When(/I select the hamburger menu/) do
  find('#nav-hamburger').click
end

Then(/the hamburger menu should expand out to reveal "(.*?)", "(.*?)", "(.*?)", "(.*?)"/) do |dashboard, analytics, actions, upload|
  within('.MuiList-root.MuiList-padding') do
    expect(page).to have_css('.MuiListItemText-primary', text: dashboard, wait: 1)
    expect(page).to have_css('.MuiListItemText-primary', text: analytics, wait: 1)
    expect(page).to have_css('.MuiListItemText-primary', text: actions, wait: 1)
    expect(page).to have_css('.MuiListItemText-primary', text: upload, wait: 1)
  end
end

Then(/the page I am currently on should be highlighted/) do
  highlighted_element = find('.menu-item-active') # highlight automatically applies to .menu-item-active
  expect(highlighted_element).to have_content(@current_page)
end

When(/I select a (Analytics|Actionables|Upload Data) on the hamburger menu from Dashboard page/) do |page|
  @clicked_page = page
  visit root_path
  find('#nav-hamburger').click
  within('.MuiList-root.MuiList-padding') do
    find('.MuiListItemText-primary', text: page).click
  end
  find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-1yxmbwk').click
end

Then(/the page I am currently on shows the correct page title/) do
  page_title = find('h1')
  actual_title = page_title.text.strip

  expected_title =
  if @clicked_page == 'Dashboard'
    'Overview Dashboard'
  else
    @clicked_page
  end

  expect(actual_title).to eq(expected_title)
end

When(/I select "(.*?)" and "(.*?)" for the Products/) do |product1, product2|
  select_products([product1, product2])
  @product1 = product1
  @product2 = product2
end

When(/I select "(.*?)" and "(.*?)" for the Sources/) do |source1, source2|
  select_sources([source1, source2])
  @source1 = source1
  @source2 = source2
end

When(/I click on "(.*?)" in the Hamburger Menu/) do |menu_item|
  find('#nav-hamburger').click
  expect(page).to have_css('.menu-item')
  within('.MuiList-root.MuiList-padding') do
    find('.MuiListItemText-primary', text: menu_item).click
  end
end

Then(/I should be redirected to the selected page with the same selected products and sources/) do
  product_values = all('.filter-product-value').map(&:text)
  expect(product_values).to include(@product1)
  expect(product_values).to include(@product2)
  source_values = all('.filter-source-value').map(&:text)
  expect(source_values).to include(@source1)
  expect(source_values).to include(@source2)
end



# Helper methods
def selected_products
  find('.filter-product-value').value
end

def selected_sources
  find('.filter-source-value').value
end
