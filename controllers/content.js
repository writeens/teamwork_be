const dotenv = require('dotenv');
// Import Cloudinary
const cloudinary = require('cloudinary').v2;
// Import DB
const db = require('../database/db');
// Import DataUri
// Import Multer Config
const { dataUri } = require('../middleware/multer-config');
// Dot Env Config
dotenv.config();
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create a GIF controller
const createGIF = (req, res, next) => {
  // Get the userId and store it
  const { userId } = req.decoded;
  if (req.file) {
    // Decode Buffer and store in a file
    const file = dataUri(req).content;
    // Upload to Cloudinary
    cloudinary.uploader.upload(file, {
      folder: 'teamwork',
      use_filename: true,
    }, (error, result) => {
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Unable to upload, try again later',
        });
      }


      db.connect((err, client, done) => {
        if (err) throw (err);
        client.query('INSERT INTO gifs ("createdOn", title, "imageUrl", "authorId", "type") VALUES(NOW(), $1, $2, $3, $4)',
          [req.body.title, result.url, userId, 'gif'], (InsertQueryError, InsertQueryResult) => {
            if (InsertQueryError) throw InsertQueryError;
            if (InsertQueryResult) {
              client.query('SELECT * FROM gifs WHERE "authorId"=1 ORDER BY "createdOn" DESC LIMIT 1', (selectQueryError, selectQueryResult) => {
                if (selectQueryError) throw selectQueryError;
                if (selectQueryResult) {
                  const data = selectQueryResult.rows;
                  res.status(200).json({
                    status: 'success',
                    data: {
                      gifId: data.gifId,
                      message: 'GIF image successfully posted',
                      createdOn: data.createdOn,
                      title: data.title,
                      imageUrl: data.imageUrl,
                    },
                  });
                  done();
                }
              });
            }
          });
      });
    });
  }
};

// Create an Article controller
const createArticle = (req, res, next) => {
  const { userId } = req.decoded;
  db.connect((err, client, done) => {
    if (err) throw err;
    // Get userID from token in header
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
              return res.status(501).json({
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
              done();
            }
          });
        }
      });
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
