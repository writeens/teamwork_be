/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.baseURL;

describe('Teamwork API testing', function () {
  // Start up server before test starts
  beforeAll(() => {
    server = require('../server');
  });

  // Close server after tests
  afterAll(() => {
    server.close();
  });

  // Get request is made to retrieve the feed
  describe('when a request is made to get all articles/gifs', function () {
    const data = {};
    beforeAll((done) => {
      request.get(`${url}/api/v1/feed`, (err, res, body) => {
        data.body = JSON.parse(body);
        done();
      });
    });

    it('should return an array of articles', function () {
      expect(data.body.message).toBe('viewing feed');
    });
  });
});
