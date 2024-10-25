const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

const port = 3000

app.get('/', (req, res) => {
    res.sendFile('/index.html')
})
app.get('/getFolder', async (req, res) => {
    let folders = fs.readdirSync('./public/Music')
    res.json(folders)
})
app.post('/getContent', async (req, res) => {
    let { folderName, contentType } = await req.body;
    let x = fs.readdirSync(`./public/Music/${folderName}`)
    let covers = [], songs = []
    x.forEach(item => {
        if (item.endsWith('.mp3') || item.endsWith('.opus'))
            songs.push(`/Music/${folderName}/${item}`)
        else if (item.endsWith('.jpg') || item.endsWith('.webp'))
            covers.push(`/Music/${folderName}/${item}`)
    })
    if (contentType == 'cover')
        res.json(covers)
    else
        res.json(songs)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
