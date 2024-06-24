import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who receives the notification
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who receives the notification
    type: { type: String, enum: ['like', 'comment', 'friend_request'] }, // Type of notification (e.g., 'like', 'comment', 'friend_request')
    content: { type: String }, // Content of the notification
    read: { type: Boolean, default: false }, // If the notification has been read
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the notification was created
    relatedEntity: { type: Schema.Types.ObjectId, refPath: 'entityModel' }, // ID of related entity (e.g., post, comment)
    entityModel: { type: String, enum: ['Post', 'Comment', 'User'] }, // Model of the related entity
});

// Create the Notification model
const notificationModel = mongoose.models.notificationModel || model('Notification', NotificationSchema);

export default notificationModel;