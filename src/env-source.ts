import { EnvValidationError } from './errors';

export interface EnvironmentSource {
  get(key: string): string | undefined;
}

export class NodeEnvironmentSource implements EnvironmentSource {
  get(key: string): string | undefined {
    return process?.env?.[key];
  }
}

export class ViteEnvironmentSource implements EnvironmentSource {
  private env: Record<string, string | undefined>;

  constructor() {
    this.env = this.getImportMetaEnv();
  }

  private getImportMetaEnv(): Record<string, string | undefined> {
    try {
      const meta = new Function('return typeof import.meta !== "undefined" ? import.meta : undefined')();
      return meta?.env || {};
    } catch {
      return {};
    }
  }

  get(key: string): string | undefined {
    return this.env[key];
  }
}

export class EnvironmentSourceFactory {
  static create(): EnvironmentSource {
    if (typeof process !== 'undefined' && process.env) {
      return new NodeEnvironmentSource();
    }
    try {
      const viteSource = new ViteEnvironmentSource();
      const hasViteEnv = Object.keys(viteSource['env']).length > 0;
      if (hasViteEnv) {
        return viteSource;
      }
    } catch {
    }

    throw new EnvValidationError(
      'No environment variable source found. Expected process.env or import.meta.env'
    );
  }
}
