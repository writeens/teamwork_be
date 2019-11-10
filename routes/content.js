// Import Express
const express = require('express');

// Import Authentication
const auth = require('../middleware/auth');

// Import Content Controllers
const contentCtrl = require('../controllers/content');

// Import Multer Config
const multer = require('../middleware/multer-config').multerUpload;

// Create Router
const router = express.Router();

/** Routes */

// Create a GIF
router.post('/gifs', auth, multer, contentCtrl.createGIF);

// Create an article
router.post('/articles', auth, contentCtrl.createArticle);

// Update an article
router.put('/articles/:id', auth, contentCtrl.updateArticle);

// Delete an article
router.delete('/articles/:id', auth, contentCtrl.deleteArticle);

// Delete a GIF
router.delete('/articles/:id', contentCtrl.deleteGIF);

// Comment on other colleagues' articles
router.post('/articles/:id/comment', auth, contentCtrl.commentOnArticle);

// Comment on another colleagues' GIF
router.post('/gifs/:id/comment', auth, contentCtrl.commentOnGIF);

// View all articles/gifs
router.get('/feed', auth, contentCtrl.viewFeed);

// View a specific article
router.get('/articles/:id', contentCtrl.viewAnArticle);

// View a specific gif
router.get('/gifs/:id', contentCtrl.viewAGIF);

module.exports = router;
