When ("I click on the 'Subcategory' in the sentiment trend dropdown button") do
    find('#detailed-sentimentscoregraph-filter-subcategory').click
    expect(page).to have_css('ul[role="listbox"]')
end

When ("I click on the 'Feedback Category' dropdown button") do
    find('#detailed-sentimentscoregraph-filter-feedbackcategory').click
    expect(page).to have_css('ul[role="listbox"]')
end

Then(/I should see all the feedback categories '(.*)' and '(.*)'/) do |item1, item2|
    within('ul[role="listbox"]') do
      expect(page).to have_content(item1)
      expect(page).to have_content(item2)
    end
  end