const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const User = require("../models/User");
const verifyToken = require("../middlewares/jwt");
const { default: mongoose } = require("mongoose");

router.post("/addNote", verifyToken, async (req, res) => {
  try {
    const id = req.id;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "no user" });
    }

    const { title, description, tag } = req.body;
    const note = new Notes({
      owner: id,
      title,
      description,
      tag,
    });
    note.save();

    res.json({ success: true });
  } catch (error) {
    console.log("error while creating user", error);
    return res.status(500).json({ success: false, message: error });
  }
});

router.get("/notes", verifyToken, async (req, res) => {
  try {
    const id = req.id;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "no user" });
    }

    const allNotes = await Notes.find({ owner: id });

    res.status(200).json({ message: "token", data: allNotes });
  } catch (error) {
    console.log("error while creating user", error);
    return res.status(500).json({ message: error });
  }
});

router.put("/notes/:id", verifyToken, async (req, res) => {
  try {
    const id = req.id;
    const noteId = req.params.id;
    const { title, description, tag } = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "no user" });
    }

    const notes = await Notes.findById(noteId);

    if (notes.owner.toString() !== id) {
      return res.status(400).json({ success: false, message: "not access" });
    }

    const filter = {};
    if (title) {
      filter.title = title;
    }
    if (description) {
      filter.description = description;
    }
    if (tag) {
      filter.tag = tag;
    }
    const newNotes = await Notes.findByIdAndUpdate(noteId, filter);
    res.json({ message: " hello" });
  } catch (error) {
    console.log("error while creating user", error);
    return res.status(500).json({ message: error });
  }
});

router.delete("/notes/:id", verifyToken, async (req, res) => {
  try {
    const id = req.id;
    const noteId = req.params.id;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "no user" });
    }

    const notes = await Notes.findById(noteId);

    if (notes.owner.toString() !== id) {
      return res.status(400).json({ success: false, message: "not access" });
    }

    const newNotes = await Notes.findByIdAndDelete(noteId);
    res.status(200).json({ message: "token" });
  } catch (error) {
    console.log("error while creating user", error);
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
