import { exec } from "../helpers/exec";
import { mediaChannelType } from "../types";

export const toggleMuteState = async (mediaChannel: mediaChannelType) => {

  console.log(`Setting ${mediaChannel.index} muted state`);

  try {
    await exec(`pactl set-${mediaChannel.type}-mute ${mediaChannel.index} toggle`);
  } catch (error) {
    console.error(error);
  }
};