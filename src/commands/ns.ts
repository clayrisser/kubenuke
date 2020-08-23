import readline from 'readline';
import { Command, flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import KubeNuke from '../kubenuke';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export default class NS extends Command {
  static description = 'nuke kubernetes namespace';

  static examples = ['$ kubenuke ns some-ns'];

  static flags: Input<any> = {
    'api-url': flags.string({ char: 'a', required: false }),
    debug: flags.boolean({ char: 'd', required: false }),
    timeout: flags.string({ char: 't', required: false }),
    yes: flags.boolean({ char: 'y', required: false }),
    token: flags.string({ required: false })
  };

  static args = [{ name: 'NS', required: true }];

  async run() {
    const { flags, args } = this.parse(NS);
    const timeout = flags.timeout || 10000;
    const shouldContinue =
      flags.yes ||
      (await new Promise((resolve) => {
        rl.question(
          `This will potentially result in orphaned resources if the namespace is not cleaned up after ${timeout}ms

Do you want to continue? [y|N] `,
          (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
          }
        );
      }));
    if (!shouldContinue) {
      console.log('aborting');
      process.exit(1);
    }
    const kubeNuke = new KubeNuke({
      ...(flags.debug ? { debug: flags.debug } : {}),
      ...(flags.token ? { token: flags.token } : {}),
      ...(flags['api-url'] ? { apiUrl: flags['api-url'] } : {}),
      timeout
    });
    await kubeNuke.ns(args.NS);
  }
}
