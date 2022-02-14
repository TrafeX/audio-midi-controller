import { volumePercentageToEncoder } from '../helpers/volume';
import { mediaChannelsType, mediaChannelType } from "../types";
import { midiNrOfChannels, midiOutput } from './midiConnection';

export const updateMidiChannels = (mediaChannels: () => mediaChannelsType) => {

  for (let controllerNr = 0; controllerNr < midiNrOfChannels(); controllerNr++) {
    if (mediaChannels()[controllerNr]) {
      // console.log(`Setting ${controllerNr} (${mediaChannels()[controllerNr].name}) to ${mediaChannels()[controllerNr].volume}`);
      setMidiSink(mediaChannels()[controllerNr], controllerNr);
    } else {
      clearMidiSink(controllerNr);
    }
  }
};

const setMidiSink = (mediaChannel: mediaChannelType, controllerNr: number) => {
  // Set lights to spread
  midiOutput().send('cc', {
    controller: controllerNr + 1,
    value: 2,
    channel: 0,
  });

  // Set volume state
  midiOutput().send('cc', {
    controller: controllerNr + 1,
    value: volumePercentageToEncoder(mediaChannel.volume),
    channel: 10,
  });

  // Set mute state
  midiOutput().send('noteon', {
    note: controllerNr + 8,
    velocity: mediaChannel.muted ? 127 : 0,
    channel: 10,
  });
};

const clearMidiSink = (controllerNr: number) => {

  // Set lights to spread
  midiOutput().send('cc', {
    controller: controllerNr + 1,
    value: 2,
    channel: 0,
  });

  // Set volume state
  midiOutput().send('cc', {
    controller: controllerNr + 1,
    value: 0,
    channel: 10,
  });

  // Set mute state
  midiOutput().send('noteon', {
    note: controllerNr + 8,
    velocity: 0,
    channel: 10,
  });
};