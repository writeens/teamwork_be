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
      request.get(`${url}/api/v1/feed/`, (err, res, body) => {
        data.body = JSON.parse(body).data;
        // console.log(data.body);
        done();
      });
    });

    it('should return an array of articles', function () {
      expect(data.body).not.toEqual([]);
    });

    it('each article/gif should contain an Id with type Integer', function () {
      expect(data.body[0].id).toBeDefined();
      expect(data.body[0].id).not.toBeNaN();
    });
    it('each article/gif should contain a createdOn', function () {
      expect(data.body[0].createdOn).toBeDefined();
    });
    it('each article/gif should contain a title with type String', function () {
      expect(data.body[0].title).toBeDefined();
    });
    it('each article/gif should contain a url with type String', function () {
      expect(data.body[0].url || data.body[0].article).toBeDefined();
    });
    it('each article/gif should contain a authorId with type Integer', function () {
      expect(data.body[0].authorId).toBeDefined();
      expect(data.body[0].authorId).not.toBeNaN();
    });
  });
});
