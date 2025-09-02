const express = require("express");
const {
  getMiniatures,
  addMiniature,
  updateMiniature,
  deleteMiniature,
} = require("../controllers/miniaturesController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes 
router.get("/", auth, getMiniatures); // list minis for user
router.post("/", auth, addMiniature); // create mini
router.patch("/:id", auth, updateMiniature); // update mini
router.delete("/:id", auth, deleteMiniature); // delete mini

module.exports = router;