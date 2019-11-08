// Import DB
const jwt = require('jsonwebtoken');
const db = require('../database/db');
// Import JWT

// Create a GIF controller
const createGIF = (req, res, next) => {
  console.log('creating a GIF');
};

// Create an Article controller
const createArticle = (req, res, next) => {
  const { userId } = req.decoded;
  db.connect((err, client, done) => {
    if (err) throw err;
    // Author Id is derived from the body for now
    // Will use header unique token details in update
    client.query('INSERT INTO public.articles (title, article, "authorId", type, "createdOn") VALUES ($1, $2, $3, $4, NOW())',
      [req.body.title, req.body.article, userId, 'article'], (queryError, queryResult) => {
        if (queryError) {
          res.status(501).json({
            status: 'error',
            error: 'unable to post article',
          });
        }
        if (queryResult) {
          client.query('SELECT * FROM articles WHERE "authorId"=1 ORDER BY "createdOn" DESC LIMIT 1', (newQueryError, newQueryResult) => {
            const data = newQueryResult;
            if (newQueryError) {
              res.status(501).json({
                status: 'error',
                error: 'unable to post article',
              });
            }
            if (newQueryResult) {
              res.status(201).json({
                status: 'success',
                data: {
                  message: 'Article successfully created',
                  articleId: data.rows[0].articleId,
                  createdOn: data.rows[0].createdOn,
                  title: data.rows[0].title,
                },
              });
            }
          });
        }
      });

    done();
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
        res.status(501).json({
          status: 'error',
          error: 'unable to query database',
        });
      }
      if (queryResult) {
        const result = queryResult.rows;
        const data = result.map((item) => {
          if (item.type === 'gif') {
            return {
              id: item.articleId,
              createdOn: item.createdOn,
              title: item.title,
              url: item.article,
              authorId: item.authorId,
            };
          }
          if (item.type === 'article') {
            return {
              id: item.articleId,
              createdOn: item.createdOn,
              title: item.title,
              article: item.article,
              authorId: item.authorId,
            };
          }
        });
        res.status(201).json({
          status: 'success',
          data,
        });
        done();
      }
    });
    // client.query('SELECT * FROM articles', (queryError, queryResult) => {
    //   if (queryError) {
    //     res.status(501).json({
    //       status: 'error',
    //       error: 'unable to query database',
    //     });
    //   }
    //   if (queryResult) {
    //     result = [result, ...queryResult.rows];
    //   }
    // });
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
