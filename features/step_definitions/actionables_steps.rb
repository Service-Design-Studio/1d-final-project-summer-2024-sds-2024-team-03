Then(/I should see the Date, Products, and Sources Filters/) do
  expect(page).to have_field('From')
  expect(page).to have_field('To')
  expect(page).to have_select('Products')
  expect(page).to have_select('Sources')
end

Then(/I should see '(.*)' actionable statuses titled '(.*)', '(.*)', '(.*)'/) do |int, generated_actions, in_progress, done|
  expect(page).to have_content(generated_actions)
  expect(page).to have_content(in_progress)
  expect(page).to have_content(done)
end

Then(/each of the actionable statuses have '(.*)' types of actionable categories '(.*)', '(.*)', '(.*)', '(.*)'/) do |int, to_fix, to_kim, to_amplify, to_promote|
  within('.status-container') do
    expect(page).to have_content(to_fix)
    expect(page).to have_content(to_kim)
    expect(page).to have_content(to_amplify)
    expect(page).to have_content(to_promote)
  end
end

Then(/No data in the GENERATED ACTIONS/) do
  within('.generated-actions') do
    expect(page).to have_content('No data')
  end
end

When(/Date, Products and Sources are selected/) do
  set_date_range('11-03-2024', '06-08-2024')
  select_products(['Digital Channels'])
  select_sources(['Social Media'])
end

Then(/I should see a confirmation dialog/) do
  expect(page).to have_content('Are you sure?')
end

Then(/I should see an indication it is '(.*)'/) do |status|
  expect(page).to have_content(status)
end

Then(/actionable status '(.*)' updated with new actionables/) do |status|
  within('.generated-actions') do
    expect(page).to have_css('.actionable', count: 1)  
  end
end

Then(/the other actionable statuses '(.*)' and '(.*)' remain the same/) do |status1, status2|
  within('.in-progress') do
    expect(page).to have_css('.actionable', count: 2)  
  end
  within('.done') do
    expect(page).to have_css('.actionable', count: 3)  #
  end
end

Then(/all actionables remain the same/) do
  expect(page).to have_css('.actionable', count: 6)  
end

Then(/I should see the Subcategory of each actionable/) do
  expect(page).to have_content('Subcategory:')
end

Then(/I should see the Feedback Category of each actionable/) do
  expect(page).to have_content('Feedback Category:')
end

Then(/I should see the content of each actionable/) do
  expect(page).to have_css('.action-content')
end

Then(/I should see a button to CHANGE STATUS/) do
  expect(page).to have_button('Change Status')
end

Then(/I should see a button to VIEW DATA/) do
  expect(page).to have_button('View Data')
end

When(/I click the delete icon for an actionable/) do
  find('.actionable .delete-icon').click
end

Then(/I should not see the actionable/) do
  expect(page).not_to have_css('.actionable')
end

When(/I click the CHANGE STATUS button of an actionable/) do
  find('.actionable .change-status').click
end

Then(/I should see the buttons of other statuses that are not itself and GENERATED ACTIONS to move the actionable to/) do
  expect(page).to have_button('In Progress')
  expect(page).to have_button('Done')
end

When(/I click one of them/) do
  click_button('In Progress')
end

Then(/I should see that actionable moved to the status I clicked on/) do
  within('.in-progress') do
    expect(page).to have_css('.actionable')
  end
end

When(/I click on the VIEW DATA button of an actionable/) do
  find('.actionable .view-data').click
end

Then(/I should see a dialog popup where I can see all the relevant feedbacks contributing to that action/) do
  expect(page).to have_css('.dialog .feedbacks')
end

Then(/the feedbacks should be scrollable/) do
  expect(page).to have_css('.dialog .feedbacks', visible: true)
end

When(/I click on the "+" to manually add an actionable/) do
  find('.add-actionable').click
end

Then(/I should see that actionable with that action, subcategories, feedback categories under the In Progress status under the actionable category I chose/) do
  within('.in-progress .to-fix') do
    expect(page).to have_content('New Actionable')
  end
end

When(/I refresh the page/) do
  visit current_path
end

Then(/I should see all actionables remain the same/) do
  expect(page).to have_css('.actionable', count: 6)  
end

Then(/Generate Actions button will be disabled/) do
  expect(find_button('Generate Actions')).to be_disabled
end

Then(/if there is insufficient data for actionables to be generated/) do
  expect(page).to have_content('There are no actionables to be generated from this data.')
end

def select_products(products)
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  using_wait_time(1) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown to see the options
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Loop through each product, find it in the dropdown by text, and click to select
  products.each do |product|
    find('.MuiMenuItem-root', text: product, match: :prefer_exact).click
  end

  # Click outside to close the dropdown if necessary
  # This step depends on whether your dropdown closes automatically upon selection or not
  find('body').click(x: 0, y: 200)
end

def select_sources(sources)
  # Ensure the dropdown is interactable
  dropdown = find('#filter-source')
  using_wait_time(1) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Iterate through the sources to select
  sources.each do |source|
    find('.MuiMenuItem-root', text: source, match: :prefer_exact).click
  end

  # Close dropdown by clicking outside of it
  find('body').click
end

def set_date_range(start_date, end_date)
  # Fill in the 'From Date' input
  find('#from-date').set(start_date)
  # Fill in the 'To Date' input
  find('#to-date').set(end_date)
end
