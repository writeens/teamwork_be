/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// /* eslint-disable global-require */
/* eslint-disable no-undef */
// // \i /Users/Victor/Documents/Coding/Teamwork/teamwork_be/database/db.sql;
const chai = require('chai');
const { expect } = require('chai');
const dotenv = require('dotenv');
const request = require('request');
const chaiHttp = require('chai-http');
const server = require('../server');

dotenv.config();
// Close server
server.close();

// Variables
let adminToken;

chai.use(chaiHttp);

const getData = () => {
  const user = {
    email: 'admin@teamwork.com',
    password: '12345',
  };
  const options = {
    uri: `${process.env.baseURL}/api/v1/auth/signin`,
    method: 'POST',
    body: user,
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) reject(err);
      resolve(body.data.token);
    });
  });
};

// Authentication
describe('Authentication', function () {
  before(async () => {
    server.listen(process.env.PORT || 3000);
    await getData().then((value) => {
      adminToken = value;
    });
  });

  after(async () => {
    server.close();
  });

  // Create a New User
  describe('Create A New User', function () {
    it('It should create a new user', (done) => {
      const user = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@teamwork.com',
        password: '12345',
        gender: 'Male',
        jobRole: 'Developer',
        department: 'Engineering',
        address: 'Lagos',
      };
      chai.request(server)
        .post('/api/v1/auth/create-user')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res.body.data).to.include({
            message: res.body.data.message,
            token: res.body.data.token,
            userId: res.body.data.userId,
          });
          return done();
        });
    });
    it('It should return an error message for incomplete signup data', (done) => {
      chai.request(server)
        .post('/api/v1/auth/create-user')
        .set('Accept', 'application/json')
        .send({
          email: 'test@email.com',
          address: 'Victoria Island',
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          return done();
        });
    });
  });

  // Sign In with user details
  describe('Sign In with user details', function () {
    const user = {
      email: 'admin@teamwork.com',
      password: '12345',
    };
    it('it should return 200 for successful sign in', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.include({
            token: res.body.data.token,
            userId: res.body.data.userId,
          });
          expect(res.body).to.include({
            status: 'success',
            data: res.body.data,
          });
        });
      return done();
    });

    it('It should return an error when only the email is provided', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'admin@teamwork.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Identity verification unavailable');
        });
      return done();
    });

    it('It should return an error when only the password is provided', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({
          password: '12345',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Identity verification unavailable');
        });
      return done();
    });
  });

  // Create An Article
  describe('Create an Article', function () {
    const article = {
      title: 'Hello',
      article: 'Hello World',
    };
    it('It should create an article when provided with the article details and token', (done) => {
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
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
      return done();
    });
    it('It should throw an error when the wrong token is used to access this endpoint', (done) => {
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${12345}`)
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Unable to verify user');
        });
      return done();
    });
    it('It should throw an error when the article is not provided', (done) => {
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'My Dear Wife' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Check request body and/or parameters');
        });
      return done();
    });
    it('It should throw an error when the title is not provided', (done) => {
      chai.request(server)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ article: 'My Dear Wife' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Check request body and/or parameters');
        });
      return done();
    });
  });

  // View Feed
  describe('View all the articles and gifs when all credentials are provided', function () {
    it('It should return a list of gifs and articles', (done) => {
      chai.request(server)
        .get('/api/v1/feed')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include({ status: 'success' });
          expect(res.body.data[0]).to.include({
            id: res.body.data[0].id,
            createdOn: res.body.data[0].createdOn,
            title: res.body.data[0].title,
            authorId: res.body.data[0].authorId,
          });
          return done();
        });
    });
    it('It should throw an error when authentication is not provided', (done) => {
      chai.request(server)
        .get('/api/v1/feed')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${12345}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Unable to verify user');
        });
      return done();
    });
  });

  // Update an Article
  describe('Update the content of an article', function () {
    const article = {
      title: 'Goodbye',
      article: 'Cruel World',
    };
    it('It should update the database and return success when the right credentials are provided', (done) => {
      chai.request(server)
        .put('/api/v1/articles/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.include({
            message: res.body.data.message,
            title: article.title,
            article: article.article,
          });
          return done();
        });
    });

    it('It should throw an error when the title is not provided in the body', (done) => {
      chai.request(server)
        .put('/api/v1/articles/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          article: article.article,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.message).to.be.equal('Check request body and/or parameters');
        });
      return done();
    });

    it('It should throw an error when the article is not provided in the body', (done) => {
      chai.request(server)
        .put('/api/v1/articles/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: article.title,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.message).to.be.equal('Check request body and/or parameters');
        });
      return done();
    });

    it('It should throw an error when authentication is not provided', (done) => {
      chai.request(server)
        .put('/api/v1/articles/1')
        .set('Authorization', `Bearer ${12345}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Unable to verify user');
        });
      return done();
    });
  });

  // Delete an Article
  describe('Deleting an article', function () {
    it('It should delete an article when provided with the right credentials', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.include({
            message: 'Article successfully deleted',
          });
        });
      return done();
    });
    it('It should throw an error when you try to delete an article you did not create', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/5')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('You are not authorized to delete this post');
        });
      return done();
    });
    it('It should throw an error when an invalid article is referenced', async (done) => {
      await adminToken;
      chai.request(server)
        .delete('/api/v1/articles/a3z')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Check request body and/or parameters');
        });
      return done();
    });
    it('It should throw an error when authentication is not provided', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/1')
        .set('Authorization', `Bearer ${12345}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Unable to verify user');
        });
      return done();
    });
  });
});
