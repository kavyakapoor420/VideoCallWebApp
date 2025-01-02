import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import LobbyComponent from './LobbyComponent';
import VideoControlsComponent from './VideoControlsComponent';
import ChatComponent from './ChatComponent';
import VideoFeedComponent from './VideoFeedComponent';
import { Badge } from '@mui/material';
import styles from '../../styles/VideoMeetComponent.module.css';

const server_url = "http://localhost:3000";

var connections = {};
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

export default function VideoMeetComponent() {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);
    
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [showModal, setModal] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        // Initialize socket connection and media permissions
        getPermissions();
    }, []);

    const getPermissions = async () => {
        // Logic for fetching media permissions (audio, video, screen share)
    };

    const connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    const getMedia = () => {
        // Handle media stream for video and audio
    };

    const sendMessage = () => {
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    return (
        <div>
            {askForUsername ? (
                <LobbyComponent username={username} setUsername={setUsername} connect={connect} />
            ) : (
                <div className={styles.meetVideoContainer}>
                    {showModal && (
                        <ChatComponent 
                            messages={messages} 
                            message={message} 
                            sendMessage={sendMessage} 
                            handleMessage={(e) => setMessage(e.target.value)} 
                        />
                    )}
                    <VideoControlsComponent 
                        video={video} 
                        audio={audio} 
                        screen={screen} 
                        screenAvailable={screenAvailable} 
                        newMessages={newMessages} 
                        handleVideo={() => setVideo(!video)} 
                        handleAudio={() => setAudio(!audio)} 
                        handleScreen={() => setScreen(!screen)} 
                        handleEndCall={() => window.location.href = "/"} 
                        setModal={setModal} 
                    />
                    <VideoFeedComponent localVideoref={localVideoref} videos={videos} />
                </div>
            )}
        </div>
    );
}
