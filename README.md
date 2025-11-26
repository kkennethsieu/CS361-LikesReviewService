# Like/Dislike Review Service

## Overview

The Likes Service is a RESTful API microservice that handles liking, unliking, disliking, and undisliking reviews.

**Base URL**: `http://localhost:7060`

## Running the Service

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Or run normally
node index.js
```

The service will start on `http://localhost:7060` by default.

## Notes

- RabbitMQ Needs to be running for the notifications service to work with likes microservice.

---

## API Endpoints

### 1. Get total reactions for a review

**Endpoint**: `POST /likes/review/:reviewId`

**Description**: Gets the total likes and dislikes for a certain review

**Example Request**:

```javascript
const response = await fetch(`http://localhost:7060/likes/review/${reviewId}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log(data);
```

**Example Response** (201 Created):

```json
{
  "totalLikes": 123,
  "totalDislikes": 123
}
```

**Response Details**:

- Grabs all the total likes and dislikes for a certain review

**Error Response** (400 Bad Request):

```json
{
  "message": "Review not found"
}
```

---

### 2. Liking or removing a like if already liked from a review

**Endpoint**: `POST /likes/like/:userId/:reviewId`

**Description**: Allows a user to like a review, or unlike a review if they already liked it.

**Example Request**:

```javascript
const response = await fetch(`http://localhost:7060/likes/likes/${19}/${3}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log(data);
```

**Important**: After the review is liked, the item gets sent to a messsage broker that is then received by the notifications microservice.

---

### 3. Disliking or removing a dislike if already disliked from a review

**Endpoint**: `POST /likes/dislike/:userId/:reviewId`

**Description**: Allows a user to dislike a review, or undislike a review if they already disliked it.

**Example Request**:

```javascript
const response = await fetch(
  `http://localhost:7060/likes/dislikes/${19}/${3}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
console.log(data);
```

**Important**: After the review is disliked, the item gets sent to a messsage broker that is then received by the notifications microservice.

---

## Data Model

### Likes Object

| Field       | Type      | Description                                         |
| ----------- | --------- | --------------------------------------------------- |
| `likeId`    | integer   | Unique like identifier (auto-increment primary key) |
| `userId`    | integer   | Unique user identifier (required)                   |
| `reviewId`  | integer   | Unique review identifier                            |
| `isLike`    | boolean   | 0 = False, 1 = True                                 |
| `createdAt` | timestamp | Account creation timestamp (auto-generated)         |
