import Database from "better-sqlite3";

const db = new Database("./db/likes.db");

try {
  // Likes/Dislikes table
  db.prepare(
    `
          CREATE TABLE IF NOT EXISTS reviewLikes (
            likeId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            reviewId INTEGER NOT NULL,
            isLike BOOLEAN NOT NULL, -- true = like, false = dislike
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(userId, reviewId)
          )
        `
  ).run();

  // To reset the table during development
  //   db.exec("DROP TABLE IF EXISTS reviewLikes");
} catch (error) {
  console.log("Error creating likes table:", error);
}

export default db;
