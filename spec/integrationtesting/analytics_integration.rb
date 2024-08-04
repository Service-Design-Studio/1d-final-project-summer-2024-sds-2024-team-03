require 'rails_helper'

RSpec.feature "Analytics Management", type: :feature, js: true do
  given(:valid_attributes) {
    {
      date: '15/08/2024',
      feedback: 'Great product',
      product: 'Others',
      subcategory: 'Home Loans',
      sentiment: 'Positive',
      sentiment_score: '0.9',
      source: 'Survey'
    }
  }

  scenario "User uploads analytics data and views sentiment scores" do
    # Mock the GoogleCloudStorageService to prevent actual API calls
    allow_any_instance_of(GoogleCloudStorageService).to receive(:upload_file).and_return("http://example.com/fake_url")

    # Visit the uploads page and upload a file
    visit uploads_analytics_path
    attach_file 'File', 'features\model_cucumber\valid\valid_voice.csv'
    click_button 'Upload'

    # Check if the file was uploaded successfully
    expect(page).to have_text('File uploaded successfully')
    expect(page).to have_text('http://example.com/fake_url')

    # After upload, visit the page to view analytics
    visit analytics_path

    # Assuming the analytics data is processed and stored
    # Create mock data in the test database
    Analytic.create!(valid_attributes)

    # Go to the page to view sentiment scores
    visit sentiment_scores_analytics_path
    expect(page).to have_text('15/08/2024')
    expect(page).to have_text('Positive')

    # Check the details of analytics
    expect(page).to have_text('Great product')
    expect(page).to have_text('0.9') # Sentiment score
  end
end
