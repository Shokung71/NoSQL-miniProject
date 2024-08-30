const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Let\'s Working with NoSQL Databases')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const connectDB = async() => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log(`MongoDB connected successfully.`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

// Read All API
app.get('/smartphone', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('ShokungDB').collection('smartphone').find({}).sort({"model": 1}).toArray(
    );
        await client.close();
        res.status(200).send(users);
    })


// Create API
app.post('/smartphone/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ShokungDB').collection('smartphone').insertOne({
        "brand": object['brand'],
        "model": object['model'],
        "os": object['os'],
        "price": object['price'],
        "support5G": object['support5G'],
        "processorBrand": object['processorBrand'],
        "processorSpeed": object['processorSpeed'],
        "ramCapacity": object['ramCapacity'],
        "internalMemory": object['internalMemory'],
        "screenSize": object['screenSize'],
        "CreatedDate": object['CreatedDate']
    });
    await client.close();
    res.status(200).send({
            "status": "ok",
            "message": "Object is created",
            "object": object['model']
        });
})

app.put('/smartphone/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ShokungDB').collection('smartphone').updateOne({'_id': ObjectId.createFromHexString(id)}, 
    {"$set": {
        "CreatedDate": object['CreatedDate'],
        "brand": object['brand'],
        "model": object['model'],
        "os": object['os'],
        "price": object['price'],
        "support5G": object['support5G'],
        "processorBrand": object['processorBrand'],
        "processorSpeed": object['processorSpeed'],
        "ramCapacity": object['ramCapacity'],
        "internalMemory": object['internalMemory'],
        "screenSize": object['screenSize']
    }});
    await client.close();
    res.status(200).send({
        'status': "ok",
        'message': "Object with ID "+id+" is updated.",
        'object': object
    });
})

app.get('/smartphone/:id', async(req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('ShokungDB').collection('smartphone').findOne({ "_id": ObjectId.createFromHexString(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "ID": id,
        "Complaint": object
    });
})

app.delete('/smartphone/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('ShokungDB').collection('smartphone').deleteOne({"_id": ObjectId.createFromHexString(id)});   //แก้ไขวิธีเขียนเป็นเวอร์ชั่น mongo ล่าสุด
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID"+ id + " is deleted."
    });
})

app.delete('/smartphone/delete/:id', async(req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const result = await client.db('ShokungDB').collection('smartphone').deleteOne({ "_id": new ObjectId(id) });
    await client.close();

    if(result.deletedCount === 1) {
        res.status(200).send({
            "status": "ok",
            "message": "Object with ID " + id + " is deleted."
        });
    } else {
        res.status(404).send({
            "status": "error",
            "message": "Object with ID " + id + " not found."
        });
    }
});

// app.get('/smartphone/field/:searchText', async(req, res) => {
//     const { params } = req;
//     const searchText = params.searchText
//     const client = new MongoClient(uri);
//     await client.connect();
//     const objects = await client.db('ShokungDB').collection('smartphone').find({ $text:{$search:searchText}}).sort({"model":1}).toArray();
//     await client.close();
//     res.status(200).send({
//         "status": "ok",
//         "searchText": searchText,
//         "Complaint": objects
//     });
// })

app.get('/smartphone/field/:searchText', async(req, res) => {
    const { params } = req;
    const searchText = params.searchText;
    const client = new MongoClient(uri);
    await client.connect();

    const regex = new RegExp(searchText, 'i'); // 'i' for case-insensitive search
    const objects = await client.db('ShokungDB').collection('smartphone').find({ $or:[{"model": regex},{"os": regex}] }).sort({"model":1}).toArray();
    
    await client.close();
    res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "Complaint": objects
    });
});

