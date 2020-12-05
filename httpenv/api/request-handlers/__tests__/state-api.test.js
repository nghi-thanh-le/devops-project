jest.mock('amqplib/callback_api');
jest.useFakeTimers();

const amqp = require('amqplib/callback_api');

const { getMockReq, getMockRes } = require('@jest-mock/express');
const { getState, updateState } = require('../state-api');

const { res, clearMockRes } = getMockRes();
const originalError = console.error;

const connection = jest.fn();
connection.close = () => {};

const channel = jest.fn();
channel.assertExchange = (channelName, type, ops) => {}; // eslint-disable-line no-unused-vars
channel.publish = (channelName, type, message) => {}; // eslint-disable-line no-unused-vars

describe('Test state-api module', () => {
  beforeEach(() => {
    console.error = jest.fn();
    clearMockRes();
  });

  test('getState trigger value from lowdb', (done) => {
    getState(getMockReq(), res);
    expect(res.json).toHaveBeenCalledWith({
      currentState: 'INIT',
    });
    done();
  });

  test('updateState if invalid data', (done) => {
    updateState(getMockReq(), res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid state',
    });
    expect(res.status).toHaveBeenCalledWith(400);
    done();
  });

  test('updateState if invalid state', (done) => {
    const req = getMockReq({
      body: {
        newState: 'Invalid value',
      },
    });

    updateState(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid state',
    });
    expect(res.status).toHaveBeenCalledWith(400);
    done();
  });

  test('updateState if valid state but error in connection', (done) => {
    const req = getMockReq({
      body: {
        newState: 'running',
      },
    });

    amqp.connect.mockImplementation((connectString, callback) => {
      return callback('Error message', connection);
    });

    updateState(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error while tring to set state',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    done();
  });

  test('updateState if valid state and but failed at create channel', (done) => {
    const req = getMockReq({
      body: {
        newState: 'running',
      },
    });

    amqp.connect.mockImplementation((connectString, callback) => {
      return callback(null, connection);
    });
    connection.createChannel = (callback) => callback('Error message', null);

    updateState(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error while tring to set state',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    done();
  });

  test('updateState if valid state and broadcast channel', (done) => {
    const req = getMockReq({
      body: {
        newState: 'running',
      },
    });

    amqp.connect.mockImplementation((connectString, callback) => {
      return callback(null, connection);
    });
    connection.createChannel = (callback) => callback(null, channel);

    updateState(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Set state done!',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
    done();
  });

  afterEach(() => {
    console.error = originalError;
  });
});
