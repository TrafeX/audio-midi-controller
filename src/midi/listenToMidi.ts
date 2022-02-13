import { volumeEncoderValueToPercentage } from "../helpers/volume";
import { setMuteState } from "../media/setMuteState";
import { setVolume } from "../media/setVolume";
import { mediaChannelsType } from "../types";
import { midiInput } from "./midiConnection";

export const listenToMidi = (mediaChannels: () => mediaChannelsType): void => {

  midiInput().on('noteoff', msg => console.log('noteoff', msg.note, msg.velocity, msg.channel));
  midiInput().on('noteon', msg => console.log('noteon', msg.note, msg.velocity, msg.channel));

  midiInput().on('noteon', async msg => {
    console.log(msg, mediaChannels);
    if (mediaChannels()[msg.note - 8]) {
      const currentChannel = mediaChannels()[msg.note - 8];
      await setMuteState(currentChannel, true);
    }
  });

  midiInput().on('cc', async msg => {
    console.log(msg, mediaChannels);
    if (mediaChannels()[msg.controller - 1]) {
      const currentChannel = mediaChannels()[msg.controller - 1];
      const newVolume = volumeEncoderValueToPercentage(msg.value);
      await setVolume(currentChannel, newVolume);
    }
  });

  // midiInput().on('noteon', async (msg) => {
  //   if (msg.note === 21) {
  //     // Stop
  //     const { stderr } = await exec('playerctl stop');
  //     if (stderr) {
  //       console.error(stderr);
  //     }
  //   }
  //   if (msg.note === 22) {
  //     // Play
  //     const { stderr } = await exec('playerctl play-pause');
  //     if (stderr) {
  //       console.error(stderr);
  //     }
  //   }
  //   if (msg.note === 19) {
  //     // Next
  //     const { stderr } = await exec('playerctl next');
  //     if (stderr) {
  //       console.error(stderr);
  //     }
  //   }
  //   if (msg.note === 18) {
  //     // Next
  //     const { stderr } = await exec('playerctl previous');
  //     if (stderr) {
  //       console.error(stderr);
  //     }
  //   }
  // });

};