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

// Update a GIF
router.put('/gifs/:id', auth, contentCtrl.updateGIF);

// Delete an article
router.delete('/articles/:id', auth, contentCtrl.deleteArticle);

// Delete a GIF
router.delete('/articles/:id', contentCtrl.deleteGIF);

// Comment on other colleagues' articles
router.post('/articles/:id/comment', contentCtrl.commentOnArticle);

// Comment on another colleagues' GIF
router.post('/gifs/:id/comment', contentCtrl.commentOnGIF);

// View all articles/gifs
router.get('/feed', auth, contentCtrl.viewFeed);

// View a specific article
router.get('/articles/:id', contentCtrl.viewAnArticle);

module.exports = router;
