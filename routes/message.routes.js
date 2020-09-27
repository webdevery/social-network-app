const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const Dialog = require("../models/Dialog");
const Message = require("../models/Message");
const User = require("../models/User");
const router = Router();

router.post("/mess", [auth, check("text", "Введите текст сообщения").exists()], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status("400").json({
        errors: errors.array(),
        message: "Ошибка при отправке сообщения"
      });
    }
    const text = req.body.text;
    const userId = req.user.userId;
    const dialogId = req.body.dialogId;

    const dialog = await Dialog.findOne({ _id: dialogId });
    const message = new Message({ text, dialogId, from: userId });
    dialog.messages.push(message._id);
    await message.save();
    await dialog.save();
    const newMess = { text, date: message.date, my: true };

    return res.status(201).json({ newMess, message: "Сообщение отправлено" });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробууйте снова" });
  }
});
router.post("/:dialogId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const dialogId = req.params.dialogId.replace(":", "");
    var messages = await Message.find({ dialogId: dialogId });
    messages = messages.map(item => {
      const { text, date, readed } = item;
      const my = item.from == userId;
      return { text, date, my, readed };
    });
    return res.json({ messages });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробууйте снова" });
  }
});
router.post("/read/:dialogId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const dialogId = req.params.dialogId.replace(":", "");
    const dialog = await Dialog.findOne({ _id: dialogId });
    const friendId = dialog.members.filter(id => (id == userId ? false : id))[0];
    const _messages = await Message.find({ dialogId, from: friendId });
    var needUpdate = false;

    await _messages.forEach(async item => {
      if (!item.readed) needUpdate = true;
      const message = await Message.findById(item._id);
      message.readed = true;
      await message.save();
    });
    return res.json({ needUpdate, message: "Обновление" });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробууйте снова" });
  }
});

module.exports = router;
