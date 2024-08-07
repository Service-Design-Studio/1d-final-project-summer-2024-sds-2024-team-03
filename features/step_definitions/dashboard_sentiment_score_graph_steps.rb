Then (/I should see an error message '(.*)'/) do |msg|
    expect(page).to have_content(msg)
end

And(/the X-ticks show 2 months in the format MMM 'YY/) do
    expected_values = ["Apr '24", "May '24"]
    expected_values.each do |value|
      expect(page).to have_css("text[dominant-baseline='text-before-edge']", text: value)
    end
  end
