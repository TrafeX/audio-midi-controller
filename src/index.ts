import { fetchMediaChannels } from './media/fetchMediaChannels';
import { listenToMidi } from './midi/listenToMidi';
import { updateMidiChannels } from './midi/updateMidiChannels';
import { mediaChannels, setMediaChannels } from './state/mediaChannels';


(() => {
  listenToMidi(mediaChannels);

  setInterval(async () => {
    setMediaChannels(await fetchMediaChannels());

    updateMidiChannels(mediaChannels);
  }, 1000);
})();