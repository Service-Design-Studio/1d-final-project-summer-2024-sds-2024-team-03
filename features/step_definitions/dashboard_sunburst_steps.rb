And(/columns "(.*)", "(.*)" and "(.*)"/) do |col1, col2, col3|
  sleep(10)
  chart = find("#overall-categoriessunburstchart")
  inner_html = chart['innerHTML']  # This accesses the `innerHTML` attribute of the element
  puts inner_html
  
  expect(inner_html).to have_content(col1)
  expect(inner_html).to have_content(col2)
  expect(inner_html).to have_content(col3)
end


And(/top 3 rows with the highest 'Total Mentions', sorted in descending order/) do
  # This assumes the rows are sorted by the backend and displayed in the correct order
  categories = ["Investments\n↓\nNonUT products\n↓\nFee Related",
                "Investments\n↓\nUnited Trust (UT) products\n↓\nStaff Related",
                "Investments\n↓\nNonUT products\n↓\nApplication Related"]

  mentions = page.html.all('div[role="grid"] div:nth-child(2)').map(&:text).map(&:to_i)
  expect(mentions).to eq mentions.sort.reverse
  expect(mentions).to have_content(categories[0])
  expect(mentions).to have_content(categories[1])
  expect(mentions).to have_content(categories[2])
end

And("the Avg. Sentiment as float numbers") do
  average_sentiments = page.html.all('div[role="grid"] div:nth-child(3)').map(&:text)
  average_sentiments.each do |sentiment|
    expect(sentiment).to match(/\d+\.\d+ \/ 5/)
  end
end