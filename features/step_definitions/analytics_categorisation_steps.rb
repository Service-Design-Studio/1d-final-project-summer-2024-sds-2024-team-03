Then(/I should see a widget titled '(.*)'/) do |widget_title|
  expect(page).to have_content(widget_title)
end

When(/I click on the 'Subcategory' dropdown button in the Sentiment Categorisation widget/) do
  find('#detailed-sentimentcategoriesgraph-filter-subcategory').click
  expect(page).to have_css('ul[role="listbox"]')
end

Then(/I should see all the subcategories '(.*)' and '(.*)'/) do |item1, item2|
  within('ul[role="listbox"]') do
    expect(page).to have_content(item1)
    expect(page).to have_content(item2)
  end
end
  
Then(/I should see '(.*)' in the text field of the Sentiment Categorisation dropdown button/) do |item|
  dropdown_button = find('#detailed-sentimentcategoriesgraph-filter-subcategory')
  expect(dropdown_button).to have_content(item)
end

Then(/I should see 2 subcategories with the most positive sentiments '(.*)' and '(.*)' sorted in descending order/) do |text1, text2|
  parent_element = find("g[transform='translate(250,10)']")
  # Check that the parent element contains both specified texts
  expect(parent_element).to have_content(text1)
  expect(parent_element).to have_content(text2)
end

And(/I hover on '(.*)'/) do |text|
  button = find('li.subcategory-option', text: text, match: :first)
  button.hover
end

Then(/the dropdown option '(.*)' should be highlighted/) do |text|
  button = find('li.subcategory-option', text: text, match: :first)
  # Verify the color change by checking the computed style
  new_background_color = page.evaluate_script("window.getComputedStyle(arguments[0]).backgroundColor;", button)
  expect(new_background_color).to eq('rgba(0, 0, 0, 0.04)')
  # Exit hover state
  page.execute_script("arguments[0].dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));", button)
end

And(/I click on '(.*)'/) do |text|
  find('li', text: text).click
end

And(/the X-ticks are integers from 0 to 100 with step 10/) do
  expected_values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  expected_values.each do |value|
    expect(page).to have_css("text", text: value.to_s)
  end
end

And(/the Y-ticks show '(.*)'/) do |feedback_category|
  parent_element = find("g[transform='translate(250,10)']")
  # Check that the parent element contains both specified texts
  expect(parent_element).to have_content(feedback_category)
end

And(/I should be able to hover over it to reveal the label '(.*)' and percentage '(.*)'/) do |label, percentage|
  red_rect = find('rect[fill="red"]', visible: true)
  red_rect.hover
  hoverlabel = find('[style*="pointer-events"][style*="position: absolute"]')
  expect(hoverlabel).to have_content(label)
  expect(hoverlabel).to have_content(percentage)
end

And(/a 'sort' button and 'view all' button dropdown/) do
  expect(page).to have_button('Sort')
  expect(page).to have_button('View All')
end

When(/I click on the 'sort' button/) do
  click_button('Sort')
end

Then(/the subcategories are currently sorted in descending order of positive sentiment '(.*)' and '(.*)'/) do |text1, text2|
  parent_element = find("g[transform='translate(250,10)']")
  # Check that the parent element contains both specified texts
  expect(parent_element).to have_content(text1)
  expect(parent_element).to have_content(text2)
end

Then(/I should see the subcategories sorted in descending order of negative sentiment '(.*)' and '(.*)'/) do |text1, text2|
  parent_element = find("g[transform='translate(250,10)']")
  # Check that the parent element contains both specified texts
  expect(parent_element).to have_content(text1)
  expect(parent_element).to have_content(text2)
end

When(/I click 'view all'/) do
  click_button('View All')
end

Then(/I should see the top 3 subcategories sorted in this descending order '(.*)', '(.*)', '(.*)'/) do |text1, text2, text3|
  expect(find("g[transform='translate(0,28)']")).to have_content(text1)
  expect(find("g[transform='translate(0,70)']")).to have_content(text2)
  expect(find("g[transform='translate(0,112)']")).to have_content(text3)
end

And(/I click 'view less'/) do
  click_button('View Less')
end

Then(/I should see no longer see the third subcategory '(.*)'/) do |third_subcategory|
  parent_element = find("g[transform='translate(250,10)']")
  expect(parent_element).to have_no_content(third_subcategory)
end

When(/I click on the red portion under '(.*)'/) do |product_subcategory|
  red_rect = find('rect[fill="red"][aria-label*="' + product_subcategory + '"]', visible: true)
  red_rect.hover
  sleep(5)
  red_rect.click
  sleep(5)
end

Then(/I should see a pop-up with the relevant data/) do
  expect(page).to have_css('.MuiDialog-paper')
end

Then(/I should see only 1 subcategory/) do
  parent_element = find("g[transform='translate(250,10)']")
  expect(parent_element).to have_no_css("g[transform='translate(0,100)']")
end

And(/clicking on 'view all' would not add more subcategories to view/) do
  click_button('View All')
  parent_element = find("g[transform='translate(250,10)']")
  expect(parent_element).to have_no_css("g[transform='translate(0,100)']")
end

And(/clicking 'sort' does not change the displayed subcategory '(.*)'/) do |only_subcategory|
  label = find("g[transform='translate(0,71)']")
  expect(label).to have_content(only_subcategory)
  click_button('Sort')
  expect(label).to have_content(only_subcategory)
end
