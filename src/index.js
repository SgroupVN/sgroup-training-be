import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
const app = express()
// import connection from './database/database.config';
import pool from './database/database.config';
import routers from './apis';

app.use(bodyParser.json())

// basic route 
app.get('/', (req, res) => {
    res.send('Hello World!')
}
)

// read data with fs
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        res.send(data)
    })
})

app.post('/data', (req, res) => {
    const { id , name } = req.body
    const data = JSON.stringify({ id, name })
    fs.writeFile('data.json', data, (err) => {
        if (err) {
            res.send('Error writing file', err)
            return
        }
        res.send('Data saved')
    })
}
)
app.put('/data/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        const newData = JSON.parse(data).map(item => {
            if (item.id === id) {
                return { id, name }
            }
            return item
        })
        fs.writeFile('data.json', JSON.stringify(newData), (err) => {
            if (err) {
                res.send('Error writing file', err)
                return
            }
            res.send('Data updated')
        })
    })
}
)
app.delete('/data/:id', (req, res) => {
    const { id } = req.params
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        const newData = JSON.parse(data).filter(item => item.id !== id)
        fs.writeFile('data.json', JSON.stringify(newData), (err) => {
            if (err) {
                res.send('Error writing file', err)
                return
            }
            res.send('Data deleted')
        })
    })
}
)

app.use('/api', routers);


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
