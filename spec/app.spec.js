/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.baseURL;
const auth = `Bearer ${process.env.ADMIN_TOKEN}`;
describe('Teamwork API testing', function () {
  // Start up server before test starts
  beforeAll(() => {
    server = require('../server');
  });

  // Close server after tests
  afterAll(() => {
    server.close();
  });

  // Post request is made to login
  describe('when a request is made to login', function () {
    let result = {};
    beforeAll((done) => {
      request({
        uri: `${url}/api/v1/auth/signin`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        json: {
          email: 'admin@teamwork.com',
          password: '12345',
        },
      }, (err, res, body) => {
        result = body;
        done();
      });
    });

    it('should return a success message, a userId and a token', function () {
      expect(result.status).toBe('success');
      expect(result.data.token).not.toBeNull();
      expect(result.data.userId).not.toBeNaN();
    });
  });

  // Get request is made to retrieve the feed
  describe('when a request is made to get all articles/gifs', function () {
    let result = {};
    beforeAll((done) => {
      request.get(`${url}/api/v1/feed/`, {
        json: true,
        headers: {
          Authorization: auth,
        },
      }, (err, res, body) => {
        result = body;
        done();
      });
    });

    it('should return a body with status set to success', function () {
      expect(result.status).toBe('success');
    });
    it('should return an array of articles', function () {
      expect(result.data).not.toEqual([]);
      expect(result.data[0].id).toBeDefined();
      expect(result.data[0].id).not.toBeNaN();
      expect(result.data[0].createdOn).toBeDefined();
      expect(result.data[0].title).toBeDefined();
      expect(result.data[0].url || result.data[0].article).toBeDefined();
      expect(result.data[0].authorId).toBeDefined();
      expect(result.data[0].authorId).not.toBeNaN();
    });
  });

  // Post request is made to create an article
  describe('when a request is made to login', function () {
    let result = {};
    beforeAll((done) => {
      request({
        uri: `${url}/api/v1/articles`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
        json: {
          title: 'Hello World',
          article: 'Testing Hello World',
        },
      }, (err, res, body) => {
        result = body;
        done();
      });
    });

    it('should return a success message', function () {
      expect(result.status).toBe('success');
    });
    it('should contain a data object with message, articleId, createdOn and title', function () {
      expect(result.data.message).toBe('Article successfully created');
      expect(result.data.articleId).toBeGreaterThan(0);
      expect(result.data.createdOn).toBeDefined();
      expect(result.data.title).toBeDefined();
    });
  });
});
