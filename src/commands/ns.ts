import { Command, flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import KubeNuke from '../kubenuke';

export default class NS extends Command {
  static description = 'nuke kubernetes namespace';

  static examples = ['$ kubenuke ns some-ns'];

  static flags: Input<any> = {
    'api-url': flags.string({ char: 'a', required: false }),
    token: flags.string({ char: 't', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'NS', required: true }];

  async run() {
    const { flags, args } = this.parse(NS);
    const kubeNuke = new KubeNuke({
      ...(flags.debug ? { debug: flags.debug } : {}),
      ...(flags.token ? { token: flags.token } : {}),
      ...(flags['api-url'] ? { apiUrl: flags['api-url'] } : {})
    });
    await kubeNuke.ns(args.NS);
  }
}
