var express = require("express")
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const { Pool } = require('pg')
var port = process.env.PORT || 3000;
app.use('/public', express.static(__dirname + "/publics"));

app.set("view engine", "ejs");
app.set("views", "./views");

const pool = new Pool({
    user: 'aqcsjqoaztqgnk',
    host: 'ec2-54-83-59-120.compute-1.amazonaws.com',
    database: 'ddrnb92vvc8ec1',
    password: '7c0079d0bbea9653a812db571883416a8ed87f05c2c014a4404e5c645717f40b',
    port: 5432,
    ssl: require,
})


app.get('/', function (req, res) {
    res.render("index");
})

app.get('/table', function(req,res){
    pool.query("SELECT * FROM dulieu ORDER BY id LIMIT 20 ", (err, result) => {
        if(result){
            console.log(result.rows)
            var data = result.rows.map(function(item) {
                return parseInt(item.nhietdo);
            });

            console.log(data)
            res.render("table", {datas : result.rows});
        }else {
            res.send("Lỗi dữ liệu")
        }
    })
    //res.send("tttt")
})

io.on('connection', function (socket) {
    console.log("co 1 nguoi dung");

    setInterval(function () {
        socket.emit("esp8266","esp8266");      
    }, 5000);
    
    pool.query("SELECT * FROM doamdat ORDER BY id LIMIT 20 ", (err, result) => {
        if(result){
            console.log(result.rows)
            var data = [,];
            data = result.rows.map(function(item,index) {
                return [index,parseInt(item.value)];
            });

            socket.emit("dulieu",data)
        }
    })

    socket.on("dulieu", function(msg){     
            //pool.query("INSERT INTO doamdat (value,time) VALUES ($1,$2)",[msg.doamdat, new Date()], (err,res)=>{  
                //if(res) {
                    socket.broadcast.emit("doamdat",msg.doamdat)
               // }  
           // })
    })

    socket.on("maybom", (msg) => {
        pool.query("UPDATE configs SET maybom = $1", [msg], (err,res) => {
            if(res){
                socket.broadcast.emit("maybom",msg)
            }
        })
    })

    pool.query("SELECT * FROM configs", (err, result) => {
        if (result) {
            if (result.rows[0].d1 == 1) {
               
                socket.emit("esp8266", "led1on")
            } else {
                socket.emit("esp8266", "led1off")
            }
            if (result.rows[0].d2 == 1) {
                socket.emit("esp8266", "led2on")
            } else {
                socket.emit("esp8266", "led2off")
            }
            if (result.rows[0].d3 == 1) {
                socket.emit("esp8266", "led3on")
            } else {
                socket.emit("esp8266", "led3off")
            }
            if (result.rows[0].d4 == 1) {
                socket.emit("esp8266", "led4on")
            } else {
                socket.emit("esp8266", "led4off")
            }

            socket.emit("maybom", result.rows[0].maybom)
            console.log(result.rows[0].maybom)
        }
    })

    socket.on("esp8266", function (result) {

        if (result == "led1on") {
            pool.query("UPDATE configs SET d1 = 1", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led1on")
                }
            })
            
        } else if (result == "led2on") {
           
            pool.query("UPDATE configs SET d2 = 1", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led2on")
                }
            })
        } else if (result == "led3on") {
            pool.query("UPDATE configs SET d3 = 1", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led3on")
                }
            })
        } else if (result == "led4on") {
            pool.query("UPDATE configs SET d4 = 1", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led4on")
                }
            })
        } else if (result == "led1off") {
            pool.query("UPDATE configs SET d1 = 0", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led1off")
                }
            })
        } else if (result == "led2off") {
            pool.query("UPDATE configs SET d2 = 0", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led2off")
                }
            })
        } else if (result == "led3off") {
            pool.query("UPDATE configs SET d3 = 0", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led3off")
                }
            })
        } else if (result == "led4off") {
            pool.query("UPDATE configs SET d4 = 0", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "led4off")
                }
            })
        } else if (result == "allledon") {
            pool.query("UPDATE configs SET d1 = 1,d2 =1, d3 = 1, d4 =1", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "allledon")
                }
            })
        } else if (result == "allledoff") {
            pool.query("UPDATE configs SET d1 = 0,d2 =0, d3 = 0, d4 = 0", (err, result) => {
                if(result){
                    socket.broadcast.emit("esp8266", "allledoff")
                }
            })
        } 
        
    })

})

//pool.end()
http.listen(port, function () {
    console.log('listen on *: 3000')
})

