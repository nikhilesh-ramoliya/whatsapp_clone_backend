import dbMessages from "../dbMessages.js";

export const newMessage = (req, res) => {
    const dbMessage = req.body
    dbMessages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data)
        }
    })
}

export const syncMessage = (req, res) => {
    dbMessages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data)
        }
    })
}

export const deleteMessage = (req, res) => {
    const id = req.params["id"];
    console.log(id);
    dbMessages.findByIdAndDelete(id, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data)
        }
    })
}