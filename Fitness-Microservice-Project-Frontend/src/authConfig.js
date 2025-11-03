export const authConfig = {
  clientId: `${import.meta.env.VITE_clientId}`,
  authorizationEndpoint: `${import.meta.env.VITE_authorizationEndpoint}`,
  tokenEndpoint: `${import.meta.env.VITE_tokenEndpoint}`,
  redirectUri: `${import.meta.env.VITE_redirectUri}`,
  scope: `${import.meta.env.VITE_scope}`,
  onRefreshTokenExpire: (event) => event.logIn(),
}