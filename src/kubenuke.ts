import detectPort from 'detect-port';
import execa, { ExecaChildProcess } from 'execa';
import { AxiosInstance } from 'axios';
import kubectl from './kubectl';
import { createAxios } from './axios';

export default class KubeNuke {
  private api: AxiosInstance;

  options: KubeNukeOptions;

  constructor(options: Partial<KubeNukeOptions>) {
    this.options = {
      apiUrl: 'http://127.0.0.1:8001',
      debug: false,
      ...options
    };
    const axios = createAxios({ debug: this.options.debug });
    this.api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        ...(this.options.token
          ? { Authorization: `Bearer ${this.options.token}` }
          : {})
      },
      baseURL: this.options.apiUrl
    });
  }

  async ns(name: string) {
    const ns = await kubectl(['get', 'ns', name]);
    ns.spec.finalizers = [];
    let p: ExecaChildProcess | null = null;
    if (this.options.apiUrl === 'http://127.0.0.1:8001') {
      const port = await detectPort(8001);
      if (port === 8001) {
        p = execa('kubectl', ['proxy']);
        p.stdout?.pipe(process.stdout);
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    const res = await this.api.put(`/api/v1/namespaces/${name}/finalize_`, ns);
    if (this.options.debug) console.log(res.data);
    p?.kill();
  }
}

export interface KubeNukeOptions {
  apiUrl: string;
  debug: boolean;
  token?: string;
}
