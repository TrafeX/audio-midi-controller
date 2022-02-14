import { exec } from "../helpers/exec";

export const playOrPauseMedia = async (): Promise<void> => {
  try {
    await exec('playerctl play-pause');
  } catch (error) {
    console.error(error);
  }
};

export const stopMedia = async (): Promise<void> => {
  try {
    await exec('playerctl stop');
  } catch (error) {
    console.error(error);
  }
};

export const nextMedia = async (): Promise<void> => {
  try {
    await exec('playerctl next');
  } catch (error) {
    console.error(error);
  }
};

export const previousMedia = async (): Promise<void> => {
  try {
    await exec('playerctl previous');
  } catch (error) {
    console.error(error);
  }
};