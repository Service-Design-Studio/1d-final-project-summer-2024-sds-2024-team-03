Given(/I am on (Dashboard|Analytics|Actionables|Upload Data)/) do |page|
  @current_page = page
  case page
  when 'Dashboard'
    visit root_path
  else
    visit root_path
    within('header.MuiPaper-root') do
      button = find_button(page, visible: true)
      button.click
    end
  end
end

Given(/I am on the (.*) page/) do |page|
  case page
  when 'Dashboard'
    visit root_path
  else
    visit root_path
    within('header.MuiPaper-root') do
      button = find_button(page, visible: true)
      button.click
    end
  end
end

Then(/the navigation bar should show "(.*?)", "(.*?)", "(.*?)", "(.*?)"/) do |dashboard, analytics, actionables, upload|
  dashboard.upcase!
  analytics.upcase!
  actionables.upcase!
  upload.upcase!

  within('header.MuiPaper-root') do
    within('.MuiBox-root.css-10egq61') do
      expect(page).to have_css('.MuiButton-sizeMedium', text: dashboard, wait: 1)
      expect(page).to have_css('.MuiButton-sizeMedium', text: analytics, wait: 1)
      expect(page).to have_css('.MuiButton-sizeMedium', text: actionables, wait: 1)
      expect(page).to have_css('.MuiButton-sizeMedium', text: upload, wait: 1)
    end
  end
end

Then(/the page I am currently on should be highlighted/) do
  highlighted_element = find('.css-1bnq5nt-MuiButtonBase-root-MuiButton-root') # highlight automatically applies to .css-1ld4d8p
  expect(highlighted_element).to have_content(@current_page.upcase)
end

When(/I select a (Analytics|Actionables|Upload Data) on the navigation bar from Dashboard page/) do |page|
  @clicked_page = page
  visit root_path
  within('header.MuiPaper-root') do
    button = find_button(page, visible: true)
    button.click
  end
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

Then(/I should still be on the (.*) page/) do |page|
  page_title = find('h1')
  actual_title = page_title.text.strip

  expected_title =
  if page == 'Dashboard'
    'Overview Dashboard'
  else
    page
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

When(/I click on "(.*?)" in the navigation bar/) do |menu_item|
  within('header.MuiPaper-root') do
    button = find_button(menu_item, visible: true)
    button.click
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
