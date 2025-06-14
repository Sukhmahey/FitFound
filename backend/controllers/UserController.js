User = require('../models/UserModel');

const saveUser = (req, res) => {
    let newUser = new User(req.body);
    
    newUser.save()
    .then( user => {
        res.status(201).json({ userId: user._id, email: user.email, role: user.role });
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
            return res.status(200).json({ userId: null, message: 'User no found' });
        }
        res.status(200).json({ userId: user._id, email: user.email, role: user.role });
    })
    .catch(error => {
        res.status(500).json(error);
    });
};

module.exports = { saveUser, getUserByEmail };