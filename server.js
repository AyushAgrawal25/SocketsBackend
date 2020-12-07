const express=require('express');
const socketIO=require('socket.io');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser());

app.get('/root/:id', async (req, res)=>{
    console.log(req.headers);
    res.json({
        connnected:"True",
        server:"LocalHost",
    });
});
app.post('/root', async (req, res)=>{
    console.log(req.headers);
    res.json({
        connnected:"True",
        server:"LocalHost",
    });
});

var server=app.listen(3000, ()=>{
    console.log("Server Is Running...");
});

global.sockets=[];
var io=socketIO.listen(server);
io.on('connection', (socket)=>{
    console.log(socket.id);

    socket.emit('test-event', {
        data:"Some Testing",
        connected:true
    });

    socket.on('server-call', function(data){
        socket.broadcast.emit('test-event', {
            socketId:socket.id
        });
    });

    socket.on('join', function(data){
        global.sockets.push({
            userId:data.userId,
            socket:socket
        });
    });
});

app.get('/testSocket', async(req, res)=>{
    global.sockets.forEach(element => {
        if(element.userId==25){
            element.socket.emit('test-event', {
                calledFrom:"API"
            });
        }
    });
    res.json({
        "sdkjfh":"sdfhj"
    });
});