import { exec } from "../helpers/exec";
import { mediaPlayerStatusType } from "../types";


export const fetchMediaPlayerStatus = async (): Promise<mediaPlayerStatusType> => {
  try {
    const { stdout } = await exec('playerctl status');
    return stdout.toLowerCase().trim() as mediaPlayerStatusType;
  } catch (e) {
    console.error(e);
    return 'stopped';
  }
}
