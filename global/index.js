const cmd = require("node-cmd");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const global = {
    convertTimeToSecond: function (time) {
        let {h, m, s} = 0;
        time.trim().split(':').map((item, index) => {
            let ParseItem = parseFloat(item);
            switch (index) {
                case 0:
                    h = ParseItem * 3600;
                    break;
                case 1:
                    m = ParseItem * 60;
                    break;
                case 2:
                    s = ParseItem;
                    break;
                default:
                    return null;
            }
        });
        return h + m + s;
    },
    getDuration: function (path) {
        let pathConvert = `ffmpeg -i "` + path + `" 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//`;
        return new Promise(function (resolve, reject) {
            cmd.get(pathConvert, async (err, results, stderr) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(global.convertTimeToSecond(results))
                }
            });
        });
    },
    startStreamming: function (path) {
        return new Promise(function (resolve, reject) {
            cmd.get(`ffmpeg -re -i "` + path + `" -acodec libmp3lame -ac 1 -ar 44100 -s 640x360 -vcodec libx264 -pix_fmt yuv420p -g 60 -vb 425k -profile:v baseline -preset:v faster -r 30 -f flv "rtmp://127.0.0.1:1935/live/streaming live=1 timeout=2"`, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results);
                }
            })
        })
    },
    verifyToken: function (req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers.authorization;
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    },
    verifySHA256: function (text) {
        return crypto.createHash('sha256').update(text).digest("hex");
    },
    createToken: function (data) {
        return jwt.sign(data, 'tvsea');
    },
    convertItemArray: function (array) {
        let newArr = [];
        array.map((item, index) =>{
            newArr.push(item.id);
        });
        return newArr.join(",");
    }
};
module.exports = global;