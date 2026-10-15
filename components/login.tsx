import React from 'react'
import { useRouter } from 'next/navigation'

import { useTheme } from '../utils/hook/themeHook'
import { LanguageOption, useTranslate } from '../utils/hook/translateHook'
import { LoginResponse } from '@/comunication/login'
import { useUser } from '../utils/hook/userHook'
import { LoginForm, usePopup, PopupType } from '@rafafborges/componentes'

interface LoginProps {
  registerHRef?: string;
  passwordForgetedFRef?: string;
  onSend: (user: string, password: string, onError?: () => void) => Promise<LoginResponse>
}

export default function Login({
  registerHRef = '',
  passwordForgetedFRef = '',
  onSend
}: LoginProps) {
  const EMAIL_PLACEHOLDER_KEY = 'Login.EmailPlaceHolder'
  const PASSWORD_PLACEHOLDER_KEY = 'Login.PasswordPlaceHolder'
  const SEND_LOGIN_KEY = 'Login.SendLoogin'
  const FORGOT_PASSWOR_KEY = 'Login.ForgotPassWord'
  const FIRST_TIME_KEY = 'Login.FirstTime'
  const CREATE_ACCOUNT_KEY = 'Login.CreateAccount'

  const { config } = useTheme()
  const { addKeys } = useTranslate()
  const { setPlataformUser } = useUser()
  const { addPopup } = usePopup()
  const router = useRouter()

  function onLoginError() {
    addPopup('Login Error', 'Invalid username or password. Please try again.', PopupType.ERROR)
  }

  async function handleSubmit(user: string, password: string) {
    const token: LoginResponse = await onSend(user, password, onLoginError)
    if (token != null && token.id && token.name && token.user && token.token && token.expiresAt) {
      await setPlataformUser(token.id, token.name, token.user, token.token, token.expiresAt.toString())

      console.log('Login > [sucesses] user=' + token.id)
      router.push('/home')
    }
  }

  return <LoginForm
    registerHRef={registerHRef}
    passwordForgetedHRef={passwordForgetedFRef}
    onSubmit={handleSubmit}
    color={config.color}
    fontColor={config.fontColor}
    disabledFontColor={config.disabledFontColor}
    labels={{
      emailPlaceholder: addKeys(EMAIL_PLACEHOLDER_KEY, [{ value: 'Digite seu email', lang: LanguageOption.PT_BR }, { value: 'Enter your email', lang: LanguageOption.EN },]),
      passwordPlaceholder: addKeys(PASSWORD_PLACEHOLDER_KEY, [{ value: 'Digite sua senha', lang: LanguageOption.PT_BR }, { value: 'Enter your password', lang: LanguageOption.EN },]),
      send: addKeys(SEND_LOGIN_KEY, [{ value: 'Enviar', lang: LanguageOption.PT_BR }, { value: 'Send', lang: LanguageOption.EN },]),
      forgotPassword: addKeys(FORGOT_PASSWOR_KEY, [{ value: 'Esqueceu a senha?', lang: LanguageOption.PT_BR }, { value: 'Forgot password?', lang: LanguageOption.EN },]),
      firstTime: addKeys(FIRST_TIME_KEY, [{ value: 'Primeira vez?', lang: LanguageOption.PT_BR }, { value: 'First time?', lang: LanguageOption.EN },]),
      createAccount: addKeys(CREATE_ACCOUNT_KEY, [{ value: 'Criar conta', lang: LanguageOption.PT_BR }, { value: 'Create account', lang: LanguageOption.EN },]),
    }}
  />
}
