import { getGreeting } from '../support/app.po';

describe('index-page', () => {
  beforeEach(() => {
    return cy.visit('/');
  });

  it('should display welcome message on a large screen', () => {
    cy.viewport(1920, 1080);

    getGreeting().contains('Home of ethical web3');
  });

  it('should display welcome message on a mobile screen', () => {
    cy.viewport(375, 667);

    getGreeting().contains('Home of ethical web3');
  });
});
