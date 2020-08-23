import detectPort from 'detect-port';
import execa, { ExecaChildProcess } from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { AxiosInstance } from 'axios';
import kubectl from './kubectl';
import { createAxios } from './axios';

export default class KubeNuke {
  private api: AxiosInstance;

  defaultPort = 8001;

  options: KubeNukeOptions;

  constructor(options: Partial<KubeNukeOptions>) {
    this.options = {
      debug: false,
      timeout: 10000,
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
    let { apiUrl } = this.options;
    if (!apiUrl) {
      const port = await detectPort(this.defaultPort);
      p = execa('kubectl', ['proxy', '--port', port.toString()]);
      if (this.options.debug) p.stdout?.pipe(process.stdout);
      const relativeServerPath = (
        await this.getActiveCluster(this.options.cluster)
      )?.server.replace(/https?:\/\/[^\/]*\//g, '');
      apiUrl = `http://localhost:${port}/${relativeServerPath}`;
      await new Promise((r) => setTimeout(r, 500));
    }
    await new Promise(async (resolve, reject) => {
      try {
        setTimeout(resolve, this.options.timeout);
        resolve(
          await kubectl(['delete', 'ns', name], { json: false, pipe: true })
        );
      } catch (err) {
        reject(err);
      }
    });
    const res = await this.api.put(`/api/v1/namespaces/${name}/finalize`, ns, {
      baseURL: apiUrl
    });
    if (this.options.debug) console.log(res.data);
    p?.kill();
    console.log(`nuked namespace '${name}'`);
  }

  async getActiveCluster(
    clusterName?: string
  ): Promise<KubeCluster | undefined> {
    const kubeconfigPath = path.resolve(os.homedir(), '.kube/config');
    const kubeconfig = yaml.safeLoad(
      (await fs.readFile(kubeconfigPath)).toString()
    ) as KubeConfig;
    if (!clusterName) {
      const kubectx = kubeconfig?.['current-context'];
      const context = (kubeconfig?.contexts || []).find(
        (context: KubeContextRecord) => context.name === kubectx
      )?.context;
      clusterName = context?.cluster;
    }
    const cluster = (kubeconfig?.clusters || []).find(
      (cluster: KubeClusterRecord) => cluster.name === clusterName
    )?.cluster;
    return cluster;
  }
}

export interface KubeConfig {
  clusters: KubeClusterRecord[];
  contexts: KubeContextRecord[];
  'current-context': string;
  [key: string]: any;
}

export interface KubeCluster {
  'certificate-authority-data'?: string;
  server: string;
}

export interface KubeClusterRecord {
  cluster: KubeCluster;
  name: string;
}

export interface KubeContextRecord {
  context: KubeContext;
  name: string;
}

export interface KubeContext {
  cluster: string;
  user: string;
  namespace?: string;
}

export interface KubeNukeOptions {
  apiUrl?: string;
  cluster?: string;
  debug: boolean;
  timeout: number;
  token?: string;
}
