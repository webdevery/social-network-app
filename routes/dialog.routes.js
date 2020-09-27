const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const Dialog = require("../models/Dialog");
const Message = require("../models/Message");
const User = require("../models/User");
const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });

    let dialogs = [];
    const getNext = async function*() {
      for (id of user.dialogs) {
        const dialog = await Dialog.findOne({ _id: id });
        if (!dialog) {
          user.dialogs.splice(user.dialogs.indexOf(id), 1);
          continue;
        }
        const friendId = dialog.members.filter(id => (id === userId ? false : id))[0];
        const friend = await User.findOne({ _id: friendId });
        const fullName = `${friend.firstName} ${friend.lastName}`;
        const count = dialog.messages.length;
        const mess = await Message.findOne({ _id: dialog.messages.pop() });
        const _dialog = { fullName, message: mess?.text, id, count };
        yield _dialog;
      }
    };
    for await (dialog of getNext()) {
      dialogs.push(dialog);
    }
    await user.save();
    if (dialogs.length === 0) {
      return res.json({ dialogs, message: "Диалогов нет" });
    }
    return res.json({ dialogs });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробууйте снова" });
  }
});
router.post("/findOne/:email", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendEmail = req.params.email.replace(":", "");
    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ email: friendEmail });

    const dialog1 = await Dialog.findOne({ members: [friend._id, userId] });
    const dialog2 = await Dialog.findOne({ members: [userId, friend._id] });

    if (!dialog1 && !dialog2) {
      const newDialog = new Dialog({ members: [userId, friend._id] });
      user.dialogs.push(newDialog._id);
      friend.dialogs.push(newDialog._id);
      await newDialog.save();
      await user.save();
      await friend.save();
      return res.json({ dialogId: newDialog._id, message: "Новый диалог создан" });
    }

    return res.json({ dialogId: dialog1?._id || dialog2?._id });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробууйте снова" });
  }
});

module.exports = router;
