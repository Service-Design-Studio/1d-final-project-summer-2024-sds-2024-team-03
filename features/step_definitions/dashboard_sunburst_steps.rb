And(/columns "(.*)", "(.*)" and "(.*)"/) do |col1, col2, col3|
  expect(page).to have_css('div', text: col1)
  expect(page).to have_css('div', text: col2)
  expect(page).to have_css('div', text: col3)
end

And(/top 3 rows with the highest 'Total Mentions', sorted in descending order/) do
  # This assumes the rows are sorted by the backend and displayed in the correct order
  categories = ["Investments\n↓\nNonUT products\n↓\nFee Related",
                "Investments\n↓\nUnited Trust (UT) products\n↓\nStaff Related",
                "Investments\n↓\nNonUT products\n↓\nApplication Related"]

  mentions = page.all('div[role="grid"] div:nth-child(2)').map(&:text).map(&:to_i)
  expect(mentions).to eq mentions.sort.reverse
  expect(page).to have_content(categories[0])
  expect(page).to have_content(categories[1])
  expect(page).to have_content(categories[2])
end

And("the percentages as float numbers") do
  average_sentiments = page.all('div[role="grid"] div:nth-child(3)').map(&:text)
  average_sentiments.each do |sentiment|
    expect(sentiment).to match(/\d+\.\d+ \/ 5/)
  end
end