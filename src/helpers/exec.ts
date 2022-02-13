
import { promisify } from 'util';
import { exec as syncExec } from 'child_process';

export const exec = promisify(syncExec);