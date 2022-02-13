import { exec } from "../helpers/exec";
import { mediaChannelType } from "../types";

export const setMuteState = async (mediaChannel: mediaChannelType, muted: boolean) => {

  const mutedState = muted ? 'on' : 'off';
  console.log(`Setting ${mediaChannel.index} muted state to ${mutedState}`);

  try {
    await exec(`pactl set-${mediaChannel.type}-mute ${mediaChannel.index} toggle`);
  } catch (error) {
    console.error(error);
  }
};