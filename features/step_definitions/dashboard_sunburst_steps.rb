And(/columns "(.*)", "(.*)" and "(.*)"/) do |col1, col2, col3|
  sleep(10)
  chart = find("#overall-categoriessunburstchart")
  inner_html = chart['innerHTML']  # This accesses the `innerHTML` attribute of the element
   expect(inner_html).to have_content(col1)
  expect(inner_html).to have_content(col2)
  expect(inner_html).to have_content(col3)
end


And(/top 3 rows with the highest 'Total Mentions', sorted in descending order/) do
  parent_elements = all("div[class='MuiBox-root css-6t39di']")
  puts(parent_elements.length)
  expect(parent_elements.first.find("p").text).to be > parent_elements.second.find("p").text
  expect(parent_elements.second.find("p").text).to be > parent_elements.third.find("p").text
end

And("the Avg. Sentiment as float numbers") do
  average_sentiments = page.html.all('div[role="grid"] div:nth-child(3)').map(&:text)
  average_sentiments.each do |sentiment|
    expect(sentiment).to match(/\d+\.\d+ \/ 5/)
  end
end