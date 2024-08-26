const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const csvFilePath = path.join(__dirname, 'users.csv');

const ensureHeader = () => {
    if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, 'Name,Phone Number\n');
    } else {
        const data = fs.readFileSync(csvFilePath, 'utf8');
        if (!data.startsWith('Name,Phone Number')) {
            fs.writeFileSync(csvFilePath, 'Name,Phone Number\n' + data);
        }
    }
};

app.post('/save-contact', (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).send('Name and phone number are required!');
    }

    ensureHeader();

    const csvLine = `${name},${phone}\n`;

    fs.appendFile(csvFilePath, csvLine, (err) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
