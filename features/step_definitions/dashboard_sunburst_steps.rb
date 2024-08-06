And(/columns "(.*)", "(.*)" and "(.*)"/) do |col1, col2, col3|
  chart = find("#overall-categoriessunburstchart")
  inner_html = chart['innerHTML']  # This accesses the `innerHTML` attribute of the element
  expect(inner_html).to have_content(col1)
  expect(inner_html).to have_content(col2)
  expect(inner_html).to have_content(col3)
end

And(/top 3 rows with the highest 'Total Mentions'/) do
  all_rows = all("div[class='MuiBox-root css-449l07']").first.all("div[class='MuiBox-root css-6t39di']")
  
  row1_displayedtext = all_rows[0].text.gsub(/\s+/, ' ').strip
  row2_displayedtext = all_rows[1].text.gsub(/\s+/, ' ').strip
  row3_displayedtext = all_rows[2].text.gsub(/\s+/, ' ').strip

  row1_expected = ["Investments digiPortfolio Technical / System Related", "5", "2.7"].join(' ')
  row2_expected = ["Investments digiPortfolio Process Related", "4", "3.6"].join(' ')
  row3_expected = ["Investments digiPortfolio Saving / Investment Plans", "3", "4.2"].join(' ')

  expect(row1_displayedtext).to include(row1_expected)
  expect(row2_displayedtext).to include(row2_expected)
  expect(row3_displayedtext).to include(row3_expected)
end

And(/average sentiment of the top 3 rows sorted in ascending order/) do
  all_rows = all("div[class='MuiBox-root css-449l07']").first.all("div[class='MuiBox-root css-6t39di']")
  
  row1_score = all_rows[0].text.gsub(/\s+/, ' ').strip[55..57].to_f
  row2_score = all_rows[1].text.gsub(/\s+/, ' ').strip[44..46].to_f
  row3_score = all_rows[2].text.gsub(/\s+/, ' ').strip[54..56].to_f

  expect(row1_score).to be < row2_score
  expect(row2_score).to be < row3_score
end
