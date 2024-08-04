require 'rails_helper'

RSpec.feature "Actionables Management", type: :feature, js: true do
  scenario "User creates a new actionable and views it on the index page" do
    # Navigate to the new actionable form
    visit new_actionable_path

    # Fill in the form with valid data
    fill_in 'Action', with: 'New actionable task'
    fill_in 'Status', with: 'Open'
    fill_in 'Subproduct', with: 'New Subproduct'
    fill_in 'Actionable category', with: 'New Category'
    fill_in 'Feedback category', with: 'New Feedback'
    fill_in 'Feedback json', with: '{"key": "value"}'

    # Submit the form
    click_button 'Create Actionable'

    # Verify that we are redirected to the show page with a notice
    expect(page).to have_text('Actionable was successfully created.')
    expect(page).to have_text('New actionable task')
    expect(page).to have_text('Open')

    # Navigate to the index page to see all actionables
    visit actionables_path

    # Verify the new actionable appears on the index page
    expect(page).to have_text('New actionable task')
    expect(page).to have_text('Open')
  end
end
