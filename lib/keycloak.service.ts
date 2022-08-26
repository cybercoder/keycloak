import { KeyCloakModuleOptions } from './@types/package';
import { Injectable } from '@nestjs/common';
import KeyCloakAdminClient from '@keycloak/keycloak-admin-client';
import { BaseClient, Issuer, TokenSet } from 'openid-client';

@Injectable()
export class KeyCloakService {
  public keyCloakAdminClient: KeyCloakAdminClient;
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private realmName!: string;
  public keyCloakClient!: BaseClient;

  constructor({
    baseUrl,
    realmName,
    clientId,
    clientSecret,
  }: KeyCloakModuleOptions) {
    this.baseUrl = baseUrl;
    this.realmName = realmName;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.keyCloakAdminClient = new KeyCloakAdminClient({
      baseUrl,
      realmName,
    });
  }

  async init() {
    await this.keyCloakAdminClient.auth({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      grantType: 'client_credentials',
    });

    const keycloakIssuer = await Issuer.discover(
      `${this.baseUrl}/realms/${this.realmName}`,
    );

    this.keyCloakClient = new keycloakIssuer.Client({
      client_id: this.clientId,

      token_endpoint_auth_method: 'none',
    });

    return setInterval(async () => {
      await this.keyCloakAdminClient.auth({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grantType: 'client_credentials',
      });
    }, 58 * 1000); // 58 seconds
  }

  public async getUserTokenSet({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<any> {
    return this.keyCloakClient.grant({
      client_secret: this.clientSecret,
      grant_type: 'password',
      username,
      password,
    });
  }

  public sendVerification() {
    return this.keyCloakAdminClient.users.sendVerifyEmail();
  }

  public listUsers() {
    return this.keyCloakAdminClient.users.find();
  }
}
