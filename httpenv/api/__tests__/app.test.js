jest.mock('../request-handlers/log-messages');
jest.mock('../request-handlers/state-api');

const request = require('supertest');
const { getMockRes } = require('@jest-mock/express');
const app = require('../app');

const { clearMockRes } = getMockRes();

describe('Test api/app module', () => {
  beforeEach(() => {
    clearMockRes();
  });

  test('get /messages will trigger logHandlers.obseLogHanlder', (done) => {
    request(app)
      .get('/messages')
      .expect('obseLogHanlder is executed')
      .end((err) => {
        if (err) throw err;
      });
    done();
  });

  test('get /run-log will trigger logHandlers.origStateLogHanlder', (done) => {
    request(app)
      .get('/run-log')
      .expect('origStateLogHanlder is executed')
      .end((err) => {
        if (err) throw err;
      });

    done();
  });

  test('get /state will trigger stateHandlers.getState', (done) => {
    request(app)
      .get('/state')
      .expect('getState is executed')
      .end((err) => {
        if (err) throw err;
      });

    done();
  });

  test('get /state will trigger stateHandlers.getState', (done) => {
    request(app)
      .put('/state')
      .expect('updateState is executed')
      .end((err) => {
        if (err) throw err;
      });

    done();
  });
});
