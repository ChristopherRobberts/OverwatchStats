const express = require('express');
const router = express.Router();
const db = require('../Integration/dataBaseHandler');

router.get('/', (req, res) => {
    res.send("hello");
});

router.post('/createUser', (req, res) => {
    const {
        userName,
        password
    } = req.body;

    db.createUser(userName, password, (result) => {
        res.send(result);
    });
});

router.post('/logIn', (req, res) => {
    const {
        userName,
        password
    } = req.body;

    db.getUserInfo(userName, password, (result) => {
        if (result.length === 0) {
            res.send("username or password incorrect");
            return;
        }
        if (password === result[0].password) {
            req.session.userName = userName;
            res.send("Log in successful");
        } else {
            res.send('/');
        }
    })
});

module.exports = router;