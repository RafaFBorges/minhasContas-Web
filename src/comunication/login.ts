import { handlePOST, LOGIN_ENDPOINT } from './ApiResthandler'

export interface LoginRequest {
  user: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expireTime: Date;
  user?: string;
  id?: number;
  name?: string;
}

export const RequestLogin = async (user: string, password: string, onError: () => void = () => { }): Promise<LoginResponse> => {
  if (user == '' || password == '') {
    const expiredTime = new Date()
    expiredTime.setMinutes(expiredTime.getMinutes() - 1)

    return {
      token: '',
      expireTime: expiredTime
    }
  }

  const request: LoginRequest = {
    user: user,
    password: password
  }

  let token: LoginResponse
  try {
    const response = await handlePOST(LOGIN_ENDPOINT, request)

    const expireTime = new Date()
    expireTime.setMinutes(expireTime.getMinutes() + 1)

    token = {
      token: response.token,
      expireTime: response.expireTime,
      user: response.user,
      id: response.id,
      name: response.name
    }
  } catch (error) {
    console.log('RequestLogin > error=' + error)

    if (onError != null)
      onError()

    token = {
      token: '',
      expireTime: new Date(NaN),
      user: '',
      id: -1,
      name: ''
    }
  }

  return token
}
