import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

export interface SocialAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    photo: string | null;
  };
  error?: string;
}

// Google OAuth Configuration
// NOTE: You need to configure these in your Google Cloud Console
// and add them to your app.json / app.config.js
const GOOGLE_OAUTH_CONFIG = {
  // For web testing, you can use localhost
  // For production, replace with your actual redirect URI
  redirectUri: AuthSession.makeRedirectUri({
    scheme: "pupsense",
    path: "auth",
  }),
  // Replace with your Google Client ID from Google Cloud Console
  // Web: Get from https://console.cloud.google.com/apis/credentials
  // iOS: Add iOS OAuth 2.0 Client ID
  // Android: Add Android OAuth 2.0 Client ID
  clientId: Platform.select({
    web: "909160715250-1v7k6t355drgr0ra99132os5e9pts7hn.apps.googleusercontent.com",
    ios: "YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com",
    android: "YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  }),
  scopes: ["profile", "email"],
};

/**
 * Sign in with Google using OAuth 2.0
 */
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  try {
    const discovery = {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    };

    const authRequest = new AuthSession.AuthRequest({
      clientId: GOOGLE_OAUTH_CONFIG.clientId || "",
      scopes: GOOGLE_OAUTH_CONFIG.scopes,
      redirectUri: GOOGLE_OAUTH_CONFIG.redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    });

    const result = await authRequest.promptAsync(discovery);

    if (result.type === "success") {
      // Exchange code for token
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_OAUTH_CONFIG.clientId || "",
          code: result.params.code,
          redirectUri: GOOGLE_OAUTH_CONFIG.redirectUri,
        },
        discovery
      );

      // Fetch user info
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      const userInfo = await userInfoResponse.json();

      return {
        success: true,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
        },
      };
    } else if (result.type === "cancel") {
      return {
        success: false,
        error: "User cancelled the sign-in flow",
      };
    } else {
      return {
        success: false,
        error: "Authentication failed",
      };
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Sign in with Apple (iOS 13+ and web)
 */
export async function signInWithApple(): Promise<SocialAuthResult> {
  try {
    // Check if Apple Authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();

    if (!isAvailable) {
      return {
        success: false,
        error: "Apple Sign In is not available on this device",
      };
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Extract user information
    const { user, email, fullName } = credential;

    let displayName = null;
    if (fullName?.givenName || fullName?.familyName) {
      displayName = [fullName?.givenName, fullName?.familyName]
        .filter(Boolean)
        .join(" ");
    }

    return {
      success: true,
      user: {
        id: user,
        email: email || null,
        name: displayName,
        photo: null, // Apple doesn't provide photos
      },
    };
  } catch (error: any) {
    // Handle different error codes
    if (error.code === "ERR_CANCELED") {
      return {
        success: false,
        error: "User cancelled the sign-in flow",
      };
    }

    console.error("Apple Sign-In Error:", error);
    return {
      success: false,
      error: error.message || "Apple Sign In failed",
    };
  }
}

/**
 * Check if Apple Sign In is available on the current device
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  return await AppleAuthentication.isAvailableAsync();
}
