'use strict';

jest.mock('fs');

const { getMockReq, getMockRes } = require('@jest-mock/express');
const { obseLogHanlder, origStateLogHanlder } = require('../log-messages');
const fs = require('fs');

const { res, next, clearMockRes } = getMockRes();
const originalError = console.error;

describe('Test log-messages module', () => {
    
    beforeEach(() => {
        console.error = jest.fn();
        clearMockRes();
    });

    test('Test read obse.log file but file does not exist', done => {
        fs.existsSync.mockImplementation((fileLocation) => false);

        obseLogHanlder(getMockReq(), res);
        expect(res.send).toHaveBeenCalledWith('Log file does not exist');
        expect(res.status).toHaveBeenCalledWith(404);
        done();
    });

    test('Test read obse.log file and file exists', done => {
        fs.existsSync.mockImplementation((fileLocation) => true);

        obseLogHanlder(getMockReq(), res);
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test('Test read orig-state.log file but file does not exist', done => {
        fs.existsSync.mockImplementation((fileLocation) => false);

        origStateLogHanlder(getMockReq(), res);
        expect(res.status).toHaveBeenCalledWith(404);
        done();
    });

    test('Test read orig-state.log file and file exists', done => {
        fs.existsSync.mockImplementation((fileLocation) => true);

        origStateLogHanlder(getMockReq(), res);
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    afterEach(() => {
        console.error = originalError;
    });
});