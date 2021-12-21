const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("better-sqlite3");
const { nanoid } = require("nanoid");

const app = express();
const db = sqlite3('./database.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./static'));

function generateNanoId() {
    let newCode;

    do {
        newCode = nanoid(5);
    } while (getUrl(newCode) !== null);

    return newCode;
}

function getUrl(searchId) {
    const data = db.prepare(`SELECT * FROM Urls WHERE id='${searchId}'`).get();
    return data ? data : null;
}

function findByUrl(searchUrl) {
    const data = db.prepare(`SELECT * FROM Urls WHERE url='${searchUrl}'`).get();
    return data ? data : null;
}

function createRedir(id, url) {
    db.prepare(`INSERT INTO Urls VALUES ('${id}', '${url}')`).run();
}

app.post('/shorten', (req, res) => {
    const code = generateNanoId();

    const urlExists = findByUrl(req.body.url);

    if (!urlExists) {
        console.log(req.body.url);

        if (!req.body.url) return res.json({ status: false, msg: 'mf no url' });

        createRedir(code, req.body.url);
        return res.json({ status: true, code });
    } else {
        return res.json({ status: true, code: urlExists.id });
    }
});

app.get('/:code', (req, res) => {
    
    const url = getUrl(req.params.code);

    if (!url) res.status(404);
    else res.redirect(url.url);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
