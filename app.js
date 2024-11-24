const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // To serve static files (CSS)

// Set the view engine to EJS
app.set('view engine', 'ejs');

// File path to store penalties
const penaltiesFilePath = path.join(__dirname, 'penalties.json');

// Function to read penalties from JSON file
const getPenalties = () => {
    try {
        const data = fs.readFileSync(penaltiesFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Function to save penalties to the JSON file
const savePenalties = (penalties) => {
    fs.writeFileSync(penaltiesFilePath, JSON.stringify(penalties, null, 2));
};

// Home Route - Display all penalties
app.get('/', (req, res) => {
    const penalties = getPenalties();
    res.render('index', { penalties });
});

// Add Penalty Route
app.get('/add', (req, res) => {
    res.render('add-penalty');
});

// Handle the new penalty form submission
app.post('/add', (req, res) => {
    const { name, penalty, amount } = req.body;
    const penalties = getPenalties();
    const newPenalty = {
        id: penalties.length + 1,
        name,
        penalty,
        amount: parseFloat(amount),
        status: 'Unpaid'
    };
    penalties.push(newPenalty);
    savePenalties(penalties);
    res.redirect('/');
});

// Mark penalty as paid
app.post('/pay/:id', (req, res) => {
    const penaltyId = parseInt(req.params.id);
    const penalties = getPenalties();
    const penalty = penalties.find(p => p.id === penaltyId);
    if (penalty) {
        penalty.status = 'Paid';
        savePenalties(penalties);
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Penalty management system running at http://localhost:${port}`);
});

