import { midiOutput } from "../midi/midiConnection";
import { mediaChannelsType, mediaPlayerStatusType } from "../types";

export const updateMediaPlayer = (playerStatus: mediaPlayerStatusType | null, mediaChannels: () => mediaChannelsType) => {
  const playingChannel = mediaChannels().filter(mediaChannel => {
    return mediaChannel.type === 'sink-input' && mediaChannel.state === 'RUNNING' && mediaChannel.name !== 'Google Chrome';
  });

  if (playingChannel.length > 0) {
    playerStatus = 'playing';
  }

  if (playerStatus === 'playing') {
    midiOutput().send('noteon', {
      note: 22,
      velocity: 127,
      channel: 10,
    });
  } else if (playerStatus === 'paused') {
    midiOutput().send('noteon', {
      note: 14,
      velocity: 2,
      channel: 0,
    });
  } else {
    midiOutput().send('noteoff', {
      note: 22,
      velocity: 0,
      channel: 10,
    });
  }
};