const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const Dialog = require("../models/Dialog");
const User = require("../models/User");
const router = Router();

router.post("/add:email", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendEmail = req.params.email.replace(":", "");

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ email: friendEmail });

    if (user.friends.indexOf(friend._id) != -1)
      return res.json({ message: `${friend.firstName} ${friend.lastName} уже у вас в друзьях` });

    user.friends.push(friend._id);
    await user.save();
    return res.json({ message: `${friend.firstName} ${friend.lastName} добавлен в друзья` });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});
router.post("/remove:email", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendEmail = req.params.email.replace(":", "");

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ email: friendEmail });

    if (user.friends.indexOf(friend._id) === -1)
      return res.json({ message: `Вы не дружите с пользователем ${friend.firstName} ${friend.lastName}` });

    user.friends.splice(user.friends.indexOf(friend._id), 1);
    await user.save();
    return res.json({ message: `${friend.firstName} ${friend.lastName} удален из друзей` });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});
router.post("/list", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });
    const users = await User.find({});
    if (user.friends.length === 0) return res.json({ message: "У вас нет друзей" });

    const friends = users.filter(friend =>
      friend._id != userId ? (user.friends.indexOf(friend._id) != -1 ? friend : false) : false
    );

    return res.json({ friends });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});
router.post("/get:dialogId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const dialogId = req.params.dialogId.replace(":", "");

    const dialog = await Dialog.findOne({ _id: dialogId });
    const friendId = dialog.members.filter(id => (id == userId ? false : id))[0];

    const friend = await User.findOne({ _id: friendId });
    const friendName = `${friend.firstName} ${friend.lastName}`;

    return res.json({ friendName });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
