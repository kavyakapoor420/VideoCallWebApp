import { useEffect, useRef, useState } from "react"
import './VideoMeet.css'
import { TextField ,Button} from "@mui/material"

const server_url="http://localhost:3000"

const connections={} // the people who have joined meeting

const peerConfigConnections={
    // stun seerver are the lighWeight server running on public internet which return IP address of requester Device
    "iceServers":[
        {"urls":"stun:stun.1.google.com:19302"}
    ]
}

const VideoMeet=()=>{

    const socketRef=useRef()
    let socketIdRef=useRef()

    let localVideoRefernece =useRef()

    let [videoAvailable,setVideoAvailable]=useState(true)

    let [audioAvailable,setAudioAvailable]=useState(true)

    let [video,setVideo]=useState()

    let [audio,setAudio]=useState()

    let [screenShare,setScreenShare]=useState()

    let [showModel,setModal]=useState()

    let [screenAvailable,setScreenAvailable]=useState()

    let [messages,setMessage]=useState("")

    let [newMessages,setNewMessages]=useState()

    let [askForUsername,setAskForUsername]=useState(true)

    let [username,setUsername]=useState("")

    const videoRef=useRef([])

    let [videos,setVideos]=useState([])

    // if(isChrome()===false){  // webRTC works on chromium based Browser
        
    // } 
    // read about navigator on MDn web/apis/navigator 
    const getPermission=async()=>{
        try{
            //    get permission of Video from user 
               const videoPermission=await navigator.mediaDevices.getUserMedia({video:true})
               if(videoPermission){
                 setVideoAvailable(true)
               }else{
                  setVideoAvailable(false)
               }
            // get Audio permission from user 
               const audioPermission=await navigator.mediaDevices.getUserMedia({audio:true})
               if(audioPermission){
                 setAudioAvailable(true)
               }else{
                setAudioAvailable(false)
               }
           // screen share 
               if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true)
               }else{
                setScreenAvailable(false)
               }

               if(videoAvailable || audioAvailable){
                const userMediaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable})
                   if(userMediaStream){
                     window.localStream=userMediaStream

                       if(localVideoRefernece.current){
                        localVideoRefernece.current.srcObject=userMediaStream
                       }
                   } 
              }
        }catch(err){
           console.log(err)
        }
    }
    let getUserMediaSuccess=(stream)=>{
    
    }
    // inside my stream there is audio and video so if turn off one or tunr off both video and audio
    // thne from every other devices my audio and video will stop 
   let getUserMdia=()=>{
       if( (video && videoAvailable) || (audio && audioAvailable) ){
          navigator.mediaDevices.getUserMedia({video:video,audio:audio})
          .then(()=>{})
          .then((stream)=>{})
          .catch((err)=>console.log(err))
       }else{
          // if we dont have video or audio then stop all tracks
               try{
                    let tracks=localVideoRefernece.current.srcObject.getTracks()
                    tracks.forEach((track)=>{
                          track.stop() 
                    })
               }catch(err){

               }
       }
   }
    useEffect(()=>{
       getPermission()
    },[])
    
    useEffect(()=>{
       if(video!==undefined && audio!==undefined){
         getUserMdia()
       }
    },[video,audio])
     
      let gotMessageFromServer=(fromId,message)=>{

      }
     let addMessage=()=>{

     }
     let connectToSocketServer=()=>{
        socketRef.current=io.connect(server_url,{secure:false})
        socketRef.current.on('signal',gotMessageFromServer)
        socketRef.current.on('connect',()=>{
             socketRef.current.emit('join-call',window.location.href)
             socketRef.current=socketRef.current.id 

             socketRef.current.on('chat-message',addMessage)

             socketRef.current.on('user-left',(id)=>{
                 setVideo((videos)=>{
                    videos.filter((video)=>video.socketId!==id)
                 })
                 socketRef.current.on('user-joined',(id,clients)=>{
                      clients.forEach((socketListid)=>{
                          
                        connections[socketListid]=new RTCPeerConnection(peerConfigConnections)
                          
                        connections[socketListid].onicecandidate=(event)=>{
                            if(event.candidate!==null){ // ice is a protocol -> interactivity connection establishement 
                                socketRef.current.emit("signal",socketListid,JSON.stringify({"ice":event.candidate}))
                            }
                        }

                        connections[socketListid].onaddstream=(event)=>{

                            let videoExists=videoRef.current.find((video)=>{
                                 video.socketId===socketListid
                            })
                            if(videoExists){
                                setVideo((video)=>{
                                    const updatedVideos=videos.map((video)=>{
                                         video.socketId===socketListid  ? {...video ,stream:event.stream} : video
                                    })
                                    videoRef.current=updatedVideos 

                                    return updatedVideos
                                })
                            }else{
                                   let newVideo={
                                      socketId:socketListid,
                                      stream:event.stream ,
                                      autoPlay:true,
                                      playsOnline:true
                                   }
                                   setVideos((video)=>{
                                     const  updatedVideos=[...videos,newVideo]
                                      videoRef.current=updatedVideos 

                                      return updatedVideos   
                                 })
                            }
                        }

                        if(window.localStream!==undefined && window.localStream!==null){
                              connections[socketListid].addStream(window.localStream)
                        }else{
                             
                        }
                      })

                      if(id===socketIdRef.current){
                         for( let id2 in connections){
                             if(id2===socketIdRef.current) continue 

                             try{
                                  
                             }catch(err){
                               connections[id2].createOffer().then((description)=>{
                                   connections[id2].setLocalDescription(description)
                                    .then(()=>{          // sdp-> session description
                                         socketRef.current.emit('signal',id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                                    })
                                    .catch((e)=>console.log(e))
                               })
                             }
                         }
                      }
                 })
             })
        })
     }

    let getMedia=()=>{
         setVideo(videoAvailable) 
         setAudio(audioAvailable) 
         connectToSocketServer()
    }
    return (
        <>
               {
                askForUsername === true ? 
                   <div>
                         
                         <h2>Enter Into Lobby</h2>
                          <TextField id="outlined-basic" label='username' onChange={(e)=>setUsername(e.target.value)} value={username} variant="outlined"></TextField>
                        <Button variant='contained' onClick={getMedia}>Connect</Button>

                        <div>
                            <video ref={localVideoRefernece}></video>
                        </div>
                   </div>               : <></>
               }  
        </>
    )
}

export default VideoMeet ;