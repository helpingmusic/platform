import { Injectable } from '@nestjs/common';
import { EnvConfig } from 'src/shared/config/env-config.interface';

@Injectable()
export class ConfigService {
  private readonly env: EnvConfig;

  constructor() {
    this.env = (process.env as any) as EnvConfig;
  }

  get(key: keyof EnvConfig): string {
    return this.env[key];
  }

}
