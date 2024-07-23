Then("I should see a section titled 'Sentiment Trend for Selected Subcategories'") do
  expect(page).to have_content('Sentiment Trend for Selected Subcategories')
end

Then("I should see a section titled 'Sentiment Categorisation'") do
  expect(page).to have_content('Sentiment Categorisation')
end

When("I click on the 'Subcategory' dropdown button") do
  find('#detailed-sentimentcategoriesgraph-filter-subcategory').click
  # Wait for the dropdown options to be visible
  expect(page).to have_css('ul[role="listbox"]')
end

Then(/I should see all the subcategories '(.*)' and '(.*)'/) do |item1, item2|
  within('ul[role="listbox"]') do
    expect(page).to have_content(item1)
    expect(page).to have_content(item2)
  end
end
  
Then (/I should see '(.*)' in the text field of the dropdown button/) do |item|
    expect(page).to have_content(item)
end
  

And(/I hover on '(.*)'/) do |text|
  dropdown_option = find('li', text: text)
  page.execute_script("arguments[0].classList.add('hovered');", dropdown_option)
end

Then(/the dropdown option '(.*)' should be highlighted/) do |text|
  dropdown_option = find('li', text: text)
  expect(dropdown_option[:class]).to include('hovered')
end

And(/I click on '(.*)'/) do |text|
  find('li', text: text).click
end

Then("I should see 'United Trust (UT) products' in the text field of the dropdown button") do
  expect(find('#detailed-sentimentcategoriesgraph-filter-subcategory').text).to eq('United Trust (UT) products')
end


#================================#
Then("I should see at most top 2 subcategories with the highest positive sentiments, sorted in descending order") do
  # You need to implement a way to verify this, e.g., checking the order of bars in the chart
end

#================================#
And("the X-ticks as integers from -100 to 100") do
  expect(page).to have_content('-100')
  expect(page).to have_content('100')
end

#================================#
And("the Y-ticks as 'Subcategory> Feedback category'") do
  expect(page).to have_content('Subcategory > Feedback category')
end

#================================#
And("I should be able to hover over it to reveal its 'Sentiment - Subcategory > Feedback category: {Percentage}'") do
  find('.nivo-bar').hover
  expect(page).to have_content('Sentiment - Subcategory > Feedback category:')
end

#================================#
And("a 'sort' button and 'view all' button dropdown") do
  expect(page).to have_button('Sort')
  expect(page).to have_button('View All')
end


When("I click on the 'sort' button") do
  click_button('Sort')
end

#================================#
Then("I should see the categories sorted in descending order of negative sentiment") do
  # You need to implement a way to verify this, e.g., checking the order of bars in the chart
end

When("I click 'view all'") do
  click_button('View All')
end

#================================#
Then("I should see the top 3 categories sorted in the same previous order of sentiment") do
  # You need to implement a way to verify this, e.g., checking the order of bars in the chart
end

And("I click 'view less'") do
  click_button('View Less')
end

#================================#
Then("I should see only the top 2 categories sorted in the same previous order of sentiment") do
  # You need to implement a way to verify this, e.g., checking the order of bars in the chart
end

#================================#
When("I click on the red portion in the 'United Trust (UT) products > Staff Related'") do
  find('.nivo-bar', match: :first, text: 'United Trust (UT) products > Staff Related').click
end

#================================#
Then("I should see a pop-up with the relevant data") do
  expect(page).to have_css('.MuiDialog-paper')
end

#================================#
Then("I should see only 1 category") do
  # Verify that only 1 category is displayed in the chart
end

#================================#
And("clicking on 'view all' would not add more categories to view") do
  # Verify that clicking 'View All' doesn't change the number of categories displayed
end

#================================#
And("clicking 'sort' would seem like it did not change the order") do
  # Verify that clicking 'Sort' doesn't change the order of categories displayed
end