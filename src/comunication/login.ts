import { handlePOST, LOGIN_ENDPOINT } from './ApiResthandler'

export interface LoginRequest {
  user: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expireTime: Date;
}

export const RequestLogin = async (user: string, password: string): Promise<LoginResponse> => {
  if (user == '' || password == '') {
    const expiredTime = new Date()
    expiredTime.setMinutes(expiredTime.getMinutes() - 1)

    return {
      token: '',
      expireTime: expiredTime//response.expireTime
    }
  }

  const request: LoginRequest = {
    user: user,
    password: password
  }

  const response = await handlePOST(LOGIN_ENDPOINT, request)
  const expireTime = new Date()
  expireTime.setMinutes(expireTime.getMinutes() + 1)

  return {
    token: response.token,
    expireTime: expireTime//response.expireTime
  }
}
