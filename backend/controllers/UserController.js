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

module.exports = { saveUser };