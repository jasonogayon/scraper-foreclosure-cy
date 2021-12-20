export {}

class Page {

  constructor(public url: string) {


    this.url = url
  }



  /**
   * Use a 'macbook-13' viewport.
   *
   * @function visit
  */
  useMacbook13() {
    cy.viewport('macbook-13')
  }


}

module.exports = Page
