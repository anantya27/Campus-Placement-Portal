
const socket=io('/')
const videoGrid=document.getElementById('video-grid')
const myVideo=document.createElement('video');
myVideo.muted=true;


var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoSteam
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    myVideoSteam=stream;
    addVideoStream(myVideo,stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })
    
    socket.on('user-connected',(userId) =>{
        connectToNewUser(userId,stream);
    })
})

// socket.emit('join-room',ROOM_ID);

peer.on('open', id => {
    // console.log(id);
    socket.emit('join-room', ROOM_ID, id)
})



const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    // call.on('close', () => {
    //  video.remove()
    // })

    // peers[userId] = call
}

const addVideoStream = (video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

