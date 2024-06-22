const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;
