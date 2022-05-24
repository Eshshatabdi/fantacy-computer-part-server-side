const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.auif7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('manuFacturer').collection('service');
        const orderCollection = client.db('manuFacturer').collection('order');
        const reviewCollection = client.db('manuFacturer').collection('review');


        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const parts = await serviceCollection.findOne(query);
            res.send(parts);
        })


        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateItem.newQuantity
                },

            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result)


        })



        app.post('/service', async (req, res) => {
            const newItem = req.body;
            const result = await serviceCollection.insertOne(newItem);
            res.send(result);
        })



        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })


        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.post('/review', async (req, res) => {
            const newItem = req.body;
            const result = await serviceCollection.insertOne(newItem);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.dir)







app.get('/', (req, res) => {
    res.send('Running Manufacture server')
})

app.listen(port, () => {
    console.log('server is running', port)
})