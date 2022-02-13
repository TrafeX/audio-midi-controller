import easymidi from 'easymidi';
import { promisify } from 'util';
import { exec as syncExec } from 'child_process';
import { fetchPlayerStatus } from './lib/playerctl.js';

const exec = promisify(syncExec);

const MIDI_DEVICE = 'X-TOUCH MINI:X-TOUCH MINI MIDI 1 28:0';

console.log(easymidi.getInputs());
const input = new easymidi.Input(MIDI_DEVICE);
const output = new easymidi.Output(MIDI_DEVICE);

const sinkInputsRegex = /index: ([0-9]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no).*?application\.name = "([a-z_ -]+)"/gis
const sinksRegex = /\* index: ([0-9]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no)/gis
const inputSourcesRegex = /\* index: ([0-9]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no)/gis

let sinks = [];

const fetchSinkInputs = async () => {

  const { stdout: rawSinks } = await exec('pacmd list-sinks');
  const sinksIndices = [...rawSinks.matchAll(sinksRegex)].map(match => {
    return {
      index: match[1],
      volume: match[2],
      muted: match[3] === 'yes',
      type: 'sink',
    }
  });

  const { stdout: rawSinkInputs } = await exec('pacmd list-sink-inputs');
  const sinkInputIndices = [...rawSinkInputs.matchAll(sinkInputsRegex)].map(match => {
    return {
      index: match[1],
      volume: match[2],
      muted: match[3] === 'yes',
      application: match[4],
      type: 'sink-input',
    }
  });

  const { stdout: rawInputSources } = await exec('pacmd list-sources');
  const inputSourcesIndices = [...rawInputSources.matchAll(inputSourcesRegex)].map(match => {
    return {
      index: match[1],
      volume: match[2],
      muted: match[3] === 'yes',
      type: 'source',
    }
  });

  const allChannels = [...sinksIndices, ...sinkInputIndices];
  allChannels[7] = { ...inputSourcesIndices[0] };
  return allChannels;
};

const initializeMidi = () => {

  for (let i = 1; i <= 8; i++) {
    output.send('cc', {
      controller: i,
      value: 2,
      channel: 0
    })
  }
}

const updateMidiChannels = (sinks) => {

  for (let controllerNr = 0; controllerNr < 8; controllerNr++) {
    if (sinks[controllerNr]) {
      console.log(`Setting ${controllerNr} (${sinks[controllerNr].application}) to ${sinks[controllerNr].volume}`);
      setMidiSink(sinks[controllerNr], controllerNr)
    } else {
      clearMidiSink(controllerNr)
    }
  }
}

const setMidiSink = (sink, controllerNr) => {
  output.send('cc', {
    controller: controllerNr + 1,
    value: volumePercentageToEncoder(sink.volume),
    channel: 10
  })

  output.send('noteon', {
    note: controllerNr + 8,
    velocity: sink.muted ? 127 : 0,
    channel: 10
  })
}

const clearMidiSink = (controllerNr) => {
  output.send('cc', {
    controller: controllerNr + 1,
    value: 0,
    channel: 10
  })

  output.send('noteon', {
    note: controllerNr + 8,
    velocity: 0,
    channel: 10
  })
}

const updateMidiPlayStatus = (status) => {
  if (status === 'playing') {
    output.send('noteon', {
      note: 22,
      velocity: 127,
      channel: 10
    });
  } else if (status === 'paused') {
    output.send('noteon', {
      note: 14,
      velocity: 2,
      channel: 0
    });
  } else {
    output.send('noteoff', {
      note: 22,
      velocity: 0,
      channel: 10
    });
  }
}

const volumePercentageToEncoder = (volume) => Math.round(volume / 100 * 127);
const volumeEncoderValueToPercentage = (volume) => Math.round(volume / 127 * 100);

const setSinkVolume = async (sink, volume) => {
  console.log(`Setting ${sink.index} to ${volume}%`);

  const setVolume = exec(`pactl set-${sink.type}-volume ${sink.index} ${volume}%`);

  const { stdout, stderr } = await setVolume;
  if (stderr) {
    console.error(stderr);
  }
}

const setSinkMuteState = async (sink, muted) => {

  const mutedState = muted ? 'on' : 'off';
  console.log(`Setting ${sink.index} muted state to ${mutedState}`);

  const { stdout, stderr } = await exec(`pactl set-${sink.type}-mute ${sink.index} toggle`);
  if (stderr) {
    console.error(stderr);
  }
}

input.on('noteoff', msg => console.log('noteoff', msg.note, msg.velocity, msg.channel));
input.on('noteon', msg => console.log('noteon', msg.note, msg.velocity, msg.channel));

input.on('noteon', async (msg) => {
  if (sinks[msg.note - 8]) {
    const activeSink = sinks[msg.note - 8];
    await setSinkMuteState(activeSink, true);
  }
  if (msg.note === 21) {
    // Stop
    const { stderr } = await exec('playerctl stop');
    if (stderr) {
      console.error(stderr);
    }
  }
  if (msg.note === 22) {
    // Play
    const { stderr } = await exec('playerctl play-pause');
    if (stderr) {
      console.error(stderr);
    }
  }
  if (msg.note === 19) {
    // Next
    const { stderr } = await exec('playerctl next');
    if (stderr) {
      console.error(stderr);
    }
  }
  if (msg.note === 18) {
    // Next
    const { stderr } = await exec('playerctl previous');
    if (stderr) {
      console.error(stderr);
    }
  }
});

input.on('cc', async (msg) => {
  if (sinks[msg.controller - 1]) {
    const activeSink = sinks[msg.controller - 1];
    const newVolume = volumeEncoderValueToPercentage(msg.value);
    await setSinkVolume(activeSink, newVolume);
  }
});



initializeMidi();
setInterval(async () => {
  sinks = await fetchSinkInputs();
  const playerStatus = await fetchPlayerStatus();

  updateMidiChannels(sinks);
  updateMidiPlayStatus(playerStatus);
}, 1000);


// input.on('noteoff', async (msg) => {
//   if (sinks[msg.note - 8]) {
//     const activeSink = sinks[msg.note - 8];
//     await setSinkMuteState(activeSink, false);
//   }
// });

// input.on('noteoff', msg => console.log('noteoff', msg.note, msg.velocity, msg.channel));
// input.on('noteon', msg => console.log('noteon', msg.note, msg.velocity, msg.channel));
// input.on('poly aftertouch', msg => console.log('poly aftertouch', msg.note, msg.pressure, msg.channel));
// input.on('cc', msg => console.log('cc', msg.controller, msg.value, msg.channel));
// input.on('program', msg => console.log('program', msg.number, msg.channel));
// input.on('channel aftertouch', msg => console.log('channel aftertouch', msg.pressure, msg.channel));
// input.on('pitch', msg => console.log('pitch', msg.value, msg.channel));
// input.on('position', msg => console.log('position', msg.value));
// input.on('select', msg => console.log('select', msg.song));
// input.on('clock', () => console.log('clock'));
// input.on('start', () => console.log('start'))
// input.on('continue', () => console.log('continue'));
// input.on('stop', () => console.log('stop'));
// input.on('reset', () => console.log('reset'));
