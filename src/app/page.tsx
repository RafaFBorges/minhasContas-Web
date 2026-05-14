'use client'

import React from 'react'

import Login from '../../components/login'
import { RequestLogin } from '@/comunication/login'
import { REGISTRATION_PATH } from '../../utils/DataConstants'


export default function Home() {
  return <main style={styles.page}>
    <Login
      registerHRef={REGISTRATION_PATH}
      passwordForgetedFRef={''}
      onSend={RequestLogin}
    />
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '0em 1em 1em 1rem',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    boxSizing: 'border-box',
  },
}
