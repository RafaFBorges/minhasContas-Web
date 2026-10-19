import { handlePOST, LOGIN_ENDPOINT } from './ApiResthandler'

export interface LoginRequest {
  user: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: Date;
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
      expiresAt: expiredTime
    }
  }

  const request: LoginRequest = {
    user: user,
    password: password
  }

  let token: LoginResponse
  try {
    const response: LoginResponse = await handlePOST<LoginResponse>(LOGIN_ENDPOINT, request)

    token = {
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
      id: response.id,
      name: response.name
    }
  } catch (error) {
    console.log('RequestLogin > error=' + JSON.stringify(error, null, 2))

    if (onError != null)
      onError()

    token = {
      token: '',
      expiresAt: new Date(NaN),
      user: '',
      id: -1,
      name: ''
    }
  }

  return token
}
