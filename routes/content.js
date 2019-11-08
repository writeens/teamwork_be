// Import Express
const express = require('express');

// Import Authentication
const auth = require('../middleware/auth');

// Import Content Controllers
const contentCtrl = require('../controllers/content');

// Create Router
const router = express.Router();

/** Routes */

// Create a GIF
router.post('/gifs', contentCtrl.createArticle);

// Create an article
router.post('/articles', auth, contentCtrl.createArticle);

// Update an article
router.put('/articles', contentCtrl.updateArticle);

// Update a GIF
router.put('/gifs', contentCtrl.updateGIF);

// Delete an article
router.delete('/articles/:id', contentCtrl.deleteArticle);

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
