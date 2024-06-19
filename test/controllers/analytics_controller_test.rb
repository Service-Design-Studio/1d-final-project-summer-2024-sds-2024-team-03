require "test_helper"

class AnalyticsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @analytic = analytics(:one)
  end

  test "should get index" do
    get analytics_url
    assert_response :success
  end

  test "should get new" do
    get new_analytic_url
    assert_response :success
  end

  test "should create analytic" do
    assert_difference("Analytic.count") do
      post analytics_url, params: { analytic: { date: @analytic.date, feedback: @analytic.feedback, product: @analytic.product, sentiment: @analytic.sentiment, sentiment_score: @analytic.sentiment_score, source: @analytic.source, subcategory: @analytic.subcategory } }
    end

    assert_redirected_to analytic_url(Analytic.last)
  end

  test "should show analytic" do
    get analytic_url(@analytic)
    assert_response :success
  end

  test "should get edit" do
    get edit_analytic_url(@analytic)
    assert_response :success
  end

  test "should update analytic" do
    patch analytic_url(@analytic), params: { analytic: { date: @analytic.date, feedback: @analytic.feedback, product: @analytic.product, sentiment: @analytic.sentiment, sentiment_score: @analytic.sentiment_score, source: @analytic.source, subcategory: @analytic.subcategory } }
    assert_redirected_to analytic_url(@analytic)
  end

  test "should destroy analytic" do
    assert_difference("Analytic.count", -1) do
      delete analytic_url(@analytic)
    end

    assert_redirected_to analytics_url
  end
end
