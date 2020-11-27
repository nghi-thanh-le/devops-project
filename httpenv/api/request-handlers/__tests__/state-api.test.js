'use strict';

// jest.mock('amqplib/callback_api');

const request = require('supertest');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { getState, updateState } = require('../state-api.js');
const amqp = require('amqplib/callback_api');

const { res, next, clearMockRes } = getMockRes();

describe('Test state-api module', () => {
    beforeEach(() => {
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
});