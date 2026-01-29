var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/data.json');


/* ======================
   GET LIST DATA
====================== */

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Gagal membaca data');
        }

        let users = [];

        try {
            users = JSON.parse(data);
        } catch (err) {
            return res.status(500).send('Data JSON Rusak')
        }

        // 🔧 AUTO FIX ID (OPS 3)
        let needSave = false;

        users = users.map(user => {
            if (!user.id) {
                user.id = Date.now() + Math.floor(Math.random() * 1000);
                needSave = true;
            }
            return user;
        });

        // kalau ada data yang di-fix → simpan ulang
        if (needSave) {
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        }


        res.render('index', {
            title: 'Data users',
            users
        })
    })

});


/* ======================
   CREATE DATA (SESUAI FORM)
====================== */

router.get('/add', function(req, res, next) {
    res.render('form/view', {
        title: 'added form',
        user: null,
        isEdit: false
    });
});


// CREATE 
router.post('/add', (req, res) => {
    const { name, height, weight, birthdate, married } = req.body;

    // Validasi dasar
    if (!name || !height || !weight || !birthdate || !married) {
        return res.status(400).send('Data tidak lengkap');
    }

    const newUser = {
        id: Date.now(),
        name: name.trim(),
        height: Number(height),
        weight: Number(weight),
        birthdate,
        married: married === '1'
    };

    fs.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {
            return res.status(500).send('Gagal membaca data');
        }

        let users = [];

        try {
            users = JSON.parse(data);
        } catch (err) {
            return res.status(500).send('Format JSON Rusak');
        }

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Gagal menyimpan data');
            }

            res.redirect('/');

        });
    });

})

/* ======================
   EDIT FORM (LOAD DATA)
====================== */

router.get('/edit/:id', (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('gagal membaca data');
        }

        let users = [];

        try {
            users = JSON.parse(data);
        } catch (err) {
            return res.status(500).send('Format JSON Rusak');
        }

        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).send('data tidak ditemukan');
        }


        res.render('form/view', {
            title: 'Edit User',
            user,
            isEdit: true
        });
    });

});

/* ======================
   UPDATE DATA
====================== */

router.post('/edit/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, height, weight, birthdate, married } = req.body;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Gagal membaca data');
        }

        let users = [];

        try {
            users = JSON.parse(data);
        } catch (err) {
            return res.status(500).send('Format JSON Rusak');
        }

        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).send('user tidak ditemukan')
        }

        users[index] = {
            ...users[index],
            name: name.trim(),
            height: Number(height),
            weight: Number(weight),
            birthdate,
            merried: married === '1'
        };

        fs.writeFile(filePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).send('Gagal Menyimpan Data')
            }

            res.redirect('/');
        });
    });
});

/* ======================
   DELETE
====================== */

router.post('/delete/:id', (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Gagal membaca data');

        let users = JSON.parse(data);
        const newUsers = users.filter(u => u.id !== id);

        fs.writeFile(filePath, JSON.stringify(newUsers, null, 2), err => {
            if (err) return res.status(500).send('Gagal menghapus data');
            res.redirect('/');
        });
    });
});


module.exports = router;