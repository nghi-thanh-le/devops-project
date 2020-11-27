'use strict';

jest.mock('amqplib/callback_api');
jest.useFakeTimers();

const request = require('supertest');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { getState, updateState } = require('../state-api.js');
const amqp = require('amqplib/callback_api');

const { res, next, clearMockRes } = getMockRes();
const originalError = console.error;

const connection = jest.fn();
connection.close = () => {};

const channel = jest.fn();
channel.assertExchange = (channel_name, type, ops) => {};
channel.publish = (channel_name, type, message) => {};


describe('Test state-api module', () => {
    
    beforeEach(() => {
        console.error = jest.fn();
        clearMockRes();
    });

    test('Test getState trigger value from lowdb', done => {
        getState(getMockReq(), res);
        expect(res.json).toHaveBeenCalledWith({
            currentState: 'INIT'
        });
        done();
    });

    test('Test updateState if invalid data', done => {
        const req = getMockReq({
            body: {}
        });

        updateState(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid state'
        });
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test('Test updateState if invalid state', done => {
        const req = getMockReq({
            body: {
                newState: 'Invalid value'
            }
        });

        updateState(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid state'
        });
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test('Test updateState if valid state but error in connection', done => {
        const req = getMockReq({
            body: {
                newState: 'running'
            }
        });

        amqp.connect.mockImplementation((connectString, callback) => {
            return callback("Error message", connection)
        });

        updateState(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error while tring to set state'
        });
        expect(res.status).toHaveBeenCalledWith(500);
        done();
    });

    test('Test updateState if valid state and but failed at create channel', done => {
        const req = getMockReq({
            body: {
                newState: 'running'
            }
        });

        amqp.connect.mockImplementation((connectString, callback) => {
            return callback(null, connection)
        });
        connection.createChannel = callback => callback("Error message", null);

        updateState(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error while tring to set state'
        });
        expect(res.status).toHaveBeenCalledWith(500);
        done();
    });

    test('Test updateState if valid state and broadcast channel', done => {
        const req = getMockReq({
            body: {
                newState: 'running'
            }
        });

        amqp.connect.mockImplementation((connectString, callback) => {
            return callback(null, connection)
        });
        connection.createChannel = callback => callback(null, channel);

        updateState(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Set state done!'
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