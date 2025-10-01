
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  dayOfBirth: string;
  phoneNumber: string;
  username: string;
  hashedPassword: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  username: string;
  roleId: number;
  avt : string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userInfo: UserInfo;
}

export interface SignUpResponse {
  message: string;
}
