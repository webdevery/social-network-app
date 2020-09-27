const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  from: { type: Types.ObjectId, ref: "User" },
  dialogId: { type: Types.ObjectId, ref: "Dialog" },
  readed: { type: Boolean, default: false, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = model("Message", schema);
