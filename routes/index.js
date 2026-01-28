var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    const filePath = path.join(__dirname, '../data/data.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Gagal membaca data');
        }

        const users = JSON.parse(data);

        res.render('index', {
            title: 'Data users',
            users
        })
    })

});

router.get('/add', function(req, res, next) {
    res.render('form/view');
});


module.exports = router;