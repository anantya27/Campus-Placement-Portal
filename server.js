const express = require('express');
const app = express();
const server=require('http').Server(app);
const io = require('socket.io')(server);// socket io is for real time communiccation it creates a chanel for commun
//through this server also sends request making a chanel for communication
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const {v4 : uuidv4}=require('uuid');


app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
    // res.status(200).send("Hello World!");
} )

app.get('/:room',(req,res)=>{

    res.render('room',{roomId:req.params.room});
    // res.status(200).send("Hello World!");
} )



io.on('connection', socket => {

    // socket.on('join-room', (roomId,userId) => {
    //     // console.log("joined room");
    //     socket.join(roomId)
    //     // if(socket.to(roomId).broadcast){
    //     // console.log(socket.to(roomId));
    //     socket.to(roomId).emit('user-connected',userId);
    //     // // }
        
    //     // // messages
    //     // socket.on('message', (message) => {
    //     //     //send message to the same room
    //     //     io.to(roomId).emit('createMessage', message);
    //     // }); 
        
    // }); 

    socket.on('join-room', (roomId,userId) => {
        // console.log("joined room");
        socket.join(roomId)
        // if(socket.to(roomId).broadcast){
        // console.log(socket.to(roomId));
        socket.to(roomId).emit('user-connected',userId);
        // }
        
        // messages
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message);
        }); 
        
    }); 

})


server.listen(3030);    