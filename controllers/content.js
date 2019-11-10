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
  const { userId } = req.decoded;
  const { id } = req.params;
  db.connect((err, client, done) => {
    if (err) throw err;
    // Check if the user is the author of the post
    client.query('SELECT * FROM articles WHERE "authorId"=$1 AND "articleId"=$2',
      [userId, id], (selectQueryError, selectQueryResult) => {
        if (selectQueryError) throw selectQueryError;
        if (selectQueryResult.rows.length === 0) {
          return res.status(400).json({
            status: 'error',
            message: 'You are not authorized to make edits on this post',
          });
        }
        // Only allow authors update their posts
        if (selectQueryResult.rows.length > 0) {
          client.query('UPDATE articles SET title=$1, article=$2 WHERE "articleId" = $3 AND "authorId" = $4',
            [req.body.title, req.body.article, id, userId],
            (updateQueryError, updateQueryResult) => {
              if (updateQueryError) throw updateQueryError;
              if (updateQueryResult) {
                res.status(200).json({
                  status: 'success',
                  data: {
                    message: 'Article successfully updated',
                    title: req.body.title,
                    article: req.body.article,
                  },
                });
                done();
              }
            });
        }
      });
  });
};

// Delete Article controller
const deleteArticle = (req, res, next) => {
  const { userId } = req.decoded;
  const { id } = req.params;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM articles WHERE "authorId"=$1 AND "articleId"=$2',
      [userId, id], (selectQueryError, selectQueryResult) => {
        if (selectQueryError) throw selectQueryError;
        if (selectQueryResult.rows.length === 0) {
          return res.status(400).json({
            status: 'error',
            message: 'You are not authorized to delete this post',
          });
        }
        if (selectQueryResult.rows.length > 0) {
          client.query('DELETE FROM articles WHERE "articleId"=$1 AND "authorId"=$2',
            [id, userId], (deleteQueryError, deleteQueryResult) => {
              if (deleteQueryError) throw deleteQueryError;
              if (deleteQueryResult) {
                res.status(200).json({
                  status: 'success',
                  data: {
                    message: 'Article successfully deleted',
                  },
                });
                done();
              }
            });
        }
      });
  });
};

// Delete GIF controller
const deleteGIF = (req, res, next) => {
  const { userId } = req.decoded;
  const { id } = req.params;
  console.log(userId, id);
  console.log('deleting a GIF');
};

// Comment on Article controller
const commentOnArticle = (req, res, next) => {
  const { userId } = req.decoded;
  const { id } = req.params;
  db.connect((err, client, done) => {
    client.query('INSERT INTO "articleComments" ("createdOn", comment, "authorId", "articleId") VALUES(NOW(), $1, $2, $3)',
      [req.body.comment, userId, id], (insertQueryError, insertQueryResult) => {
        if (insertQueryError) throw insertQueryError;
        if (insertQueryResult) {
          // Check DB for recently made comment and get the details
          const query = 'SELECT public."articleComments"."createdOn", public.articles.title, public.articles.article, public."articleComments".comment FROM public."articleComments" INNER JOIN articles ON "articleComments"."articleId" = articles."articleId" ORDER BY "createdOn" DESC LIMIT 1';
          client.query(query, (selectQueryError, selectQueryResult) => {
            if (selectQueryError) throw selectQueryError;
            if (selectQueryResult) {
              const data = selectQueryResult.rows[0];
              res.status(201).json({
                status: 'success',
                data: {
                  message: 'Comment successfully created',
                  createdOn: data.createdOn,
                  articleTitle: data.title,
                  article: data.article,
                  comment: data.comment,
                },
              });
              done();
            }
          });
        }
      });
  });
};

// Comment on GIF controller
const commentOnGIF = (req, res, next) => {
  const { userId } = req.decoded;
  const { id } = req.params;
  db.connect((err, client, done) => {
    if (err) throw err;
    // Add Comment to the Database
    client.query('INSERT INTO "gifComments" ("createdOn", comment, "authorId", "gifId") VALUES(NOW(), $1, $2, $3)',
      [req.body.comment, userId, id], (insertQueryError, insertQueryResult) => {
        if (insertQueryError) throw insertQueryError;
        // Successfully Added to DB
        if (insertQueryResult) {
          const query = 'SELECT public."gifComments"."createdOn", public.gifs.title, public."gifComments".comment FROM public."gifComments" INNER JOIN gifs ON "gifComments"."gifId" = gifs."gifId" ORDER BY "createdOn" DESC LIMIT 1';
          // Query DB to get associated GIF details
          client.query(query, (selectQueryError, selectQueryResult) => {
            if (selectQueryError) throw selectQueryError;
            if (selectQueryResult) {
              const data = selectQueryResult.rows[0];
              res.status(201).json({
                status: 'success',
                data: {
                  message: 'Comment successfully created',
                  createdOn: data.createdOn,
                  gifTitle: data.title,
                  comment: data.comment,
                },
              });
              done();
            }
          });
        }
      });
  });
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

// Viewing an article
const viewAnArticle = (req, res, next) => {
  console.log('viewing an article');
};

// Viewing a GIF controller
const viewAGIF = (req, res, next) => {
  console.log('viewing a GIF');
};

module.exports = {
  createGIF,
  createArticle,
  updateArticle,
  viewAGIF,
  deleteArticle,
  deleteGIF,
  commentOnArticle,
  commentOnGIF,
  viewFeed,
  viewAnArticle,
};
