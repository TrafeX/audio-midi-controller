import { fetchMediaChannels } from './media/fetchMediaChannels';
import { fetchMediaPlayerStatus } from './mediaplayer/fetchMediaPlayerStatus';
import { updateMediaPlayer } from './mediaplayer/updateMediaPlayer';
import { listenToMidi } from './midi/listenToMidi';
import { updateMidiChannels } from './midi/updateMidiChannels';
import { mediaChannels, setMediaChannels } from './state/mediaChannels';


(() => {
  listenToMidi(mediaChannels);

  setInterval(async () => {
    setMediaChannels(await fetchMediaChannels());

    updateMidiChannels(mediaChannels);

    updateMediaPlayer(await fetchMediaPlayerStatus());
  }, 1000);
})();