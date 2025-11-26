import amqplib from "amqplib";

export default async function publishNotification(
  userId,
  author,
  reviewId,
  type = ""
) {
  const connection = await amqplib.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  const queue = "notification";

  await channel.assertQueue(queue, { durable: true });
  try {
    const message = {
      senderId: userId, // Who performed the action (like/disliked)
      receiverId: author, // Who should get the notification
      entityId: reviewId, // The object the action happened on (review, post, comment, etc.)
      type, // What kind of event it is ("review_created", "comment_liked", etc.)
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(" [x] Sent review message:", message);
  } catch (error) {
    console.log(error);
  } finally {
    if (channel) await channel.close().catch(console.error);
    if (connection) await connection.close().catch(console.error);
  }
}
