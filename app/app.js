var express = require('express');
var redis = require('redis');

var client = redis.createClient(6379, 'redis'); //creates a new client createClient(port, string ip)
client.on('connect', () => console.log('redis connected'));

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/res'));

app.get('/', (req, res, next) => {
    let p1 = new Promise((resolve, reject) => {
        client.get('yes', function(err, reply) {
            resolve(reply);
        });
    });

    let p2 = new Promise((resolve, reject) => {
        client.get('no', function(err, reply) {
            resolve(reply);
        });
    });

    Promise.all([p1, p2])
    .then(values => { 
        let yes = values[0] === null ? 0 : parseInt(values[0]);
        let no = values[1] === null ? 0 : parseInt(values[1]);
        res.render('index', { 
            title: 'Vote App',
            yes: (yes + no) == 0 ? 0 : ((yes * 100)/(yes + no)).toFixed(2),
            no:  (yes + no) == 0 ? 0 : ((no * 100)/(yes + no)).toFixed(2)
        });
    })
    .catch(reason => { 
        res.render('index', { 
            title: 'Vote App',
            yes: 0,
            no:  0
        });
    });
});

app.get('/vote/:vote', (req, res, next) => {
    if(req.params.vote){
        client.incr(req.params.vote, function(err, reply) {
            res.redirect('/');
        });        
    }else{
        res.redirect('/');
    }   
});

app.listen(3000, () => console.log('Server started'));