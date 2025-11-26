import db from "../db/db.js";
import { getAuthorId } from "../services/likesService.js";
import publishNotification from "../services/notificationService.js";
export const getReactionsByReview = (req, res) => {
  const { reviewId } = req.params;

  const likes = db
    .prepare(
      "SELECT COUNT(*) AS totalLikes FROM reviewLikes WHERE reviewId = ? AND isLike = 1"
    )
    .get(reviewId);

  const dislikes = db
    .prepare(
      "SELECT COUNT(*) AS totalDislikes FROM reviewLikes WHERE reviewId = ? AND isLike = 0"
    )
    .get(reviewId);

  return res.status(200).json({
    likes: likes.totalLikes || 0,
    dislikes: dislikes.totalDislikes || 0,
  });
};

export const likeReview = async (req, res) => {
  const { userId, reviewId } = req.params;

  const stmt = db.prepare(
    "SELECT isLike FROM reviewLikes WHERE userId = ? and reviewId = ?"
  );

  const existing = stmt.get(userId, reviewId);

  if (existing && existing.isLike === 1) {
    db.prepare("DELETE FROM reviewLikes WHERE userId = ? and reviewId = ?").run(
      userId,
      reviewId
    );
    return res.status(200).json({ message: "Removed like" });
  } else if (existing && existing.isLike === 0) {
    db.prepare(
      "UPDATE reviewLikes SET isLike = 1 WHERE userId = ? and reviewId = ?"
    ).run(userId, reviewId);
    return res.status(200).json({ message: "Switched dislike → like" });
  } else {
    db.prepare(
      "INSERT INTO reviewLikes (userId, reviewId, isLike) VALUES (?,?,1)"
    ).run(userId, reviewId);
    //Sends notification over mq
    const author = await getAuthorId(reviewId);
    console.log(author);
    publishNotification(userId, author, reviewId, "review_liked");
    return res.status(201).json({ message: "Successfully like review" });
  }
};

export const dislikeReview = (req, res) => {
  const { userId, reviewId } = req.params;

  const stmt = db.prepare(
    "SELECT isLike FROM reviewLikes WHERE userId = ? and reviewId = ?"
  );

  const existing = stmt.get(userId, reviewId);

  if (existing && existing.isLike === 0) {
    db.prepare("DELETE FROM reviewLikes WHERE userId = ? and reviewId = ?").run(
      userId,
      reviewId
    );
    return res.status(200).json({ message: "Removed dislike" });
  } else if (existing && existing.isLike === 1) {
    db.prepare(
      "UPDATE reviewLikes SET isLike = 0 WHERE userId = ? and reviewId = ?"
    ).run(userId, reviewId);
    return res.status(200).json({ message: "Switched like → dislike" });
  } else {
    db.prepare(
      "INSERT INTO reviewLikes (userId, reviewId, isLike) VALUES (?,?,0)"
    ).run(userId, reviewId);
    return res.status(201).json({ message: "Successfully disliked review" });
  }
};
