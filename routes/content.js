// Import Express
const express = require('express');

// Create Router
const router = express.Router();

// Import Content Controllers
const contentCtrl = require('../controllers/content');

/** Routes */

// Create a GIF
router.post('/gifs', contentCtrl.createArticle);

// Create an article
router.post('/articles', contentCtrl.createArticle);

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

// View all articles
router.get('/feed', contentCtrl.viewFeed);

// View a specific article
router.get('/articles/:id', contentCtrl.viewAnArticle);

module.exports = router;
