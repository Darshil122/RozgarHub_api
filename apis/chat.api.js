const chatService = require("../services/chat.service");
async function getMyGroups(req, res) {
  try {
    const userId = req.user.id;
    const groups = await chatService.getMyGroups(userId);
    res.status(200).json({ groups: groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMessages(req, res) {
  try {
    const { groupId } = req.params;
    const message = await chatService.getMessages(groupId);
    res.status(200).json({ messages: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getGroupDetails(req, res) {
  try {
    const groupId = req.params.groupId;

    const groupDetails = await chatService.getGroupDetails(groupId);
    res.status(200).json({ groupDetails: groupDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getMyGroups, getMessages, getGroupDetails };
