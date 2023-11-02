'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { userManager } from '@/constants/config/oidc.config';
import AuthService from '@/services/auth.service';
import { CookieService } from '@/services/cookie.service';
import { setAuthState } from '@/redux/reducers/auth.reducer';

function CallbackPage() {
  const router = useRouter();
  const authService = new AuthService();
  const cookieService = new CookieService();
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      getUserData();
    });
  }, []);

  useEffect(() => {
    if (email) {
      getMSTSToken(email);
    }
  }, [email]);

  const getUserData = async () => {
    const userData = await authService.getUser();
    if (userData && userData.access_token && userData.profile && userData.profile.email) {
      setEmail(userData.profile.email);
      setUserDataToCookies(userData);
      dispatch(setAuthState({
        isAuthenticated: true,
        email: userData.profile.email,
        name: userData.profile.name,
        userType: userData.profile.UserType,
        sid: userData.profile.sid,
        access_token: userData.access_token,
        expires_at: userData.expires_at,
        profile: (userData?.profile?.Portals && JSON.parse(userData?.profile?.Portals)) ? JSON.parse(userData?.profile?.Portals) : [],
      }));
    }
  };

  const setUserDataToCookies = (user: any) => {
    const cookieStoreData = {
      access_token: user?.access_token,
      expires_at: user?.expires_at,
      id_token: user?.id_token,
      refresh_token: user?.refresh_token,
      session_state: user?.session_state,
      token_type: user?.token_type,
      state: user?.state,
      scope: user?.scope,
      profile: user?.profile,
    };
    for (const [key, value] of Object.entries(cookieStoreData)) {
      if (value) {
        cookieService.setCookie(key, JSON.stringify(value));
      }
    }
  };

  const getMSTSToken = async (email: string) => {
    await authService.loginAuthorization(email);
    router.push('/home');
  };

  return <div>Processing OIDC callback...</div>;
}

export default CallbackPage;
