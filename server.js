//! import 
import Express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./dbMessages.js";
import Pusher from "pusher";
import bodyParser from "body-parser"


//! app config
const app = Express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1468951",
    key: "68be50924cd2fba8a00f",
    secret: "32c7064e0bd1a6d058bc",
    cluster: "ap2",
    useTLS: true
});

const db = mongoose.connection

db.once("open", () => {
    console.log("db is connected by open");
    const msgCollection = db.collection("messagecontents");
    const changestream = msgCollection.watch();

    changestream.on("change", (change) => {
        console.log("a chang occured", change);
        //!---------------------------------------------
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("message", "inserted", messageDetails)
        } else {
            /* ----------------- console.log("error triggring pusher"); ----------------- */
            console.log(err);
            const mes = {
                name: "creater",
                timestamp: new Date().toLocaleTimeString(),
                message: "This is a first message created by creater of this app",
                recieved: true
            }

            Message.create(mes, (req, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("done");
                }
            })

        }
        //!---------------------------------------------
    })
})

//! middleware
app.use(Express.json({ limit: '50mb' }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//!  dbconfig
const connection_url = "mongodb+srv://whatsapp:whatsapp@cluster0.d0haad1.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(connection_url, (err) => {
    if (!err) {
        console.log("database is connected");
    }
})

//! ????

//!api routs 
app.get("/", (req, res) => {
    res.status(200).send("hello world");
})
app.post("/messages/new", (req, res) => {
    const dbMessage = req.body
    Message.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data)
        }
    })
})
app.get("/messages/sync", (req, res) => {
    Message.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data)
        }
    })
})

//! listen
app.listen(port, () => {
    console.log("server is running : " + port);
})