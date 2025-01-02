import React from 'react';
import { TextField, Button } from '@mui/material';

//(Username Input & Join Button)

export default function LobbyComponent({ username, setUsername, connect }) {
    return (
        <div>
            <h2>Enter into Lobby</h2>
            <TextField 
                id="outlined-basic" 
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                variant="outlined" 
            />
            <Button variant="contained" onClick={connect}>Connect</Button>
        </div>
    );
}
