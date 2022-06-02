const express = require('express');
const ForumMessageService = require('./ForumMessageService.js');
const router = express.Router();
const auth = require('../../middleware/authentication')

router.get('/' , (req, res) => {
    ForumMessageService.getForumMessages(function(err,messages) {
        if(messages) {
            res.status(200).json(messages);
        } else {
            res.status(404).send("Problems retrieving forummessages");           
        }
    });
});

router.post('/', auth.isAuthenticated, async (req, res) => {
    ForumMessageService.createForumMessage(req.headers, req.body, function(err,message) {
        if(err) {
            res.status(404).json(message);
            console.log(err);
        } else {
            res.status(200).json(message);
            console.log("Message created");
        }
    });
});

router.put('/', auth.isAuthenticated, async (req, res) => {
    ForumMessageService.updateForumMessage(req.body, (err, message) => {
        if(err) {
            res.status(404).json(err);
            console.log(err);
        } else {
            res.status(200).json(message);
            console.log("Message updated");
        }
    });
});

// MESSAGES IN FORUM
router.post('/getByForumID', (req, res) => {
    ForumMessageService.getForumMessagesByForumID(req.body, (err,messages) => {
        if (err) {
            res.status(404).json(err);
            console.log(err);
        } else {
            res.status(200).json(messages);
            console.log("Messages found");
        }
    })
})

// MESSAGES FROM USER
router.post('/getByAuthorID', (req, res) => {
    ForumMessageService.getForumMessagesByAuthorID(req.body, (err,messages) => {
        if(err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(messages);
        }
    })
});

router.delete('/', auth.isAuthenticated, async (req, res) => {
    ForumMessageService.deleteForumMessage(req.body, (err, message) => {
        if(err) {
            res.status(200).json(message);
            console.log(err);
        } else {
            res.status(404).json("Message doesn't exist");
            console.log("Message not deleted. Message doesn't exist");
        }
    })
})

module.exports = router;