const mongoDB = require('mongodb');
const mongoClient = mongoDB.MongoClient;
const util = require('util');

const dataBase = {
    url: "mongodb://localhost:27017/mytest",
    name: "overwatchstats",
    parserOption: {useNewUrlParser: true}
};

module.exports = {

    createUser: (un, pw, fn) => {
        const results = [];

        mongoClient.connect(dataBase.url, dataBase.parserOption, (err, db) => {
            if (err) throw err;
            const cursor = db
                .db(dataBase.name)
                .collection('users')
                .find({userName: un});
            cursor.forEach((doc) => {
                results.push(doc);
            }, () => {
                if (results.length) {
                    fn("username taken");
                    return;
                }

                db
                    .db(dataBase.name)
                    .collection('users')
                    .insertOne(
                        {
                            userName: un,
                            password: pw,
                            gameData: []
                        }, (err, db) => {
                            (err) ? fn(err) : fn("user created");
                        })
            });
        })
    },

    getUserInfo: (un, pw, fn) => {
        const results = [];
        mongoClient.connect(dataBase.url, dataBase.parserOption, (err, db) => {
            const cursor = db
                .db(dataBase.name)
                .collection('users')
                .find({userName: un});
            cursor.forEach((doc) => {
                results.push(doc);
            }, () => {
                fn(results);
            });
        })
    },

    newGameData: (un, hero, map, outcome, sr, date, fn) => {
        mongoClient.connect(dataBase.url, dataBase.parserOption, (err, db) => {
            db
                .db(dataBase.name)
                .collection('users')
                .updateOne({userName: un}, {
                    $push:
                        {
                            gameData:
                                {
                                    date: date,
                                    hero: hero,
                                    outcome: outcome,
                                    map: map,
                                    sr: sr
                                }
                        }
                }, (err, db) => {
                    (err) ? fn(err) : fn("success");
                });
        });
    }
};

