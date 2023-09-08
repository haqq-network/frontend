import { getGreeting } from '../support/app.po';

describe('haqq-website-app-router', () => {
  beforeEach(() => {
    return cy.visit('/');
  });

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Home of ethical web3');
  });
});
