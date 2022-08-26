import {
  KeyCloakModuleOptions,
  KeyCloakModuleAsyncOptions,
} from './@types/package';
import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { KeyCloakService } from './keycloak.service';

@Global()
@Module({
  providers: [KeyCloakService],
  exports: [KeyCloakService],
})
export class KeyCloakModule {
  public static forRoot(options: KeyCloakModuleOptions): DynamicModule {
    const provider = this.getOptionsProvider(options);
    return {
      module: KeyCloakModule,
      providers: [provider, this.keycloakProvider],
      exports: [provider, this.keycloakProvider],
    };
  }

  public static forRootAsync(
    options: KeyCloakModuleAsyncOptions,
  ): DynamicModule {
    const customOptions = this.getCustomOptions(options);

    return {
      module: KeyCloakModule,
      imports: options.imports || [],
      providers: [customOptions, this.keycloakProvider],
      exports: [customOptions, this.keycloakProvider],
    };
  }

  private static getCustomOptions(
    options: KeyCloakModuleAsyncOptions,
  ): Provider {
    return {
      provide: 'KEYCLOAK_ADMIN_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  private static keycloakProvider: Provider = {
    provide: KeyCloakService,
    useFactory: async (options: KeyCloakModuleOptions) => {
      const client = new KeyCloakService(options);
      await client.init();
      return client;
    },
    inject: ['KEYCLOAK_ADMIN_OPTIONS'],
  };

  private static getOptionsProvider(options: KeyCloakModuleOptions): Provider {
    return {
      provide: 'KEYCLOAK_ADMIN_OPTIONS',
      useValue: options,
    };
  }
}
