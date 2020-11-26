jest.mock('../request-handlers/state-api.js');

const request = require('supertest');
const { response } = require('../app.js');
const app = require('../app.js');

describe('Test the root path', () => {
    test('Mock test db', done => {
        request(app)
            .get('/state')
            .then(response => {
                expect(response.body.currentState).toBe('123');
                done();
            });
    });
});