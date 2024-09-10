import {jwtDecode} from 'jwt-decode';

export const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Adjust based on your token's structure
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
