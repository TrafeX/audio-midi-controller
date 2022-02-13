import { exec } from "../helpers/exec";
import { mediaChannelType } from "../types";

export const setVolume = async (mediaChannel: mediaChannelType, volume: number) => {
  console.log(`Setting ${mediaChannel.index} to ${volume}%`);

  try {
    await exec(`pactl set-${mediaChannel.type}-volume ${mediaChannel.index} ${volume}%`);
  } catch (error) {
    console.error(error);
  }
};