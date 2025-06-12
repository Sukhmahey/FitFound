User = require('../models/UserModel');

const saveUser = (req, res) => {
    let newUser = new User(req.body);
    
    newUser.save()
    .then(results => {
        res.status(201).json(results);
    })
    .catch(error => {
        res.status(500).json(error);
    });
};

const getUserByEmail = (req, res) => {
    const { email } = req.query;

    User.findOne({ email })
    .then( user => {
        if (!user) {
            return res.status(404).json({ message: 'User no found' });
        }
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(500).json(error);
    });
};

module.exports = { saveUser, getUserByEmail };