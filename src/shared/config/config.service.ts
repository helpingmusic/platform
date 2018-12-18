import { Injectable } from '@nestjs/common';
import { EnvConfig } from 'src/shared/config/env-config.interface';
import googleServiceAccountConfig from './helpingmusic.sa.json';

@Injectable()
export class ConfigService {
  private readonly env: EnvConfig;

  constructor() {
    this.env = (process.env as any) as EnvConfig;
  }

  get(key: keyof EnvConfig): string {
    return this.env[key];
  }

  getGoogleSA() {
    return googleServiceAccountConfig;
  }

}
