const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
  getActors,
} = require("../controllers/actor");
const { uploadImage } = require("../utils/multer");
const { actorInfoValidator, validate, isAuth, isAdmin } = require("../utils/auth");

const router = express.Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", isAuth, isAdmin, removeActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", getLatestActors);
router.get("/actors", isAuth, isAdmin, getActors);
router.get("/single/:id", getSingleActor);

module.exports = router;