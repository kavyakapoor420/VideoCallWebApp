import React from 'react';
import { TextField, Button } from '@mui/material';

//Chat Window (Send/Receive Messages)

export default function ChatComponent({ messages, message, sendMessage, handleMessage }) {
    return (
        <div className="chatRoom">
            <div className="chatContainer">
                <h1>Chat</h1>
                <div className="chattingDisplay">
                    {messages.length > 0 ? (
                        messages.map((item, index) => (
                            <div style={{ marginBottom: "20px" }} key={index}>
                                <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                <p>{item.data}</p>
                            </div>
                        ))
                    ) : (
                        <p>No Messages Yet</p>
                    )}
                </div>
                <div className="chattingArea">
                    <TextField value={message} onChange={handleMessage} label="Enter Your chat" variant="outlined" />
                    <Button variant="contained" onClick={sendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
}
