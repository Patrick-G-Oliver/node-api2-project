const express = require("express")
const postsRouter = require("./posts/posts-router")

const server = express()
const port = 5000

server.use(express.json())
server.use(postsRouter)

server.get("/api/posts", (req, res) => {
    posts.find()
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

/* When the client makes a GET request to /api/posts:

If there's an error in retrieving the posts from the database:
cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The posts information could not be retrieved." }.
*/

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})