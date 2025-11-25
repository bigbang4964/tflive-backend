// routes/liveTikTok.js
const express = require("express");
const router = express.Router();
const TikTokLive = require("tiktok-live-connector").default;

const activeSessions = {}; // giữ kết nối cho nhiều room
let commentsStore = {};

router.get("/tiktok/:roomId", async (req, res) => {
    const roomId = req.params.roomId;

    if (!roomId) {
        return res.status(400).json({ error: "Missing roomId" });
    }

    // Kiểm tra có session chưa
    if (activeSessions[roomId]) {
        return res.json({ message: "Already connected", roomId });
    }

    // Tạo client Webcast
    const client = new TikTokLive(roomId, {
        enableExtendedGiftInfo: true,
        requestPollingInterval: 1000,
    });

    activeSessions[roomId] = client;

    // Listen events
    client.on("chat", (data) => {
        if (!commentsStore[roomId]) commentsStore[roomId] = [];

        commentsStore[roomId].push({
            commentId: data.msgId,
            userId: data.uniqueId,
            name: data.nickname,
            text: data.comment,
            avatar: data.profilePictureUrl,
            timestamp: Date.now(),
        });

        // giữ tối đa 200 comment
        if (commentsStore[roomId].length > 200) {
            commentsStore[roomId].shift();
        }
    });

    client.on("gift", (data) => {
        console.log(`[GIFT] ${data.uniqueId} sent ${data.giftName}`);
    });

    client.on("like", (data) => {
        console.log(`[LIKE] ${data.uniqueId} sent like`);
    });

    client.on("streamEnd", () => {
        console.log("LIVE END");
        delete activeSessions[roomId];
    });

    try {
        await client.connect();
        console.log("Connected to TikTok LIVE:", roomId);
        return res.json({ message: "connected", roomId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/tiktok/:roomId/comments", (req, res) => {
    const roomId = req.params.roomId;
    return res.json(commentsStore[roomId] || []);
});

module.exports = router;
