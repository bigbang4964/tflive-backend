import express from "express";
import TikTokLive from "tiktok-live-connector";

const router = express.Router();
const activeSessions = {};
let commentsStore = {};

router.get("/tiktok/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    if (!roomId) return res.status(400).json({ error: "Missing roomId" });

    if (activeSessions[roomId]) {
        return res.json({ message: "Already connected", roomId });
    }

    const client = new TikTokLive(roomId, {
        enableExtendedGiftInfo: true,
        requestPollingInterval: 1000,
    });

    activeSessions[roomId] = client;

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

        if (commentsStore[roomId].length > 200) {
            commentsStore[roomId].shift();
        }
    });

    client.on("streamEnd", () => {
        delete activeSessions[roomId];
    });

    try {
        await client.connect();
        return res.json({ message: "connected", roomId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/tiktok/:roomId/comments", (req, res) => {
    const roomId = req.params.roomId;
    res.json(commentsStore[roomId] || []);
});

export default router;
