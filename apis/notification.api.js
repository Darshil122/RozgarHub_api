const notificationService = require('../services/notification.service');

async function GetNotification(req, res){
    try{
        const userId = req.user.id;
        
        const notification =
          await notificationService.getNotifications(userId);
        
        return res.status(200).json({result: notification})
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
  GetNotification,
};