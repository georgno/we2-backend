const express = require('express');
const ForumService = require('./ForumService.js');
const router = express.Router();
const auth = require('../../middleware/authentication')

router.get('/' , (req, res) => {
    ForumService.getForums(function(err,forums) {
        if(forums) {
            res.status(200).json(forums);
        } else {
            res.status(404).send("Problems retrieving forums");           
        }
    });
});

router.post('/', auth.isAuthenticated, async (req, res) => {
    ForumService.createForum(req.headers, req.body, function(err,forum) {
        if(err) {
            res.status(404).json(forum);
            console.log(err);
        } else {
            res.status(200).json(forum);
            console.log("Forum created");
        }
    });
});

router.put('/', auth.isAuthenticated, async (req, res) => {
    ForumService.updateForum(req.body, (err, forum) => {
        if(err) {
            res.status(404).json(err);
            console.log(err);
        } else {
            res.status(200).json(forum);
            console.log("Forum updated");
        }
    });
});

// FORUMS FROM USER - ADMIN ONLY
router.post('/getByOwnerID', auth.isAuthenticated, (req, res) => {
    ForumService.getForumsByUserID(req.body, (err,forum) => {
        if(err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(forum);
        }
    })
});

// GET OWN FORUMS
router.get('/getByOwnerID', (req, res) => {
    ForumService.getOwnForums(req.headers, (err,forum) => {
        if(err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(forum);
        }
    })
});

router.delete('/', auth.isAuthenticated, async (req, res) => {
    ForumService.deleteForum(req.body, (err, forum) => {
        if(err) {
            res.status(200).json(forum);
            console.log(err);
        } else {
            res.status(404).json("Forum doesn't exist");
            console.log("Forum not deleted. Forum doesn't exist");
        }
    })
})

module.exports = router;