const PublicNoticesPage = require('../pages/public-notices')



describe('Foreclosure Scraper', () => {

  const noticesPage = new PublicNoticesPage('https://publicnotices.washingtonpost.com/')


  it('Get notices from "The Washington Post" Public Notices page', () => {
    // Go to 'The Washington Post' Public Notices page
    noticesPage.useMacbook13()
    noticesPage.visit()

    // Set Search Filters
    const keyword = prompt("Search Keyword", "")
    const dateStart = prompt("Start Date", "11/01/2021")
    const dateEnd = prompt("End Date", "11/30/2021")
    const state = prompt("State", "DC")
    const county = prompt("County", "Washington")
    const noticeType = prompt("Notice Type", "Trustee Sale")

    // Search Notices
    noticesPage.searchNotices(keyword, dateStart, dateEnd, state, county, noticeType)

    // Load All Notices
    noticesPage.loadAllNotices()

    // View All Notices, One by One, Getting Info for Each
    noticesPage.getNoticeInfoOneByOne()
  })


})
