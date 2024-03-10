// utils/auth.js

export function isTokenExpired(token) {
  if (!token) {
    return true; // Token is not present
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();

    return currentTime > expirationTime;
  } catch (error) {
    return true; // Invalid token or unable to parse
  }
}
