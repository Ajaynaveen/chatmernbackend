
const Chat = require("../models/Chat");
const User = require("../models/User");



const findOrCreateChat = async (req, res) => {
  const { userID } = req.body;
  const currentUserID = req.user._id;

 

  try {
    
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userID, currentUserID] }
    });

    if (existingChat) {
      res.status(200).json({ chatId: existingChat._id });
    } else {
      const newChat = await Chat.create({
        users: [userID, currentUserID],
        isGroupChat: false,
       
      });

      res.status(201).json({ chatId: newChat._id });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



  const fetchchat = (async (req, res) => {
      try {
       
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
         
          
          .populate("latestMessage")
          .populate("isGroupChat")
          .populate("groupAdmin")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, [{
              path: "latestMessage.sender",
              select: "name email",
            },
            {
              path: "latestMessage.receiver",
              select: "name email",
            }],);
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    });
    



    const createGroup=(async(req,res)=>{
      const{groupname}=req.body
      const groupadmin=req.user.Id
      try{
        const existinggroup = await Chat.findOne({ chatName: groupname });
        if(existinggroup){
          res.status(401).json({error:"group name already exit"})
        }

   
 
        let group=new Chat({
          chatName:groupname,
          users:[req.user._id],
          isGroupChat:true,
         

          groupAdmin:req.user._id


        })
await group.save();
        res.json(group)

      }catch(error){
        console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });

      }

    })

   



const addUserstogroup= async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.user._id)
    const  userIdToAdd  = req.user._id;

   
    const group = await Chat.findById(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

  
    if (group.users.includes(userIdToAdd)) {
      return res.status(400).json({ error: 'User is already in the group' });
    }

    group.users.push(userIdToAdd);

  
    const updatedGroup = await group.save();

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error adding user to array:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeusers = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.user._id);
    const userIdToRemove = req.user._id;

    const group = await Chat.findByIdAndUpdate(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    // console.log(group)

    
    const updatedUsers = group.users.filter((userId) => JSON.stringify(userId._id) !== JSON.stringify(userIdToRemove));
    console.log(updatedUsers)

    group.users = updatedUsers;

    const updatedGroup = await group.save();

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error removing user from array:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletegroup=async(req,res)=>{
try {
  const { id } = req.params;

  console.log('Group ID to delete:', id);

  const deletedGroup = await Chat.findByIdAndDelete(id);
  console.log('Deleted Group:', deletedGroup);

  if (!deletedGroup) {
    return res.status(404).json({ error: 'Group not found' });
  }

  res.status(200).json({ message: 'Group deleted successfully' });
} catch (error) {
  console.error('Error deleting group:', error);
  res.status(500).json({ error: 'Internal server error' });
}}



    const fetchGroups = async (req, res) => {
      try {
        const groups = await Chat.find({ isGroupChat: true });
        res.json(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    



module.exports = {
  findOrCreateChat,fetchchat,createGroup,fetchGroups,addUserstogroup,removeusers,deletegroup,
};