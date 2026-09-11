export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ActivateKeyRequest {
  key: string;
  deviceId: string;
}

export interface ActivateKeyResponse {
  success: boolean;
  message: string;
  token?: string;
  product?: {
    name: string;
    downloadUrl: string;
  };
}
