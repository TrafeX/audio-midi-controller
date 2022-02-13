import { fetchMediaChannels } from './media/fetchMediaChannels';
import { initializeMidi } from './midi/initializeMidi';
import { listenToMidi } from './midi/listenToMidi';
import { updateMidiChannels } from './midi/updateMidiChannels';
import { mediaChannels, setMediaChannels } from './state/mediaChannels';


(() => {
  initializeMidi();

  listenToMidi(mediaChannels);

  setInterval(async () => {
    setMediaChannels(await fetchMediaChannels());

    updateMidiChannels(mediaChannels);
  }, 1000);
})();