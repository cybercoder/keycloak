import { KeyCloakService } from './keycloak.service';
describe('test', () => {
  let keyCloakService: KeyCloakService;
  beforeEach(async () => {
    keyCloakService = new KeyCloakService({
      baseUrl: 'http://localhost:8080',
      realmName: 'master',
      clientId: 'investee',
      clientSecret: 'o4v0y0CRNihb338psgXNmy3DUjfKLVVq',
    });
    await keyCloakService.init();
  });

  it('get tokens for user', async () => {
    console.log(
      await keyCloakService.getUserTokenSet({
        username: 'admin',
        password: 'admin',
      }),
    );
  });
});
