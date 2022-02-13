import { volumeEncoderValueToPercentage } from "../helpers/volume";
import { setMuteState } from "../media/setMuteState";
import { setVolume } from "../media/setVolume";
import { nextMedia, playOrPauseMedia, previousMedia, stopMedia } from "../mediaplayer/control";
import { mediaChannelsType } from "../types";
import { midiInput } from "./midiConnection";

export const listenToMidi = (mediaChannels: () => mediaChannelsType): void => {

  midiInput().on('noteoff', msg => console.log('noteoff', msg.note, msg.velocity, msg.channel));
  midiInput().on('noteon', msg => console.log('noteon', msg.note, msg.velocity, msg.channel));

  midiInput().on('noteon', async msg => {
    if (mediaChannels()[msg.note - 8]) {
      const currentChannel = mediaChannels()[msg.note - 8];
      await setMuteState(currentChannel, true);
    }
  });

  midiInput().on('cc', async msg => {
    if (mediaChannels()[msg.controller - 1]) {
      const currentChannel = mediaChannels()[msg.controller - 1];
      const newVolume = volumeEncoderValueToPercentage(msg.value);
      await setVolume(currentChannel, newVolume);
    }
  });

  midiInput().on('noteon', async (msg) => {
    if (msg.note === 21) await stopMedia();
    if (msg.note === 22) await playOrPauseMedia();
    if (msg.note === 19) await nextMedia();
    if (msg.note === 18) await previousMedia();
  });

};