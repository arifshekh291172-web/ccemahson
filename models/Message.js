const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    ticketId: String,
    sender: {
        type: String,
        enum: ["user", "ai", "admin"]
    },
    message: String
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
