const Messages = require("../models/messageModel");

// module.exports.getMessages = async (req, res, next) => {
//   try {
//     const { from, to } = req.body;

//     const messages = await Messages.find({
//       users: {
//         $all: [from, to],
//       },
//     }).sort({ updatedAt: 1 });

//     const projectedMessages = messages.map((msg) => {
//       return {
//         fromSelf: msg.sender.toString() === from,
//         message: msg.message.text,
//       };
//     });
//     res.json(projectedMessages);
//   } catch (ex) {
//     next(ex);
//   }
// };

// controllers/messageController.js
module.exports.getMessages = async (req, res) => {
  const { from, to } = req.body;
  try {
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};
// module.exports.addMessage = async (req, res, next) => {
//   try {
//     const { from, to, message } = req.body;
//     const data = await Messages.create({
//       message: { text: message },
//       users: [from, to],
//       sender: from,
//     });

//     if (data) return res.json({ msg: "Message added successfully." });
//     else return res.json({ msg: "Failed to add message to the database" });
//   } catch (ex) {
//     next(ex);
//   }
// };

// controllers/messageController.js


// controllers/messageController.js
module.exports.addMessage = async (req, res) => {
  const { from, to, message } = req.body;
  try {
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};