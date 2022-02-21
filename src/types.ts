export type mediaTypeType = 'sink' | 'sink-input' | 'source';

export type mediaChannelType = {
  index: string,
  state: string,
  volume: number,
  muted: boolean,
  name: string,
  type: mediaTypeType,
}

export type mediaChannelsType = mediaChannelType[];

export type mediaPlayerStatusType = 'playing' | 'paused' | 'stopped';