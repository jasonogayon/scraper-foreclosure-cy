# Foreclosure Scraper using Cypress

## Running Foreclosure Scraper

---

### Via the Cypress UI

1. Open a web browser. Go to the remote code repository (<https://github.com/jasonogayon/scraper-foreclosure-cy>) and copy its SSH or HTTPS link.

2. On your machine, open a terminal and clone the remote repository locally wherever you want. Run `git clone git@github.com:jasonogayon/scraper-foreclosure-cy.git`.

3. After that, go inside the cloned **scraper-foreclosure-cy** repository. You can decide to rename this directory to what you want.

4. Using a terminal or command-line, install the scraper dependencies. Run `make install` or `npm install`. Wait until done.

5. Open the Cypress UI by running `make open` or `npm run open`.

6. Run the desired scraper.

---

### Headlessly (Browser Running in the Background)

1. Follow the same steps 1-4 above.

2. After that, we can try to run our scraper. Run `make scrape` or `npm run scrape`.

---

### Reports

Running the Cypress scraper generates a test report in HTML format, found inside the **cypress/report** directory.

There will also be a `.mp4` recording of the scraping, saved in the **cypress/videos** directory.

---

Author: Jason B. Ogayon \
Software Engineer and Software Tester
