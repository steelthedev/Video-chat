const APP_ID = "2686627918ca498ca691fd770fa51817"
const CHANNEL = "main"
const TOKEN = "0062686627918ca498ca691fd770fa51817IAAXk7Nic1TjTbh+mpzMfi3omwNumVloN4m/6K0pSSBDiWTNKL8AAAAAEABCtiZwg0hoYgEAAQCBSGhi"
let UID;

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []

let remoteUsers = []

let joinAndDisplayLocalStream = async () => {

    client.on('user-published',handleUserJoin)
    client.on('user-left',handleUserLeft)

   UID = await client.join(APP_ID,CHANNEL,TOKEN,null)
   
   localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

   let player = `
   <div class="container" id="user-container-${UID}">
   <div class="row justify-content-center mb-5"> 
   <div class="col-lg-4 col-md-12 video-container" id="video-container-${UID}">
   <div class="username-wrapper"><span class="lead">My Name</span></div>
   <div class="video-player" id="user-${UID}"></div>
   </div>`
   document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

   localTracks[1].play(`user-${UID}`)

   await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoin = async (user,mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }
        
   player = `
   <div class="container" id="user-container-${user.uid}">
   <div class="row justify-content-center mb-5"> 
   <div class="col-lg-4 col-md-12 video-container" id="video-container-${user.uid}">
   <div class="username-wrapper"><span class="lead">My Name</span></div>
   <div class="video-player" id="user-${user.uid}"></div>
   </div>
   </div>
   </div>
   `
   document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)


   user.videoTrack.play(`user-${user.uid}`)

    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

joinAndDisplayLocalStream()