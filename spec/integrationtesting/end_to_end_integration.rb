require 'rails_helper'


RSpec.feature "End-to-End Functionality", type: :feature do
  scenario "User goes through a full workflow" do
    visit new_log_path
    fill_in 'Log Message', with: 'System error occurred'
    click_button 'Create Log'
    expect(page).to have_text('Log was successfully created.')

    visit new_actionable_path
    fill_in 'Action', with: 'Resolve system error'
    fill_in 'Status', with: 'Urgent'
    click_button 'Create Actionable'
    expect(page).to have_text('Actionable was successfully created.')

    visit actionables_path
    expect(page).to have_text('Resolve system error')
  end
end