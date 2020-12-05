jest.mock('fs');

const fs = require('fs');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { obseLogHanlder, origStateLogHanlder } = require('../log-messages');

const { res, clearMockRes } = getMockRes();
const originalError = console.error;

describe('Test log-messages module', () => {
  beforeEach(() => {
    console.error = jest.fn();
    clearMockRes();
  });

  test('read obse.log file but file does not exist', (done) => {
    fs.existsSync.mockImplementation(() => false);

    obseLogHanlder(getMockReq(), res);
    expect(res.send).toHaveBeenCalledWith('Log file does not exist');
    expect(res.status).toHaveBeenCalledWith(404);
    done();
  });

  test('read obse.log file and file exists', (done) => {
    fs.existsSync.mockImplementation(() => true);

    obseLogHanlder(getMockReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    done();
  });

  test('read orig-state.log file but file does not exist', (done) => {
    fs.existsSync.mockImplementation(() => false);

    origStateLogHanlder(getMockReq(), res);
    expect(res.status).toHaveBeenCalledWith(404);
    done();
  });

  test('read orig-state.log file and file exists', (done) => {
    fs.existsSync.mockImplementation(() => true);

    origStateLogHanlder(getMockReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    done();
  });

  afterEach(() => {
    console.error = originalError;
  });
});
