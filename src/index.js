import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import pug from 'pug';
import methodOverride from 'method-override';

const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

// setting pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// Middleware to parse application/json
app.use(bodyParser.json());
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to handle PUT and DELETE methods via form submission
app.use(methodOverride('_method'));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Read data with fs
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const parsedData = JSON.parse(data);
            res.render('Home/users', {
                data: parsedData
            });
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

app.post('/data', (req, res) => { 
    console.log(req.body);
    const newUser = {
        id: req.body.id,
        name: req.body.name
    };
    if (!newUser.id || !newUser.name) {
        res.status(400).send('Please provide id and name');
        return;
    }
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const dataUsers = JSON.parse(data);
            const newData = [...dataUsers, newUser];
            fs.writeFile('data.json', JSON.stringify(newData), (err) => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.redirect('/data');
            });
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

app.put('/data/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const newData = JSON.parse(data).map(item => {
                if (item.id === id) {
                    return { id, name };
                }
                return item;
            });
            fs.writeFile('data.json', JSON.stringify(newData), (err) => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.redirect('/data');
            });
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

app.delete('/data/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const newData = JSON.parse(data).filter(item => item.id !== id);
            fs.writeFile('data.json', JSON.stringify(newData), (err) => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.redirect('/data');
            });
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON data');
        }
    });
});

// app.use('/api', routers);

app.get('/login', (req, res) => {
    return res.render('login/login', {
        title: 'Login'
    });
});

app.get('/hello-pug', (req, res) => {
    res.render('Home/hello.pug', { name: 'Pug' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
