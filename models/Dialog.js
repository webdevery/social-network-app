const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  members: [{ type: Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Types.ObjectId, ref: "Message" }],
  date: { type: Date, default: Date.now }
});

module.exports = model("Dialog", schema);
