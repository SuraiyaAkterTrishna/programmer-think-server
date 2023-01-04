const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nssk480.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const blogCollection = client.db("programmer_think").collection("blogs");
        // Get blogs from database
        app.get("/blogs", async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        });
        // Insert blog from database
        app.post("/blog", async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        });
        // update blog from database
        app.put('/blog/:id', async(req, res) =>{
            const id = req.params.id;
            const updateBlog = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true};
            const updateDoc = {
                $set: {
                    title: updateBlog.title,
                    image: updateBlog.image,
                    description: updateBlog.description,
                    author: updateBlog.author,
                    date: updateBlog.date,
                    tags: updateBlog.tags
                }
            };
            const result = await blogCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        // Delete blog from database by id
        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        });
    } finally {

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello From Programmer Think backend!");
});

app.listen(port, () => {
    console.log(`Programmer Think App is running on port, ${port}`);
});
