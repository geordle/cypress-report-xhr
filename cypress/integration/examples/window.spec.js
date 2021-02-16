/// <reference @types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('cy.window() - get the global window object', () => {
    // https://on.cypress.io/window
    cy.window().should('have.property', 'top')
  })

  it('cy.window()2 - get even more', () => {
    // https://on.cypress.io/window
    cy.window().should('have.property', 'top')
  })


})
