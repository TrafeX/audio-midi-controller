export type mediaTypeType = 'sink' | 'sink-input' | 'source';

export type mediaChannelType = {
  index: string,
  volume: number,
  muted: boolean,
  name: string,
  type: mediaTypeType,
}

export type mediaChannelsType = {
  [key: number]: mediaChannelType;
}