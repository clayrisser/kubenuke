import execa from 'execa';

const logger = console;

export interface KubectlOptions {
  dryrun: boolean;
  json: boolean;
  pipe: boolean;
}

export default async function kubectl(
  args: string[],
  options: Partial<KubectlOptions> = {}
): Promise<any> {
  options = {
    dryrun: false,
    json: true,
    pipe: false,
    ...options
  };
  args = [...args, ...(options.json ? ['-o', 'json'] : [])];
  const command = `kubectl ${args.join(' ')}`;
  if (options.dryrun) {
    logger.info(command);
    return command;
  }
  const p = execa('sh', ['-c', command], { stdio: 'pipe' });
  if (options.pipe) p.stdout?.pipe(process.stdout);
  const { stdout } = await p;
  try {
    return JSON.parse(stdout);
  } catch (err) {
    if (!options.pipe) logger.info(stdout);
    return stdout;
  }
}
