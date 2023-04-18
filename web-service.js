let { MongoClient } = require("mongodb")
let uri = "mongodb://127.0.0.1:27017"
let client = new MongoClient(uri)

let express = require("express")
let path    = require("path")

let app  = express()
let port = 7777

app.use(express.static("www"))
app.use(express.json())

app.listen(port, function() {
    console.log(`Full-stack app is listening on port ${port}`)
})

app.get("/helloworld", function (req, res) {
    res.send("Hello World: Evan Dougan!")
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"))
})

app.get("/retrieve", function (req, res) {
    async function run() {
        try {
          await client.connect()
          database = client.db('InventoryDB')
          table = database.collection('InvItems')
          query = {}
          rows = await table.find(query)
          res.send(JSON.stringify(await rows.toArray()))
        } finally {
          await client.close()
        }
      }
      run()
})

app.get("/retrieve-one/:ItemBarcode", function(req, res) {
    async function run() {
        try {
          await client.connect()
          database = client.db('InventoryDB')
          table = database.collection('InvItems')
          query = { ItemBarcode: parseInt(req.params.ItemBarcode) }
          row = await table.findOne(query)
          res.send(JSON.stringify(row))
        } finally {
          await client.close()
        }
      }
      run()
})

app.post("/create", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("InventoryDB")
            table    = database.collection("InvItems")
            record   = {
                ItemBarcode      : parseInt(req.body.ItemBarcode),
                ItemName    : req.body.ItemName,
                ItemAmount     : parseInt(req.body.ItemAmount),
                ItemDesc    : req.body.ItemName
            }
            result = await table.insertOne(record)
//            res.send(JSON.stringify(req.body)) // echo body
        } finally {
            await client.close()
        }
    }
    run()
})

app.delete("/delete/:ItemBarcode", function(req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("InventoryDB")
            table    = database.collection("InvItems")
            query    = { ItemBarcode: parseInt(req.params.ItemBarcode) }
            result   = await table.deleteOne(query)
        } finally {
            await client.close()
        }
    }
    run()
})

app.put("/update", function(req, res) {
    async function run() {
        try {
            await client.connect()
            database  = client.db("InventoryDB")
            table     = database.collection("InvItems")
            where     = {ItemBarcode: parseInt(req.body.ItemBarcode)}
            changes   = {$set:{
                ItemName    : req.body.ItemName,
                ItemAmount     : parseInt(req.body.ItemAmount),
                ItemDesc     : req.body.ItemDesc}}
            result    = await table.updateOne(where, changes)
        } finally {
            await client.close()
        }
    }
    run()
})