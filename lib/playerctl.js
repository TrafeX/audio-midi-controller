import { promisify } from 'util';
import { exec as syncExec } from 'child_process';

const exec = promisify(syncExec);

export const fetchPlayerStatus = async () => {
  try {
    const { stdout } = await exec('playerctl status');
    return stdout.toLowerCase().trim();
  } catch (e) {
    console.error(e);
    return null;
  }
}
