const express = require('express')
const app = express()
const port = 8080
const fs = require('fs');


cnt = 0
count = 1

app.get('/', function(req, res) {
        console.log(`got here, you are ${cnt++}`)
        res.send('You are not supposed to be here')
})

app.get('/update', function(req, res) {
            v = req.query
            res.send(`api_key=${v.api_key}, field1=${v.field1}`)

            api_key = v.api_key
            field1 = v.field1
            datetime = new Date();

            fs.appendFile('data.txt', `update?api_key=${api_key}&field1=${field1}<br>`, (err) => {
                            if (err) throw err;
                            console.log(`api_key=${api_key}&field1=${field1}`)
                        })
})

app.get('/dump', function(req, res) {
            v = req.query
            console.log(`count=${v.count}`)

            count = v.count
            var line

            fs.readFile('data.txt', function(err, data) {
                if (err) throw err
                res.type('text/html')
                res.send(data)
            })


})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
