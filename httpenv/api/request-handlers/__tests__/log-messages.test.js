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
        fs.readFile.mockImplementation((fileLocation, readType, callback) => {
            callback("Error Message", null);
        });

        obseLogHanlder(getMockReq(), res);
        expect(res.send).toHaveBeenCalledWith("Error Message");
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test('Test read obse.log file and file exists', done => {
        fs.readFile.mockImplementation((fileLocation, readType, callback) => {
            callback(null, "Sample File Data");
        });

        obseLogHanlder(getMockReq(), res);
        expect(res.send).toHaveBeenCalledWith("Sample File Data");
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test('Test read orig-state.log file but file does not exist', done => {
        fs.readFile.mockImplementation((fileLocation, readType, callback) => {
            callback("Error Message", null);
        });

        origStateLogHanlder(getMockReq(), res);
        expect(res.send).toHaveBeenCalledWith("Error Message");
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test('Test read orig-state.log file and file exists', done => {
        fs.readFile.mockImplementation((fileLocation, readType, callback) => {
            callback(null, "Sample File Data");
        });

        origStateLogHanlder(getMockReq(), res);
        expect(res.send).toHaveBeenCalledWith("Sample File Data");
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    afterEach(() => {
        console.error = originalError;
    });
});