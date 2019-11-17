// /* eslint-disable global-require */
/* eslint-disable no-undef */
// // \i /Users/Victor/Documents/Coding/Teamwork/teamwork_be/database/db.sql;
const chai = require('chai');
const { expect } = require('chai');
const dotenv = require('dotenv');
const request = require('request');
const chaiHttp = require('chai-http');
const server = require('../server');

//Close server
server.close();
dotenv.config();

chai.use(chaiHttp);

const getData = (options) => {
  return new Promise((resolve, reject) => request(options, (err, res, body) => {
    if (err) reject(err)
    resolve(body.data.token)
  }))
}

/** Unit Testing */
describe('Testing Teamwork API', function () {
  before(() => {
    server.listen(process.env.HOST || 3000);
  })
  after(() => {
    server.close();
  });

  // Create a User
  describe('Create A New User', () => {
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
        });
      done();
    });
  });
  describe('Sign in with New User', function () {
    it('sign in', (done) => {
      const user = {
        email: 'admin@teamwork.com',
        password: '12345',
      };
      chai.request(server)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res.body.data).to.include({
            token: res.body.data.token,
            userId: res.body.data.userId,
          });
          expect(res.body).to.include({
            status: 'success',
            data: res.body.data,
          });
        });
      done();
    });
  });
});

describe('Create an Article', function() {
  //Use before Hook to get token for subsequent tests
  before(async () => {
    server.listen(process.env.PORT || 3000);
    const user = {
      email: 'admin@teamwork.com',
      password: '12345'
    };
  const options = {
    uri: `${process.env.baseURL}/api/v1/auth/signin`,
    method: 'POST',
    body: user,
    json: true,
  }
  this.token = await getData(options);
});
after(() => {
  server.close();
});

  const article = {
    title: 'Hello',
    article: 'Hello World',
  };
  it('Successfully create an article provided the right credentials', (done) => {
    chai.request(server)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.token}`)
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

  it('It displays an error when wrong credentials are used', (done) => {
    chai.request(server)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article)
      .end((err, res) => {
        expect(res.body).to.include({
          status:"error",
          message:res.body.message})
      })
      done();
  })
})

describe('View Feed', () => {
  // Use before Hook to get token for subsequent tests
  before(async () => {
    server.listen(process.env.PORT || 3000);
    const user = {
      email: 'admin@teamwork.com',
      password: '12345'
    };
  const options = {
    uri: `${process.env.baseURL}/api/v1/auth/signin`,
    method: 'POST',
    body: user,
    json: true,
  }
    this.token = await getData(options);
  });
  after(() => {
    server.close();
  });
  it('It should return all the articles and GIFs', (done) => {
    chai.request(server)
      .get('/api/v1/feed')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.token}`)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body).to.include({data:res.body.data})
        // expect(res.body.data[0]).to.include({
        //   id: res.body.data[0].id,
        //   createdOn: res.body.data[0].createdOn,
        //   title: res.body.data[0].title,
        //   authorId: res.body.data[0].authorId,

        // })
      });
    done();
  });
  it('It should return an error message for wrong token', (done) => {
    chai.request(server)
      .get('/api/v1/feed')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${12345}`)
      .end((err, res) => {
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Unable to verify user')
      })
      done();
  })
});