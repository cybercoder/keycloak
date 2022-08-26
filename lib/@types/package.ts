import { ModuleMetadata } from '@nestjs/common';

export interface KeyCloakModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<KeyCloakModuleOptions> | KeyCloakModuleOptions;
}

export interface KeyCloakModuleOptions {
  baseUrl: string;
  realmName: string;
  clientId: string;
  clientSecret: string;
}
