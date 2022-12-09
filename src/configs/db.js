const { MongoClient, ServerApiVersion } = require("mongodb")

const uri = "mongodb+srv://kulot:Forgotten15@sharedauthcluster.zs5lfl0.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
module.exports = client.connect()