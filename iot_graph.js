var express = require('express');
var app = express();
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

app.get("/data", function(req, res) {
        v = req.query
        res.send(`type=${v.type}, value=${v.value}`)

        r={};
        r.type=v.type;
        r.ip = "3.15.44.39";
        r.value=v.value;

        var query = connection.query('insert into sensors set ?', r, function(err, rows, cols) {
                if (err) throw err;
                console.log("done");
                return;
        });
});

count = 1

app.get("/dump", function(req, res) {
          v = req.query
          console.log(`count=${v.count}`);
          html = ""

          count = v.count
          var lines_print = 'Count : ' + count + '<br>'
          var qstr = 'select * from sensors ';
          connection.query(qstr, function(err, rows, cols) {
                      if (err) {
                                    throw err;
                                    res.send('query error: '+ qstr);
                                    return;
                                  }
                      if (count > rows.length) {
                              res.send('DB is smaller than count, Please revalue it')
                              return
                      }
                      console.log("Print "+ count +" records")
                      for (var i=0; i<count; i++) {
                                     html += JSON.stringify(rows[i]);
                                  }
                      lines_print = lines_print + html
                      res.send(lines_print);
                    });

});

app.get('/graph', function (req, res) {
        v = req.query
        console.log(`count=${v.count}`);

        count = v.count

        var html = fs.readFile('./graph.html', function (err, html) {
                html = " "+ html

                var qstr = 'select * from sensors ';
                connection.query(qstr, function(err, rows, cols) {
                        length = rows.length
                        if (err) throw err;

                        if (count >= length) {
                                res.send('DB is smaller than count, Please revalue it')
                                return
                        }

                        var data = "";
                        var comma = ""
                        for (var i=1; i<=count; i++) {
                                r = rows[length-i];
                                data += comma + "['"+ i +"',"+ r.value +"]";
                                comma = ",";
                        }
                        var header = "data.addColumn('string', 'Data Sequence');"
                        header += "data.addColumn('number', 'Value');"
                        html = html.replace("<%HEADER%>", header);
                        html = html.replace("<%DATA%>", data);
                        res.writeHeader(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                });
       });
})

var server = app.listen(8080, function () {
          var host = server.address().address
          var port = server.address().port
          console.log('listening at http://%s:%s', host, port)
});
