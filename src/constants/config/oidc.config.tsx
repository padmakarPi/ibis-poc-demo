import { Log, UserManager } from 'oidc-client';

const OIDC_CONFIG = {
  authority: process.env.NEXT_PUBLIC_STS_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL || '',
  response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
  scope: process.env.NEXT_PUBLIC_CLIENT_SCOPE,
};

let userManager: any = {};
if (typeof window !== 'undefined') {
  if (window && window.location.origin) {
    OIDC_CONFIG.redirect_uri = `${window.location.origin}/auth/oidc-callback`;
  }
  userManager = new UserManager(OIDC_CONFIG);
  Log.logger = console;
  Log.level = Log.INFO;
}

export {
  OIDC_CONFIG,
  userManager,
};
