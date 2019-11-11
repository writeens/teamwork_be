/* eslint-disable global-require */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai/register-should');
const dotenv = require('dotenv');
const server = require('../server');

dotenv.config();
const auth = process.env.ADMIN_TOKEN;
const { expect } = chai;
chai.use(chaiHttp);

describe('Testing Teamwork API', () => {
  after(() => {
    server.close();
  });

  // Create An Article
  describe('create an article', () => {
    it('It should create an article', (done) => {
      const article = {
        title: 'Hello',
        article: 'Hello World',
      };
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${auth}`)
        .send(article)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.include({
            message: 'Article successfully created',
            articleId: res.body.data.articleId,
            createdOn: res.body.data.createdOn,
            title: article.title,
          });
        });
      done();
    });

    it('It should return error message when parameters are incomplete', (done) => {
      const article = {
        title: 'Hello',
      };
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${auth}`)
        .send(article)
        .end((err, res) => {
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Check request parameters');
        });
      done();
    });

    it('It should return an error messsage when authentication is not provided', (done) => {
      const article = {
        title: 'Hello',
        article: 'Hello World',
      };
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .send(article)
        .end((err, res) => {
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Invalid authorization, Check token');
        });
      done();
    });
  });

  // View Feed Tests
  describe('Viewing all Articles and GIFs', () => {
    it('It should return all the articles and GIFs', (done) => {
      chai.request(server)
        .get('/api/v1/feed')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${auth}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          res.body.data[0].should.have.property('id');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].should.have.property('title');
          res.body.data[0].should.have.property('authorId');
        });
      done();
    });

    it('It should return an error messsage when authentication is not provided', (done) => {
      chai.request(server)
        .get('/api/v1/feed')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Invalid authorization, Check token');
        });
      done();
    });
  });
});
