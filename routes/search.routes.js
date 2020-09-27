const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    let users = await User.find();
    users = users
      .filter(person => (person._id != userId ? person : false))
      .map(person => {
        let { email, firstName, lastName, _id } = person;
        return { email, firstName, lastName, isFriend: user.friends.length > 0 && user.friends.indexOf(_id) != -1 };
      });

    if (users) return res.json({ users: users });
    return res.status(400).json({ message: "Нет информации для вывода" });
  } catch (e) {
    return res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
