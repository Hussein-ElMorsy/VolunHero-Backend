import notificationModel from "../../DB/models/Notification.model.js"


export const createNotification = async ({ user, sender, type, content, relatedEntity, entityModel } = {}) => {

    if (!user.equals(sender)) {
        const notification = new notificationModel({
            user: user,
            sender: sender,
            type: type,
            content: content,
            relatedEntity: relatedEntity,
            entityModel: entityModel,
        });

        await notification.save();
    }

    return true;
}


export const deleteNotification = async ({ relatedEntity = null, type, user = null, sender = null } = {}) => {

    if (user && sender) {
        const deleteNotification = await notificationModel.findOneAndDelete({ type, user, sender });
        if (!deleteNotification)
            return false
    }
    else {
        const deleteNotification = await notificationModel.findOneAndDelete({ relatedEntity, type });
        if (!deleteNotification)
            return false
    }

    return true;
}



