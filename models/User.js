const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: Types.ObjectId, ref: "User" }],
  dialogs: [{ type: Types.ObjectId, ref: "Dialog" }]
});

module.exports = model("User", schema);
