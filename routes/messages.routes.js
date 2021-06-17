const express = require("express");
const router = express.Router();

const Messages = require("../api/messages");

let messages = Messages.messages;

router.post("/mensajes/guardar", (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.email ||
      req.body.email === "" ||
      !req.body.message ||
      req.body.message === ""
    ) {
      return res.json({
        messages,
      });
    }

    messages.push(req.body);

    Messages.save();

    const io = req.app.get("io");
    io.emit("messages", messages);

    return res.json(messages);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

router.get("/mensajes/leer", async (req, res) => {
  try {
    const messages = await Messages.get();

    return res.json(messages);
  } catch (error) {
    return res.json([]);
  }
});

module.exports = router;
