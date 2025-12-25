const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Message = require("../models/Message");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* CHATGPT */
async function getAIReply(msg) {
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful customer support assistant for a computer institute." },
            { role: "user", content: msg }
        ]
    });
    return res.choices[0].message.content;
}

/* USER MESSAGE */
router.post("/send", async (req, res) => {
    const { ticketId, name, email, message } = req.body;

    let ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
        ticket = await Ticket.create({ ticketId, name, email });
    }

    const userMsg = await Message.create({
        ticketId,
        sender: "user",
        message
    });

    // 🔴 REAL-TIME EMIT TO ADMIN
    global.io.to(ticketId).emit("newMessage", userMsg);

    if (ticket.status === "AI") {
        const aiReply = await getAIReply(message);
        const aiMsg = await Message.create({
            ticketId,
            sender: "ai",
            message: aiReply
        });

        global.io.to(ticketId).emit("newMessage", aiMsg);
    }

    // 🔔 ADMIN NOTIFICATION
    global.io.emit("adminNotify", {
        ticketId,
        name
    });

    res.json({ success: true });
});

/* GET MESSAGES */
router.get("/messages/:ticketId", async (req, res) => {
    const msgs = await Message.find({ ticketId: req.params.ticketId });
    res.json(msgs);
});

/* ADMIN TAKEOVER */
router.put("/takeover/:ticketId", async (req, res) => {
    await Ticket.updateOne(
        { ticketId: req.params.ticketId },
        { status: "ADMIN" }
    );
    res.json({ msg: "Admin takeover enabled" });
});

/* ADMIN REPLY */
router.post("/admin-reply", async (req, res) => {
    const { ticketId, message } = req.body;

    const adminMsg = await Message.create({
        ticketId,
        sender: "admin",
        message
    });

    global.io.to(ticketId).emit("newMessage", adminMsg);

    res.json({ success: true });
});

/* ADMIN TICKETS */
router.get("/tickets", async (req, res) => {
    const tickets = await Ticket.find().sort({ updatedAt: -1 });
    res.json(tickets);
});

module.exports = router;
