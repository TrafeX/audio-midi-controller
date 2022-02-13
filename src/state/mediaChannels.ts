import { mediaChannelsType } from "../types";

let mediaChannelsState: mediaChannelsType = [];

export const mediaChannels = (): mediaChannelsType => {
  return mediaChannelsState;
};

export const setMediaChannels = (mediaChannels: mediaChannelsType) => {
  mediaChannelsState = mediaChannels;
};