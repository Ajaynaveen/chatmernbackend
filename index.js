

const mongoose = require('mongoose');
const app = require('./app'); // Importing the app instance


const url = 'mongodb+srv://ajaysnaviee:ajaysnaviee@cluster0.jvsps7g.mongodb.net/chat?retryWrites=true&w=majority';
const port = 3030;



mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
