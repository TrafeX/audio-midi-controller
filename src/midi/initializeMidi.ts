import { midiOutput } from "./midiConnection";

export const initializeMidi = () => {

  for (let i = 1; i <= 8; i++) {
    midiOutput().send('cc', {
      controller: i,
      value: 2,
      channel: 0,
    });
  }
};