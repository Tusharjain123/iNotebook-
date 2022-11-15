const express = require("express");
const fetchUser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/Note.jsx");
const { body, validationResult } = require("express-validator");

//  Route to get all the notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Servor Error");
  }
});

//  Route to add a new note
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", `Password must be atleast 5 characters`).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      try {
        
      // If there are error then respond status = 404
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Servor Error");
    }
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Servor Error");
  }
  });

// route for update an existing note put is used to update
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {}; 
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    
    //   Find the note to be update
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("NotFound");
    }
    // obj.toString is used to get the source code of the obj here it will give id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    
    // new true for if new note comes then it will add the note
    // $set is used to set the value
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
      )
      res.send(note)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Servor Error");
  }
});


// route for deleting an existing note delete is used to update
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
  //   Find the note to be deleted
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("NotFound");
  }
  // obj.toString is used to get the source code of the obj here it will give id
//   Allow deletion if it verified successfully
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  // new true for if new note comes then it will add the note
  // $set is used to set the value
  note = await Notes.findByIdAndDelete(req.params.id);
    // Here we have added note it is optional like when we delete something some note will come out
    res.json({"Success": "Note has been deleted", note: note})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Servor Error");
  }
});

module.exports = router;
