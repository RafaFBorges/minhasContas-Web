
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import StyledInput from './input/input'
import ThemeButton from './themeComponents/themeButton'
import { TextTag } from './api/text'
import Link from './api/link'
import { LanguageOption, useTranslate } from '../utils/hook/translateHook'
import { LoginResponse } from '@/comunication/login'
import ThemeText from './themeComponents/themeText'
import { useUser } from '../utils/hook/userHook'
import { usePopup } from '../utils/hook/usePopup'
import { PopupType } from '@/types/popupTypes'
import PasswordInput from './input/passwordInput'

interface LoginProps {
  registerHRef?: string;
  passwordForgetedFRef?: string;
  onSend: (user: string, password: string, onError?: () => void) => Promise<LoginResponse>
}

interface LoginTranslations {
  [KEY: string]: string;
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

  const { language, addKeys, getValue } = useTranslate()
  const { setPlataformUser } = useUser()
  const { addPopup } = usePopup()
  const router = useRouter()

  const [user, setUser] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [labelText, setLabelText] = useState<LoginTranslations>(translate())

  function onLoginError() {
    addPopup('Login Error', 'Invalid username or password. Please try again.', PopupType.ERROR)
  }

  function translate() {
    const translation = {} as LoginTranslations

    translation[EMAIL_PLACEHOLDER_KEY] = addKeys(EMAIL_PLACEHOLDER_KEY, [{ value: 'Digite seu email', lang: LanguageOption.PT_BR }, { value: 'Enter your email', lang: LanguageOption.EN },])
    translation[PASSWORD_PLACEHOLDER_KEY] = addKeys(PASSWORD_PLACEHOLDER_KEY, [{ value: 'Digite sua senha', lang: LanguageOption.PT_BR }, { value: 'Enter your password', lang: LanguageOption.EN },])
    translation[SEND_LOGIN_KEY] = addKeys(SEND_LOGIN_KEY, [{ value: 'Enviar', lang: LanguageOption.PT_BR }, { value: 'Send', lang: LanguageOption.EN },])
    translation[FORGOT_PASSWOR_KEY] = addKeys(FORGOT_PASSWOR_KEY, [{ value: 'Esqueceu a senha?', lang: LanguageOption.PT_BR }, { value: 'Forgot password?', lang: LanguageOption.EN },])
    translation[CREATE_ACCOUNT_KEY] = addKeys(CREATE_ACCOUNT_KEY, [{ value: 'Criar conta', lang: LanguageOption.PT_BR }, { value: 'Create account', lang: LanguageOption.EN },])
    translation[FIRST_TIME_KEY] = addKeys(FIRST_TIME_KEY, [{ value: 'Primeira vez?', lang: LanguageOption.PT_BR }, { value: 'First time?', lang: LanguageOption.EN },])

    return translation
  }

  useEffect(() => {
    setLabelText({
      [EMAIL_PLACEHOLDER_KEY]: getValue(EMAIL_PLACEHOLDER_KEY),
      [PASSWORD_PLACEHOLDER_KEY]: getValue(PASSWORD_PLACEHOLDER_KEY),
      [SEND_LOGIN_KEY]: getValue(SEND_LOGIN_KEY),
      [FORGOT_PASSWOR_KEY]: getValue(FORGOT_PASSWOR_KEY),
      [CREATE_ACCOUNT_KEY]: getValue(CREATE_ACCOUNT_KEY),
      [FIRST_TIME_KEY]: getValue(FIRST_TIME_KEY),
    })
  }, [language])

  return <div style={styles.container}>
    <StyledInput
      type={'text'}
      name={'user'}
      value={user}
      changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
      placeholder={labelText[EMAIL_PLACEHOLDER_KEY]}
      style={styles.field}
    />
    <div style={styles.passwordContainer}>
      <PasswordInput
        type={'password'}
        name={'password'}
        placeholder={labelText[PASSWORD_PLACEHOLDER_KEY]}
        value={password}
        changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        style={styles.field}
      />
      <Link href={passwordForgetedFRef}>{labelText[FORGOT_PASSWOR_KEY]}</Link>
    </div>
    <ThemeButton clickHandle={async () => {
      const token: LoginResponse = await onSend(user, password, onLoginError)

      if (token != null && token.id && token.name && token.user && token.token && token.expireTime) {
        await setPlataformUser(token.id, token.name, token.user, token.token, token.expireTime.toString())

        console.log('Login > [sucesses] user=' + token.id)
        router.push('/home')
      }
    }}
    >
      {labelText[SEND_LOGIN_KEY]}
    </ThemeButton>

    <div style={styles.creationContainer}>
      <ThemeText textTag={TextTag.P}>{labelText[FIRST_TIME_KEY]}</ThemeText>
      <Link href={registerHRef}>{labelText[CREATE_ACCOUNT_KEY]}</Link>
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    border: 'none',
    borderRadius: '8px',
    boxSizing: 'border-box',
    flexDirection: 'column',
    gap: '12px',
  },
  passwordContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  creationContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignSelf: 'center',
  },
}
