const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // To serve static files (CSS)

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Sample data
let penalties = [
    { id: 1, name: 'John Doe', penalty: 'Speeding', amount: 100, status: 'Unpaid' },
    { id: 2, name: 'Jane Smith', penalty: 'Parking Violation', amount: 50, status: 'Paid' }
];

// Home Route - Display all penalties
app.get('/', (req, res) => {
    res.render('index', { penalties });
});

// Add Penalty Route
app.get('/add', (req, res) => {
    res.render('add-penalty');
});

// Handle the new penalty form submission
app.post('/add', (req, res) => {
    const { name, penalty, amount } = req.body;
    const newPenalty = {
        id: penalties.length + 1,
        name,
        penalty,
        amount: parseFloat(amount),
        status: 'Unpaid'
    };
    penalties.push(newPenalty);
    res.redirect('/');
});

// Mark penalty as paid
app.post('/pay/:id', (req, res) => {
    const penaltyId = parseInt(req.params.id);
    const penalty = penalties.find(p => p.id === penaltyId);
    if (penalty) {
        penalty.status = 'Paid';
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Penalty management system running at http://localhost:${port}`);
});

