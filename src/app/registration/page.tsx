'use client'

import React, { useEffect, useState } from 'react'
import ThemeButton from '../../../components/themeComponents/themeButton'
import ThemeText from '../../../components/themeComponents/themeText'
import { TextTag } from '../../../components/api/text'
import FrameworkInput from '../../../components/framework/frameworkInput'
import { LanguageOption, useTranslate } from '../../../utils/hook/translateHook'

interface RegistrationTranslations {
  [KEY: string]: string;
}

export default function Registration() {
  const TITLE_KEY = 'Registration.Title'
  const SUBTITLE_KEY = 'Registration.Subtitle'
  const PERSONAL_DATA_KEY = 'Registration.PersonalData'
  const FIRST_NAME_KEY = 'Registration.FirstName'
  const LAST_NAME_KEY = 'Registration.LastName'
  const EMAIL_KEY = 'Registration.Email'
  const PHONE_KEY = 'Registration.Phone'
  const BIRTHDATE_KEY = 'Registration.Birthdate'
  const ACCESS_KEY = 'Registration.Access'
  const PASSWORD_KEY = 'Registration.Password'
  const CONFIRM_PASSWORD_KEY = 'Registration.ConfirmPassword'
  const SUBMIT_KEY = 'Registration.Submit'
  const ERROR_REQUIRED_KEY = 'Registration.ErrorRequired'
  const ERROR_PASSWORD_MATCH_KEY = 'Registration.ErrorPasswordMatch'
  const ERROR_PASSWORD_MIN_KEY = 'Registration.ErrorPasswordMin'
  const SUCCESS_KEY = 'Registration.Success'
  const PH_FIRST_NAME_KEY = 'Registration.PlaceholderFirstName'
  const PH_LAST_NAME_KEY = 'Registration.PlaceholderLastName'
  const PH_EMAIL_KEY = 'Registration.PlaceholderEmail'
  const PH_PHONE_KEY = 'Registration.PlaceholderPhone'
  const PH_PASSWORD_KEY = 'Registration.PlaceholderPassword'
  const PH_CONFIRM_PASSWORD_KEY = 'Registration.PlaceholderConfirmPassword'

  const { language, addKey, getValue } = useTranslate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [translation, setTranslation] = useState<RegistrationTranslations>(translate())

  function translate(): RegistrationTranslations {
    const tr = {} as RegistrationTranslations

    addKey(TITLE_KEY, 'Criar conta', LanguageOption.PT_BR)
    tr[TITLE_KEY] = addKey(TITLE_KEY, 'Create account', LanguageOption.EN)

    addKey(SUBTITLE_KEY, 'Preencha os dados abaixo para se cadastrar.', LanguageOption.PT_BR)
    tr[SUBTITLE_KEY] = addKey(SUBTITLE_KEY, 'Fill in the details below to register.', LanguageOption.EN)

    addKey(PERSONAL_DATA_KEY, 'Dados pessoais', LanguageOption.PT_BR)
    tr[PERSONAL_DATA_KEY] = addKey(PERSONAL_DATA_KEY, 'Personal data', LanguageOption.EN)

    addKey(FIRST_NAME_KEY, 'Nome', LanguageOption.PT_BR)
    tr[FIRST_NAME_KEY] = addKey(FIRST_NAME_KEY, 'First name', LanguageOption.EN)

    addKey(LAST_NAME_KEY, 'Sobrenome', LanguageOption.PT_BR)
    tr[LAST_NAME_KEY] = addKey(LAST_NAME_KEY, 'Last name', LanguageOption.EN)

    addKey(EMAIL_KEY, 'Email', LanguageOption.PT_BR)
    tr[EMAIL_KEY] = addKey(EMAIL_KEY, 'Email', LanguageOption.EN)

    addKey(PHONE_KEY, 'Telefone', LanguageOption.PT_BR)
    tr[PHONE_KEY] = addKey(PHONE_KEY, 'Phone', LanguageOption.EN)

    addKey(BIRTHDATE_KEY, 'Data de nascimento', LanguageOption.PT_BR)
    tr[BIRTHDATE_KEY] = addKey(BIRTHDATE_KEY, 'Date of birth', LanguageOption.EN)

    addKey(ACCESS_KEY, 'Acesso', LanguageOption.PT_BR)
    tr[ACCESS_KEY] = addKey(ACCESS_KEY, 'Access', LanguageOption.EN)

    addKey(PASSWORD_KEY, 'Senha', LanguageOption.PT_BR)
    tr[PASSWORD_KEY] = addKey(PASSWORD_KEY, 'Password', LanguageOption.EN)

    addKey(CONFIRM_PASSWORD_KEY, 'Confirmar senha', LanguageOption.PT_BR)
    tr[CONFIRM_PASSWORD_KEY] = addKey(CONFIRM_PASSWORD_KEY, 'Confirm password', LanguageOption.EN)

    addKey(SUBMIT_KEY, 'Cadastrar', LanguageOption.PT_BR)
    tr[SUBMIT_KEY] = addKey(SUBMIT_KEY, 'Register', LanguageOption.EN)

    addKey(ERROR_REQUIRED_KEY, 'Por favor, preencha os campos obrigatórios.', LanguageOption.PT_BR)
    tr[ERROR_REQUIRED_KEY] = addKey(ERROR_REQUIRED_KEY, 'Please fill in the required fields.', LanguageOption.EN)

    addKey(ERROR_PASSWORD_MATCH_KEY, 'As senhas não coincidem.', LanguageOption.PT_BR)
    tr[ERROR_PASSWORD_MATCH_KEY] = addKey(ERROR_PASSWORD_MATCH_KEY, 'Passwords do not match.', LanguageOption.EN)

    addKey(ERROR_PASSWORD_MIN_KEY, 'A senha deve ter pelo menos 8 caracteres.', LanguageOption.PT_BR)
    tr[ERROR_PASSWORD_MIN_KEY] = addKey(ERROR_PASSWORD_MIN_KEY, 'Password must be at least 8 characters.', LanguageOption.EN)

    addKey(SUCCESS_KEY, 'Cadastro realizado com sucesso!', LanguageOption.PT_BR)
    tr[SUCCESS_KEY] = addKey(SUCCESS_KEY, 'Registration successful!', LanguageOption.EN)

    addKey(PH_FIRST_NAME_KEY, 'João', LanguageOption.PT_BR)
    tr[PH_FIRST_NAME_KEY] = addKey(PH_FIRST_NAME_KEY, 'John', LanguageOption.EN)

    addKey(PH_LAST_NAME_KEY, 'Silva', LanguageOption.PT_BR)
    tr[PH_LAST_NAME_KEY] = addKey(PH_LAST_NAME_KEY, 'Smith', LanguageOption.EN)

    addKey(PH_EMAIL_KEY, 'joao@email.com', LanguageOption.PT_BR)
    tr[PH_EMAIL_KEY] = addKey(PH_EMAIL_KEY, 'john@email.com', LanguageOption.EN)

    addKey(PH_PHONE_KEY, '(51) 99999-0000', LanguageOption.PT_BR)
    tr[PH_PHONE_KEY] = addKey(PH_PHONE_KEY, '(555) 99999-0000', LanguageOption.EN)

    addKey(PH_PASSWORD_KEY, 'Mínimo 8 caracteres', LanguageOption.PT_BR)
    tr[PH_PASSWORD_KEY] = addKey(PH_PASSWORD_KEY, 'Minimum 8 characters', LanguageOption.EN)

    addKey(PH_CONFIRM_PASSWORD_KEY, 'Repita a senha', LanguageOption.PT_BR)
    tr[PH_CONFIRM_PASSWORD_KEY] = addKey(PH_CONFIRM_PASSWORD_KEY, 'Repeat password', LanguageOption.EN)

    return tr
  }

  useEffect(() => {
    setTranslation({
      [TITLE_KEY]: getValue(TITLE_KEY),
      [SUBTITLE_KEY]: getValue(SUBTITLE_KEY),
      [PERSONAL_DATA_KEY]: getValue(PERSONAL_DATA_KEY),
      [FIRST_NAME_KEY]: getValue(FIRST_NAME_KEY),
      [LAST_NAME_KEY]: getValue(LAST_NAME_KEY),
      [EMAIL_KEY]: getValue(EMAIL_KEY),
      [PHONE_KEY]: getValue(PHONE_KEY),
      [BIRTHDATE_KEY]: getValue(BIRTHDATE_KEY),
      [ACCESS_KEY]: getValue(ACCESS_KEY),
      [PASSWORD_KEY]: getValue(PASSWORD_KEY),
      [CONFIRM_PASSWORD_KEY]: getValue(CONFIRM_PASSWORD_KEY),
      [SUBMIT_KEY]: getValue(SUBMIT_KEY),
      [ERROR_REQUIRED_KEY]: getValue(ERROR_REQUIRED_KEY),
      [ERROR_PASSWORD_MATCH_KEY]: getValue(ERROR_PASSWORD_MATCH_KEY),
      [ERROR_PASSWORD_MIN_KEY]: getValue(ERROR_PASSWORD_MIN_KEY),
      [SUCCESS_KEY]: getValue(SUCCESS_KEY),
      [PH_FIRST_NAME_KEY]: getValue(PH_FIRST_NAME_KEY),
      [PH_LAST_NAME_KEY]: getValue(PH_LAST_NAME_KEY),
      [PH_EMAIL_KEY]: getValue(PH_EMAIL_KEY),
      [PH_PHONE_KEY]: getValue(PH_PHONE_KEY),
      [PH_PASSWORD_KEY]: getValue(PH_PASSWORD_KEY),
      [PH_CONFIRM_PASSWORD_KEY]: getValue(PH_CONFIRM_PASSWORD_KEY),
    })
  }, [language])

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.email || !form.password) {
      setError(translation[ERROR_REQUIRED_KEY])
      return
    }

    if (form.password !== form.confirmPassword) {
      setError(translation[ERROR_PASSWORD_MATCH_KEY])
      return
    }

    if (form.password.length < 8) {
      setError(translation[ERROR_PASSWORD_MIN_KEY])
      return
    }

    setSuccess(true)
  }

  return <main style={styles.container}>
    <div style={styles.card}>
      <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{translation[TITLE_KEY]}</ThemeText>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{translation[SUBTITLE_KEY]}</ThemeText>
      <form onSubmit={handleSubmit} noValidate>

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[PERSONAL_DATA_KEY]}</ThemeText>

        <div style={styles.row}>
          <FrameworkInput
            type={'text'}
            label={translation[FIRST_NAME_KEY]}
            name={'firstName'}
            value={form.firstName}
            changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
            placeholder={translation[PH_FIRST_NAME_KEY]}
            style={styles.field}
          />
          <FrameworkInput
            type={'text'}
            label={translation[LAST_NAME_KEY]}
            name={'lastName'}
            value={form.lastName}
            changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            placeholder={translation[PH_LAST_NAME_KEY]}
            style={styles.field}
          />
        </div>

        <FrameworkInput
          type={'email'}
          label={translation[EMAIL_KEY]}
          name={'email'}
          value={form.email}
          changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
          placeholder={translation[PH_EMAIL_KEY]}
          style={styles.field}
        />

        <div style={styles.row}>
          <FrameworkInput
            type={'tel'}
            label={translation[PHONE_KEY]}
            name={'phone'}
            value={form.phone}
            changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
            placeholder={translation[PH_PHONE_KEY]}
            style={styles.field}
          />
          <FrameworkInput
            type={'date'}
            label={translation[BIRTHDATE_KEY]}
            name={'birthdate'}
            value={form.birthdate}
            changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('birthdate', e.target.value)}
            style={styles.field}
          />
        </div>

        <hr style={styles.divider} />

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[ACCESS_KEY]}</ThemeText>

        <FrameworkInput
          type={'password'}
          label={translation[PASSWORD_KEY]}
          name={'password'}
          value={form.password}
          changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
          placeholder={translation[PH_PASSWORD_KEY]}
          style={styles.field}
        />

        <FrameworkInput
          type={'password'}
          label={translation[CONFIRM_PASSWORD_KEY]}
          name={'confirmPassword'}
          value={form.confirmPassword}
          changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirmPassword', e.target.value)}
          placeholder={translation[PH_CONFIRM_PASSWORD_KEY]}
          style={styles.field}
        />

        {error && <ThemeText noSelection noWrap style={styles.error} textTag={TextTag.P} color={'#000'}>{error}</ThemeText>}
        {success && <ThemeText noSelection noWrap style={styles.success} textTag={TextTag.P} color={'#000'}>{translation[SUCCESS_KEY]}</ThemeText>}

        <ThemeButton clickHandle={handleSubmit}>{translation[SUBMIT_KEY]}</ThemeButton>
      </form>
    </div>
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem 1rem',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    boxSizing: 'border-box',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: 12,
    padding: '2rem',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: 22,
    fontWeight: 500,
    margin: '0 0 0.25rem',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: '0 0 1.75rem',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 1rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: '1rem',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '1.25rem 0',
  },
  error: {
    fontSize: 13,
    color: '#c0392b',
    marginBottom: '0.5rem',
  },
  success: {
    fontSize: 13,
    color: '#27ae60',
    marginBottom: '0.5rem',
  },
}
