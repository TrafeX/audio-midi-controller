import { midiOutput } from "../midi/midiConnection";
import { mediaPlayerStatusType } from "../types";

export const updateMediaPlayer = (playerStatus: mediaPlayerStatusType) => {

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