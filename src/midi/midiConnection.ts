import easymidi from 'easymidi';

const MIDI_DEVICE = 'X-TOUCH MINI';
const NR_OF_CHANNELS = 8;

let midiInputConnection: easymidi.Input;
let midiOutputConnection: easymidi.Output;

const connectToMidi = () => {

  const midiDevice = easymidi.getInputs().filter(input => input.startsWith(MIDI_DEVICE));
  if (midiDevice.length === 0) {
    throw Error(`Could not find MIDI device ${MIDI_DEVICE}, only found: ${easymidi.getInputs()}`);
  }

  console.log('Connecting to MIDI device:', midiDevice[0]);

  midiInputConnection = new easymidi.Input(midiDevice[0]);
  midiOutputConnection = new easymidi.Output(midiDevice[0]);

};

export const midiNrOfChannels = () => NR_OF_CHANNELS;

export const midiInput = (): easymidi.Input => {
  if (!midiInputConnection) {
    connectToMidi();
  }
  return midiInputConnection;
};

export const midiOutput = (): easymidi.Output => {
  if (!midiOutputConnection) {
    connectToMidi();
  }
  return midiOutputConnection;
};