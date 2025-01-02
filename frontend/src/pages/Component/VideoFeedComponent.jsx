import React from 'react';

export default function VideoFeedComponent({ localVideoref, videos }) {
    return (
        <div className="conferenceView">
            <div>
                <video ref={localVideoref} autoPlay muted />
            </div>
            {videos.map((video) => (
                <div key={video.socketId}>
                    <video
                        data-socket={video.socketId}
                        ref={(ref) => {
                            if (ref && video.stream) {
                                ref.srcObject = video.stream;
                            }
                        }}
                        autoPlay
                    />
                </div>
            ))}
        </div>
    );
}
