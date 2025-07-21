/// <reference types="cypress" />

describe('Startup Ecosystem - Full User Flow', () => {
  it('should allow two users to connect and share contact info', () => {
    // User A signs up and creates a profile
    cy.visit('/signup');
    cy.get('input[name="email"]').type('usera+' + Date.now() + '@test.com');
    cy.get('input[name="password"]').type('TestPassword123!');
    cy.get('button[type="submit"]').click();
    // Complete profile creation (adjust selectors as needed)
    cy.get('input[name="full_name"]').type('User A');
    cy.get('input[name="company"]').type('Test Company');
    cy.get('input[name="role"]').type('Founder');
    cy.get('button').contains('Save').click();
    // Post an opportunity
    cy.get('a').contains('My Opportunities').click();
    cy.get('a').contains('Post Opportunity').click();
    cy.get('input[name="title"]').type('Cypress Test Opportunity');
    cy.get('select[name="type"]').select('Jobs');
    cy.get('input[name="company"]').type('Test Company');
    cy.get('input[name="location"]').type('Remote');
    cy.get('textarea[name="description"]').type('This is a test opportunity posted by Cypress.');
    cy.get('button').contains('Post Opportunity').click();
    // Log out User A
    cy.get('button').contains('Sign Out').click();

    // User B signs up and creates a profile
    cy.visit('/signup');
    cy.get('input[name="email"]').type('userb+' + Date.now() + '@test.com');
    cy.get('input[name="password"]').type('TestPassword123!');
    cy.get('button[type="submit"]').click();
    cy.get('input[name="full_name"]').type('User B');
    cy.get('input[name="company"]').type('Test Company');
    cy.get('input[name="role"]').type('Engineer');
    cy.get('button').contains('Save').click();
    // Discover and grab the opportunity
    cy.get('a').contains('Opportunities').click();
    cy.contains('Cypress Test Opportunity').click();
    cy.get('button').contains('Grab This Opportunity').click();
    // Request connection
    cy.get('button').contains('Connect').click();
    cy.get('button').contains('Send Request').click();
    // Log out User B
    cy.get('button').contains('Sign Out').click();

    // User A logs in and accepts connection
    cy.visit('/signin');
    cy.get('input[name="email"]').type('usera@test.com'); // Use the same email as above
    cy.get('input[name="password"]').type('TestPassword123!');
    cy.get('button[type="submit"]').click();
    cy.get('a').contains('My Connections').click();
    cy.get('button').contains('Share Contact').click();
    // Log out User A
    cy.get('button').contains('Sign Out').click();

    // User B logs in and verifies contact info is revealed
    cy.visit('/signin');
    cy.get('input[name="email"]').type('userb@test.com'); // Use the same email as above
    cy.get('input[name="password"]').type('TestPassword123!');
    cy.get('button[type="submit"]').click();
    cy.get('a').contains('My Connections').click();
    cy.contains('Contact Details Shared!');
    cy.contains('Email');
    // Optionally, check for notification
    cy.get('button[aria-label="Open notifications"]').click();
    cy.contains('Contact Shared');
  });
}); 