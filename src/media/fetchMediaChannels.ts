import { exec } from '../helpers/exec';
import { mediaChannelsType, mediaTypeType } from '../types';

const sinkInputsRegex = /index: ([0-9]+).*?state: ([a-z]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no).*?application\.name = "([a-z_ -]+)"/gis;
const sinksRegex = /\* index: ([0-9]+).*?state: ([a-z]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no).*?(?:device\.description|device\.product\.name) = "([a-z_ -]+)"/gis;
const inputSourcesRegex = /\* index: ([0-9]+).*?state: ([a-z]+).*?volume:.*?([0-9]+)%.*?muted: (yes|no).*?device\.description = "([a-z_ -]+)"/gis;

export const fetchMediaChannels = async (): Promise<mediaChannelsType> => {

  const { stdout: rawSinks } = await exec('pacmd list-sinks');
  const sinksIndices = [...rawSinks.matchAll(sinksRegex)].map(match => {
    return {
      index: match[1],
      state: match[2],
      volume: Number(match[3]),
      muted: match[4] === 'yes',
      name: match[5],
      type: 'sink' as mediaTypeType,
    };
  });

  const { stdout: rawSinkInputs } = await exec('pacmd list-sink-inputs');
  const sinkInputIndices = [...rawSinkInputs.matchAll(sinkInputsRegex)].map(match => {
    return {
      index: match[1],
      state: match[2],
      volume: Number(match[3]),
      muted: match[4] === 'yes',
      name: match[5],
      type: 'sink-input' as mediaTypeType,
    };
  });

  const { stdout: rawInputSources } = await exec('pacmd list-sources');
  const inputSourcesIndices = [...rawInputSources.matchAll(inputSourcesRegex)].map(match => {
    return {
      index: match[1],
      state: match[2],
      volume: Number(match[3]),
      muted: match[4] === 'yes',
      name: match[5],
      type: 'source' as mediaTypeType,
    };
  });

  const allChannels = [...sinksIndices, ...sinkInputIndices];
  allChannels[7] = { ...inputSourcesIndices[0] };
  return allChannels;
};