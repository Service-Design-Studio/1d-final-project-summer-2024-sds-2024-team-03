require "application_system_test_case"

class AnalyticsTest < ApplicationSystemTestCase
  setup do
    @analytic = analytics(:one)
  end

  test "visiting the index" do
    visit analytics_url
    assert_selector "h1", text: "Analytics"
  end

  test "should create analytic" do
    visit analytics_url
    click_on "New analytic"

    fill_in "Date", with: @analytic.date
    fill_in "Feedback", with: @analytic.feedback
    fill_in "Product", with: @analytic.product
    fill_in "Sentiment", with: @analytic.sentiment
    fill_in "Sentiment score", with: @analytic.sentiment_score
    fill_in "Source", with: @analytic.source
    fill_in "Subcategory", with: @analytic.subcategory
    click_on "Create Analytic"

    assert_text "Analytic was successfully created"
    click_on "Back"
  end

  test "should update Analytic" do
    visit analytic_url(@analytic)
    click_on "Edit this analytic", match: :first

    fill_in "Date", with: @analytic.date
    fill_in "Feedback", with: @analytic.feedback
    fill_in "Product", with: @analytic.product
    fill_in "Sentiment", with: @analytic.sentiment
    fill_in "Sentiment score", with: @analytic.sentiment_score
    fill_in "Source", with: @analytic.source
    fill_in "Subcategory", with: @analytic.subcategory
    click_on "Update Analytic"

    assert_text "Analytic was successfully updated"
    click_on "Back"
  end

  test "should destroy Analytic" do
    visit analytic_url(@analytic)
    click_on "Destroy this analytic", match: :first

    assert_text "Analytic was successfully destroyed"
  end
end
