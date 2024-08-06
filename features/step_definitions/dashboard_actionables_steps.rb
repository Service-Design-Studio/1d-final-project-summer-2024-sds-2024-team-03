Then(/I should see a progress bar indicating my progress for the number of '(.*)' actions and '(.*)' actions/) do |done, in_progress|
  within("#actions-Tracked") do
    expect(page).to have_content(done)
    expect(page).to have_content(in_progress)
  end
end

Then(/a progress bar/) do
  within("#actions-Tracked") do
    expect(page).to have_css('svg[aria-label="Actionables Tracked"]')
  end
end

Given(/the '(.*)' widget is clickable/) do |widget_name|
  within("##{widget_name.tr(' ', '-').downcase}") do
    expect(page).to have_css("[role='button']")
  end
end

When(/I click on the widget/) do
  find('#actions-Tracked').click
end

Then(/I should be redirected to the '(.*)' page/) do |page_name|
  expect(current_path).to eq("/#{page_name.downcase}")
end

When(/I refresh the page/) do
  visit current_path
end

Then(/the '(.*)' widget should display the same progress bar/) do |widget_name|
  within("##{widget_name.tr(' ', '-').downcase}") do
    expect(page).to have_css('svg[aria-label="Actionables Tracked"]')
  end
end

Given(/there are 0 '(.*)' & '(.*)' actionables available/) do |in_progress, done|
  setup_actionables(in_progress: 0, done: 0)
end

Then(/I should see '(.*)'/) do |message|
  within("#actions-Tracked") do
    expect(page).to have_content(message)
  end
end