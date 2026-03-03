
import React, { useState } from 'react'

import StyledInput from './input'
import ThemeButton from './themeComponents/themeButton'
import Text, { TextTag } from './api/text'
import Link from './api/link'

interface LoginProps { }

export default function Login({ }: LoginProps) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  return <div style={styles.container}>
    <StyledInput
      type={'text'}
      name={'user'}
      value={user}
      changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
      placeholder={'Digite seu email'}
      style={styles.field}
    />
    <div style={styles.passwordContainer}>
      <StyledInput
        type={'password'}
        name={'password'}
        value={password}
        changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        style={styles.field}
      />
      <Link href=''>Esqueceu a senha?</Link>
    </div>
    <ThemeButton>Enviar</ThemeButton>

    <div style={styles.creationContainer}>
      <Text textTag={TextTag.P}>Primeira vez?</Text>
      <Link href=''>Criar conta</Link>
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
