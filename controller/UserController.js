const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const SECRET_KEY="CHATAPP"
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            createdAt: Date.now(),
        });

       
        await newUser.save();
        res.status(201).json({ message: 'User saved successfully' });
    } catch (error) {
        console.error('Error signing up user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

     
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }

      
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            SECRET_KEY,
            { expiresIn: '1hr' }
        );

      
        res.json({ token });
    } catch (error) {
        console.error('Error signing in', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
};

const getdetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId, 'name email');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const fetchallusers= async (req, res) => {
    console.log(req)
    try {
   
      const { search } = req.query;
      console.log (search)
  
      let users;
  
     
 
   if (search) {
       
    users = await User.find({ name: { $regex: search, $options: 'i' } });
    console.log(users)
    
  } else {
   users  = await User.find();
  }
  users=users.filter((user)=>String(user._id)!==String(req.user._id))
   res.send(users)
      
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

module.exports = { signup, login, getdetails ,fetchallusers};
