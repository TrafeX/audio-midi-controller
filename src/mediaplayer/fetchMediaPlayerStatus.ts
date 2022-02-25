import { exec } from "../helpers/exec";
import { mediaPlayerStatusType } from "../types";


export const fetchMediaPlayerStatus = async (): Promise<mediaPlayerStatusType|null> => {
  try {
    const { stdout } = await exec('playerctl status');
    return stdout.toLowerCase().trim() as mediaPlayerStatusType;
  } catch (e) {
    return null;
  }
};
