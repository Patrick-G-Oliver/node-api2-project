const express = require('express')
const database = require('../data/db')
// const postsData = require('../data/seeds/01-posts')
// const commentsData = require('../data/seeds/02-comments')

const router = express.Router()
// (1) Add New Post (done)
router.post("/posts", (req, res) => {
    if (req.body.title && req.body.contents) {
        database.insert({
            title: req.body.title,
            contents: req.body.contents
        })
        return res.status(201).json(req.body)
    } else if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        return res.status(500).json({ 
            errorMessage: "There was an error while saving the post to the database."
        })
    }
})

// (2) Add Comments to Post by ID (done)
router.post('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { ...req.body, post_id: id };
    if (!text) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
      } else {
        database.findById(id)
        .then((post) => {
          if (!post.length) {
            res.status(404).json({
              message: 'The post with the specified ID does not exist.',
            });
          } else {
            database.insertComment(comment)
              .then((comment) => {
                database.findCommentById(comment.id)
                .then(comment => {
                  res.status(201).json({comment})
                })
              })
              .catch((error) => {
                res.status(500).json({
                  error:
                    'There was an error while saving the comment to the database',
                });
              });
          }
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
});

// (3) Get Posts (done)
router.get("/posts", (req, res) => {
    database.find()
        .then((posts) => {
            return res.status(200).json(posts)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

// (4) Get a Post by ID (done)
router.get("/posts/:id", (req, res) => {
    database.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

// (5) Get Post Comments by ID (lacking)
router.get("/posts/:id/comments", (req, res) => {
    database.findPostComments(req.params.id)
        .then((comments) => {
            if (post) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

// (6) Delete by ID (done)
router.delete("/posts/:id", (req, res) => {
    database.remove(req.params.id)
        .then((post) => {
            if (post) {
                return res.status(200).json({
                    message: "The post has been removed."
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
            error: "The post could not be removed."
        })
    })
})

// (7) Update Post by ID (incomplete)
router.put("/posts/:id", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } 

    database.update(req.params.id, req.body)
        .then((post) => {
            if (post) {
                res.status(200).json(req.body)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "The post information could not be modified."
			})
		})
})

module.exports = router