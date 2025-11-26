import express from "express";
import {
  getReactionsByReview,
  likeReview,
  dislikeReview,
} from "../controllers/controller.js";

const router = express.Router();

//Gets total reactions for a review
router.get("/review/:reviewId", getReactionsByReview);

//Like a review or remove like a review if already liked
router.post("/like/:userId/:reviewId", likeReview);

//Dislike a review or remove dislike if already disliked
router.post("/dislike/:userId/:reviewId", dislikeReview);
export default router;
