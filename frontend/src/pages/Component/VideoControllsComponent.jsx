import React from 'react';
import { IconButton, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';

//  Video Controls (Video, Audio, Screen Share, and End Call)

export default function VideoControlsComponent({
    video, audio, screen, screenAvailable, newMessages, handleVideo, handleAudio, handleScreen, handleEndCall, setModal
}) {
    return (
        <div>
            <div className="buttonContainers">
                <IconButton onClick={handleVideo} style={{ color: "white" }}>
                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
                <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                    <CallEndIcon />
                </IconButton>
                <IconButton onClick={handleAudio} style={{ color: "white" }}>
                    {audio ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
                {screenAvailable && (
                    <IconButton onClick={handleScreen} style={{ color: "white" }}>
                        {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                    </IconButton>
                )}
                <Badge badgeContent={newMessages} max={999} color="orange">
                    <IconButton onClick={() => setModal(true)} style={{ color: "white" }}>
                        <ChatIcon />
                    </IconButton>
                </Badge>
            </div>
        </div>
    );
}
