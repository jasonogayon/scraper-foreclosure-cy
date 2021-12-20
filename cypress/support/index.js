import './commands'
import 'cypress-xpath'
import 'cypress-mochawesome-reporter/register'

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})