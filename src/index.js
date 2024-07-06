import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
// import multer from 'multer';
import uploadStorage from './service/upload.service.js';
import path from 'path';
const app = express()

import routers from './apis';

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/public')));
console.log(path.join(__dirname, '/public'));

// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file)
  return res.send("Single file")
})
//Multiple files
app.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files)
  return res.send("Multiple files")
})

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
console.log(req.body)
const newUser = { //req.body luôn
    id: req.body.id,
    name: req.body.name
}
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
    res.send('error reading file', err);
    return;
    }
    console.log(data)
    const dataUsers = JSON.parse(data);
    const newData = [...dataUsers, newUser]
    // console.log('hi',newData)
    fs.writeFile('data.json', JSON.stringify(newData), (err) => {
    if (err) {
        res.send('error writing file', err)
        return
    }
    res.send('Data added')
    })
})

})

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
