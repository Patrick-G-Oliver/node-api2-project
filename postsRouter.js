const express = require('express')
const postsData = require('./seed/01-posts')
const database = require('./db')

const router = express.Router()

router.get('/api/posts', (req, res) => {
    database.find()
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})