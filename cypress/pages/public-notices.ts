export {}

const Page = require('./_page')

class PublicNoticesPage extends Page {

  logo = "//div[contains(@class,'Pane vertical Pane1  ')]//img[@alt='Logo']"
  inputSearch = "input#searchbtn"
  inputDateStart = "//div[@id='dateStart']//input[@type='text']"
  inputDateEnd = "//div[@id='dateEnd']//input[@type='text']"
  inputState = "//div[@id='state']/div[contains(@class,'-control')]//input"
  inputCounty = "//div[@id='county']/div[contains(@class,'-control')]//input"
  inputNoticeType = "//div[@id='noticetype']/div[contains(@class,'-control')]//input"
  buttonReset = "button#reset"
  buttonSearch = "button#search"

  listResults = "//div[contains(@class,'Pane vertical')]//div[contains(@class,'lg:block')]//div[@role='navigation']"
  countResults = "/preceding-sibling::div"
  divNotices = "/div[contains(@class,'flex-wrap')]"
  buttonLoadMore = "//button[.='Load More']"

  divNoticeInfo = "//div[contains(@class,'Pane vertical')]//div[contains(@class,'overflow-y-scroll')]"
  noticePublishDate = "//header/p"
  noticeLocation = "//div[.='Location']/following-sibling::div"
  noticeText = "//dd"
  noticeTextTermsOfSale = "//dd//div[@align='left'][contains(.,'TERMS OF SALE')]"
  noticeTextDate = "//dd//div[@align='left'][contains(.,'TERMS OF SALE')]/following-sibling::div[1]"
  noticeTextNumber = "//dd//div[@align='left'][contains(.,'TERMS OF SALE')]/following-sibling::div[2]"


  constructor(public url: string) {
    super(url)
  }



  /**
   * Go to the public notices page.
   *
   * @function visit
  */
  visit() {
    cy.intercept('POST', 'https://m.stripe.com/*', { success: true });
    cy.visit(this.url)
  }


  /**
   * Get list results text.
   *
   * @function getListResultsText
  */
  getListResultsText() {
    return cy.xpath(this.listResults).invoke('text')
  }


  /**
   * Get notices list.
   *
   * @function getNotices
  */
  getNotices() {
    return cy.xpath(`${this.listResults}${this.divNotices}`)
  }


  /**
   * Get a single notice using position.
   *
   * @function getNoticeByPosition
   * @param {Number} position
  */
  getNoticeByPosition(position: number) {
    return cy.xpath(`${this.listResults}${this.divNotices}[${position}]`)
  }


  /**
   * Get a single notice information.
   *
   * @function getNoticeInfo
  */
  getNoticeInfo() {
    cy.xpath(this.noticePublishDate).invoke('text').then((publishDate) => {
      cy.xpath(this.noticeLocation).invoke('text').then((location) => {
        cy.xpath(this.noticeText).invoke('text').then((text) => {
          cy.xpath(this.noticeTextDate).invoke('text').then((textDate) => {
            cy.xpath(this.noticeTextNumber).invoke('text').then((textNumber) => {
              let notice = { publishDate, location, text, textDate, textNumber }
              cy.writeFile('notices.json', notice, {flag: "a+"})
            })
          })
        })
      })
    })
  }


  /**
   * View each notice using position.
   *
   * @function getNoticeInfoOneByOne
  */
  getNoticeInfoOneByOne() {
    this.getListResultsText().then((text) => {
      // Proceed Only If there are Search Results
      if (!(text.includes("Whoops!") && text.includes("couldn't find any results"))) {

        this.getNoticesCount().then((count) => {
          // Get The Total Quantity of Notices
          let all  = parseInt(count.replace("Showing ", "").replace(" results", ""))

          // Click each Notice, One by One
          for (let i = 1; i <= all; i++) {
            let notice = `${this.listResults}${this.divNotices}[${i}]`
            cy.xpath(notice).scrollIntoView()
            cy.xpath(notice).click({ force: true })
            cy.wait(500)
            cy.xpath(this.divNoticeInfo).should('be.visible');

            // Get Info for Each Notice
            this.getNoticeInfo()
          }
        })
      }
    })
  }


  /**
   * Get a single notice using text.
   *
   * @function getNoticeByText
   * @param {String} text
  */
  getNoticeByText(text: string) {
    return cy.xpath(`${this.listResults}${this.divNotices}//b[contains(.,'${text}')]`)
  }


  /**
   * Get notices count.
   *
   * @function getNoticesCount
  */
  getNoticesCount() {
    return cy.xpath(`${this.listResults}${this.countResults}`).invoke('text')
  }


  /**
   * Search notices.
   *
   * @function searchNotices
   * @param {String} keyword
   * @param {String} dateStart
   * @param {String} dateEnd
   * @param {String} state
   * @param {String} county
   * @param {String} noticeType
  */
  searchNotices(keyword: string, dateStart: string, dateEnd: string, state: string, county: string, noticeType: string) {
    // Set Keyword
    if (keyword.trim() !== "") {
      cy.xpath(this.inputSearch).clear()
      cy.xpath(this.inputSearch).type(keyword.trim())
    }

    // Set Date Range
    if (dateStart.trim() !== "") {
      cy.xpath(this.inputDateStart).clear()
      cy.xpath(this.inputDateStart).type(dateStart)
    }
    if (dateEnd.trim() !== "") {
      cy.xpath(this.inputDateEnd).clear()
      cy.xpath(this.inputDateEnd).type(dateEnd)
      }

    // Select State and County
    if (state.trim() !== "") {
      cy.xpath(this.inputState).type(`${state}\n`)
      cy.xpath(this.logo).click()
    }
    if (county.trim() !== "") {
      cy.xpath(this.inputCounty).type(`${county}\n`)
      cy.xpath(this.logo).click()
    }

    // Select Notice Type
    if (noticeType.trim() !== "") {
      cy.xpath(this.inputNoticeType).type(`${noticeType}\n`)
      cy.xpath(this.logo).click()
    }

    // Search
    cy.get(this.buttonSearch).click()

    // Wait Until Search is Done
    cy.xpath(this.listResults).should('be.visible');
    cy.wait(1000)
  }


  /**
   * Reset search.
   *
   * @function resetSearch
  */
  resetSearch() {
    cy.get(this.buttonReset).click()
  }


  /**
   * Load all notices.
   *
   * @function loadAllNotices
  */
  loadAllNotices() {
    const buttonLoadMore = `${this.listResults}${this.buttonLoadMore}`

    this.getListResultsText().then((text) => {
      // Proceed Only If there are Search Results
      if (!(text.includes("Whoops!") && text.includes("couldn't find any results"))) {

        this.getNoticesCount().then((count) => {
          // First, Get The Total Expected Quantity of Notices
          let all  = parseInt(count.replace("Showing ", "").replace(" results", ""))

          // Then Get Number of Times We Would Need to Click 'Load More'
          let q = Math.ceil(all / 20)

          // Loop
          for (let i = 0; i < q; i++) {
            // But Get the Number of Notices on Display Right Now
            this.getNotices().then((notices) => {
              let visibleQty = notices.length

              // If the Number of Notices on Display !== Total Expected/
              // Click 'Load More'
              if (all > visibleQty) {
                cy.xpath(buttonLoadMore).then((button) => {
                  if (button.length > 0) {
                    // Scroll to 'Load More' Button, then Click
                    cy.xpath(buttonLoadMore).scrollIntoView()
                    cy.xpath(buttonLoadMore).click()

                    // Wait Until Done
                    this.getNotices().should('not.eq', visibleQty)
                    cy.wait(1000)
                  }
                })
              } else {
                // If the Number of Notices on Display === Total Expected
                // Stop the Loop and Return
                return
              }
            })
          }

        })
      }
    })
  }

}

module.exports = PublicNoticesPage
