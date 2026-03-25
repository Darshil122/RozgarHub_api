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

async function MarkAsRead(req, res){
  try{
    const id = req.params.id;

    const notification = await notificationService.markAsRead(id);

    return res.status(201).json({result: notification});
    }catch(error){
      return res.status(500).json({message: error.message});
    }
}

async function MarkAllAsRead(req, res){
  try{
    const userId = req.user.id;

    const notification = await notificationService.markAllAsRead(userId);

    return res.status(201).json({result: notification});
  }catch(error){
    return res.status(500).json({message: error.message});
  }
}

module.exports = {
  GetNotification,
  MarkAsRead,
  MarkAllAsRead,
};