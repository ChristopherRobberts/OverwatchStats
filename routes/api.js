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
            req.session.date = new Date();
            res.send("Log in successful");
        } else {
            res.send('/');
        }
    })
});

router.post('/startSession', (req, res) => {
    if (!isLoggedIn(req)) {
        res.redirect('/');
        return;
    }
    res.redirect('/gameData');
});

router.post('/gameData', (req, res) => {
   const {
       mostPlayedHero,
       map,
       outcome,
       SR
   } = req.body;

   db.newGameData(req.session.userName, mostPlayedHero, map, outcome, SR, req.session.date, (result) => {
       res.send(result);
   })
});

const isLoggedIn = (req) => req.session.userName;
module.exports = router;