When ("I click on the 'Subcategory' dropdown button in the Sentiment Trend widget") do
    find('#detailed-sentimentscoregraph-filter-subcategory').click
    expect(page).to have_css('ul[role="listbox"]')
end

When ("I click on the 'Feedback Category' dropdown button") do
    find('#detailed-sentimentscoregraph-filter-feedbackcategory').click
    expect(page).to have_css('ul[role="listbox"]')
end

Then(/I should see '(.*)' in the text field of the Sentiment Trend Subcategory dropdown button/) do |item|
  dropdown_button = find('#detailed-sentimentscoregraph-filter-subcategory')
  expect(dropdown_button).to have_content(item)
end

Then(/I should see '(.*)' in the text field of the Sentiment Trend Feedback Category dropdown button/) do |item|
  dropdown_button = find('#detailed-sentimentscoregraph-filter-feedbackcategory')
  expect(dropdown_button).to have_content(item)
end

Then(/I should see all the feedback categories '(.*)' and '(.*)'/) do |item1, item2|
  within('ul[role="listbox"]') do
    expect(page).to have_content(item1)
    expect(page).to have_content(item2)
  end
end

And(/the X-ticks are dates in the format MMM 'YY/) do
# find('body').click
  expected_values = ["Feb '24", "Mar '24", "Apr '24", "May '24"]
  expected_values.each do |value|
    expect(page).to have_css("text[dominant-baseline='text-before-edge']", text: value)
  end
end

And(/the Y-ticks are 0 to 5 in step 1/) do
  expected_values = [0, 1, 2, 3, 4, 5]
  expected_values.each do |value|
    # Check for text elements with the dominant-baseline style attribute
    expect(page).to have_css("text[dominant-baseline='central']", text: value)
  end
end

And(/I should be able to hover over it to reveal the date '(.*)' and score '(.*)'/) do |date, score|
  find('body').click
  circle = find('circle[fill="transparent"][stroke="#1f77b4"][stroke-width="2"]', visible: true)
  circle.hover
  hoverlabel = find('[style*="pointer-events"][style*="position: absolute"]')
  expect(hoverlabel).to have_content(date)
  expect(hoverlabel).to have_content(score)
end