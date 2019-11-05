// Import DB
const db = require('../database/db');

// Create a GIF controller
const createGIF = (req, res, next) => {
  console.log('creating a GIF');
};

// Create an Article controller
const createArticle = (req, res, next) => {
  console.log('creating an Article');
  res.status(200).json({
    message: 'creating an article',
  });
};

// Update Article controller
const updateArticle = (req, res, next) => {
  console.log('updating an Article');
};

// Update GIF controller
const updateGIF = (req, res, next) => {
  console.log('updating an GIF');
};

// Delete Article controller
const deleteArticle = (req, res, next) => {
  console.log('deleting an article');
};

// Delete GIF controller
const deleteGIF = (req, res, next) => {
  console.log('deleting a GIF');
};

// Comment on Article controller
const commentOnArticle = (req, res, next) => {
  console.log('commenting on an article');
};

// Comment on GIF controller
const commentOnGIF = (req, res, next) => {
  console.log('commenting on a GIF');
};

// View all articles
const viewFeed = (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM articles UNION SELECT * FROM gifs', (queryError, queryResult) => {
      if (queryError) {
        return console.error('error running query', err);
      }
      const data = queryResult.rows;
      res.status(201).json({
        data,
      });
      done();
    });
  });
};

// Viewing all GIFs
const viewAnArticle = (req, res, next) => {
  console.log('viewing an article');
};

module.exports = {
  createGIF,
  createArticle,
  updateArticle,
  updateGIF,
  deleteArticle,
  deleteGIF,
  commentOnArticle,
  commentOnGIF,
  viewFeed,
  viewAnArticle,
};
