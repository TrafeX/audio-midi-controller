
export const volumePercentageToEncoder = (volume: number): number => Math.round(volume / 100 * 127);
export const volumeEncoderValueToPercentage = (volume:number): number => Math.round(volume / 127 * 100);