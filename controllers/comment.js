// first we import our dependencies…
const express = require('express');
const Comment = require('../models/comment');

// and create our instances
const router = express.Router();

router.get('/count', (req, res) => {
    Comment.count((err, comments) => {
        return res.json({ success: true, data: comments });
    });
});

router.get('/dummy', (req, res) => {
        return res.json({ success: true, data: [] });
});

router.get('/read', (req, res) => {
    Comment.find((err, comments) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: comments });
    }).limit(20);
    // var data = Comment.count((err, comments) => {
    //     return res.json({ success: true, data: comments });
    // });
});

router.post('/add', (req, res) => {
    const comment = new Comment();
    // body parser lets us use the req.body
    const { author, text } = req.body;
    if (!author || !text) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'You must provide an author and comment'
        });
    }
    comment.author = author;
    comment.text = text;
    comment.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.put('/edit/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.findById(commentId, (error, comment) => {
        if (error) return res.json({ success: false, error });
        const { author, text } = req.body;
        if (author) comment.author = author;
        if (text) comment.text = text;
        comment.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});

router.delete('/delete/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.remove({ _id: commentId }, (error, comment) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;