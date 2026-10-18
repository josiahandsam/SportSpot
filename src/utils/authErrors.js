/**
 * Map Firebase Auth error codes to user-friendly messages
 * @param {Object} error 
 * @returns {string}
 */
export const getAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials and try again.';

    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Password should be at least 8 characters long.';

    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';

    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access has been temporarily restricted; please try again later or reset your password.';

    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';

    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in the Firebase Console. Please enable Email/Password under Authentication > Sign-in method.';

    case 'auth/requires-recent-login':
      return 'This action requires recent authentication. Please log in again.';

    case 'auth/missing-password':
      return 'Please enter your password.';

    case 'auth/missing-email':
      return 'Please enter your email address.';

    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'The Firebase API key is invalid or restricted. Please verify the Web API Key in Firebase Console Project Settings and ensure Identity Toolkit API is allowed under Google Cloud API restrictions.';

    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. The Google popup window was closed before completion.';

    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.';

    case 'auth/cancelled-popup-request':
      return 'Only one sign-in request can be processed at a time.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email using a different sign-in method. Please log in with your email and password.';

    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google Sign-In in Firebase Console. Please add your current domain under Authentication > Settings > Authorized domains.';

    default:
      return error.message || 'An error occurred during authentication. Please try again.';
  }
};
