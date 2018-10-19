const express = require('express');
const Movies = require('../Models/Movies');
const User = require('../Models/User');
const Category = require('../Models/Category');
const People = require('../Models/People');
const Genres = require('../Models/Genres');
const Language = require('../Models/Language');
const Episodes = require('../Models/Episodes');
const jwt = require('jsonwebtoken');
const cmd = require('node-cmd');
const global = require('../global');
const router = express.Router();
const crypto = require('crypto');
var user = "HuyVu";

router.post('/register?', async function (req, res, next) {
    const {name, email, password} = req.body;
    let data = {
        email, password, name
    };
    let pass = await global.verifySHA256(password);
    try {
        User.signUp(name, email, pass).then((e) => {
            if (e.success) {
                return res.status(200).json({
                    success: e.success,
                    data,
                    result: e.data,
                    message: e.message,
                });
            } else {
                return res.status(200).json({
                    success: e.success,
                    data,
                    result: e.data,
                    message: e.message,
                });
            }
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e.sqlMessage,
        });
    }
});
router.post('/login?', async function (req, res, next) {
    const {email, password} = req.body;
    let data = {
        email, password
    };
    let token = await global.createToken(data);
    let pass = await global.verifySHA256(password);
    try {
        User.signIn(email, pass).then((e) => {
            if (e.success) {
                return res.status(200).json({
                    success: e.success,
                    data,
                    result: e.data,
                    token,
                    message: e.message,
                });
            } else {
                return res.status(200).json({
                    success: e.success,
                    data,
                    result: e.data,
                    token: [],
                    message: e.message,
                });
            }
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e.sqlMessage,
        });
    }
});
router.put('/updateInfo?', async function (req, res, next) {
    const {name, url, phone, sex, email, password, type, id} = req.body;
    let data = {
        name, url, phone, sex, email, password, type, id
    };
    let pass = await global.verifySHA256(password);
    try {
        User.updateInfo(name, url, phone, sex, email, pass, type, id).then((e) => {
            return res.status(200).json({
                success: e.success,
                data,
                result: e.data,
                message: e.message,
            });
        });
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: e.sqlMessage,
        });
    }
});
module.exports = router;