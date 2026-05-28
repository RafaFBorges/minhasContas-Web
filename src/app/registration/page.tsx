'use client'

import React, { useEffect, useState } from 'react'
import ThemeButton from '../../../components/themeComponents/themeButton'
import ThemeText from '../../../components/themeComponents/themeText'
import { TextTag } from '../../../components/api/text'
import FrameworkInput from '../../../components/framework/frameworkInput'
import { LanguageOption, useTranslate } from '../../../utils/hook/translateHook'
import { notEmpty, validateDate, validateEmail, validateStrongPassword } from '../../../utils/validations'
import { useForm, FormInputField } from '../../../utils/hook/useForm'


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
  const PH_FIRST_NAME_KEY = 'Registration.PlaceholderFirstName'
  const PH_LAST_NAME_KEY = 'Registration.PlaceholderLastName'
  const PH_EMAIL_KEY = 'Registration.PlaceholderEmail'
  const PH_PHONE_KEY = 'Registration.PlaceholderPhone'
  const PH_PASSWORD_KEY = 'Registration.PlaceholderPassword'
  const PH_CONFIRM_PASSWORD_KEY = 'Registration.PlaceholderConfirmPassword'

  const { language, addKey, getValue } = useTranslate()
  const { form, addOrSetField, getFieldValue, isAllValid, onFieldBlur } = useForm(buildInitialFields())

  const [enabled, setEnabled] = useState(false)
  const [translation, setTranslation] = useState<RegistrationTranslations>(translate())

  function buildInitialFields(): FormInputField[] {
    addKey(FIRST_NAME_KEY, 'Nome', LanguageOption.PT_BR)
    addKey(PH_FIRST_NAME_KEY, 'João', LanguageOption.PT_BR)
    addKey(LAST_NAME_KEY, 'Sobrenome', LanguageOption.PT_BR)
    addKey(PH_LAST_NAME_KEY, 'Silva', LanguageOption.PT_BR)
    addKey(EMAIL_KEY, 'Email', LanguageOption.PT_BR)
    addKey(PH_EMAIL_KEY, 'joao@email.com', LanguageOption.PT_BR)
    addKey(PHONE_KEY, 'Telefone', LanguageOption.PT_BR)
    addKey(PH_PHONE_KEY, '(51) 99999-0000', LanguageOption.PT_BR)
    addKey(BIRTHDATE_KEY, 'Data de nascimento', LanguageOption.PT_BR)
    addKey(PASSWORD_KEY, 'Senha', LanguageOption.PT_BR)
    addKey(PH_PASSWORD_KEY, 'Mínimo 8 caracteres', LanguageOption.PT_BR)
    addKey(CONFIRM_PASSWORD_KEY, 'Confirmar senha', LanguageOption.PT_BR)
    addKey(PH_CONFIRM_PASSWORD_KEY, 'Repita a senha', LanguageOption.PT_BR)

    return [
      {
        value: '',
        isValid: null,
        type: 'text',
        name: 'firstName',
        label: addKey(FIRST_NAME_KEY, 'First name', LanguageOption.EN),
        placeholder: addKey(PH_FIRST_NAME_KEY, 'John', LanguageOption.EN),
        style: styles.field,
        validate: notEmpty,
      },
      {
        value: '',
        isValid: null,
        type: 'text',
        name: 'lastName',
        label: addKey(LAST_NAME_KEY, 'Last name', LanguageOption.EN),
        placeholder: addKey(PH_LAST_NAME_KEY, 'Smith', LanguageOption.EN),
        style: styles.field,
        validate: notEmpty,
      },
      {
        value: '',
        isValid: null,
        type: 'email',
        name: 'email',
        label: addKey(EMAIL_KEY, 'Email', LanguageOption.EN),
        placeholder: addKey(PH_EMAIL_KEY, 'john@email.com', LanguageOption.EN),
        style: styles.field,
        validate: validateEmail,
      },
      {
        value: '',
        isValid: null,
        type: 'tel',
        name: 'phone',
        label: addKey(PHONE_KEY, 'Phone', LanguageOption.EN),
        placeholder: addKey(PH_PHONE_KEY, '(555) 99999-0000', LanguageOption.EN),
        style: styles.field,
        validate: notEmpty,
      },
      {
        value: '',
        isValid: null,
        type: 'date',
        name: 'birthdate',
        label: addKey(BIRTHDATE_KEY, 'Date of birth', LanguageOption.EN),
        style: styles.field,
        validate: validateDate,
      },
      {
        value: '',
        isValid: null,
        type: 'password',
        name: 'password',
        label: addKey(PASSWORD_KEY, 'Password', LanguageOption.EN),
        placeholder: addKey(PH_PASSWORD_KEY, 'Minimum 8 characters', LanguageOption.EN),
        style: styles.field,
        validate: validateStrongPassword,
      },
      {
        value: '',
        isValid: null,
        type: 'password',
        name: 'confirmPassword',
        label: addKey(CONFIRM_PASSWORD_KEY, 'Confirm password', LanguageOption.EN),
        placeholder: addKey(PH_CONFIRM_PASSWORD_KEY, 'Repeat password', LanguageOption.EN),
        style: styles.field,
      },
    ]
  }

  function translate(): RegistrationTranslations {
    const tr = {} as RegistrationTranslations

    addKey(TITLE_KEY, 'Criar conta', LanguageOption.PT_BR)
    tr[TITLE_KEY] = addKey(TITLE_KEY, 'Create account', LanguageOption.EN)

    addKey(SUBTITLE_KEY, 'Preencha os dados abaixo para se cadastrar.', LanguageOption.PT_BR)
    tr[SUBTITLE_KEY] = addKey(SUBTITLE_KEY, 'Fill in the details below to register.', LanguageOption.EN)

    addKey(PERSONAL_DATA_KEY, 'Dados pessoais', LanguageOption.PT_BR)
    tr[PERSONAL_DATA_KEY] = addKey(PERSONAL_DATA_KEY, 'Personal data', LanguageOption.EN)

    addKey(ACCESS_KEY, 'Acesso', LanguageOption.PT_BR)
    tr[ACCESS_KEY] = addKey(ACCESS_KEY, 'Access', LanguageOption.EN)

    addKey(SUBMIT_KEY, 'Cadastrar', LanguageOption.PT_BR)
    tr[SUBMIT_KEY] = addKey(SUBMIT_KEY, 'Register', LanguageOption.EN)

    addKey(ERROR_REQUIRED_KEY, 'Por favor, preencha os campos obrigatórios.', LanguageOption.PT_BR)
    tr[ERROR_REQUIRED_KEY] = addKey(ERROR_REQUIRED_KEY, 'Please fill in the required fields.', LanguageOption.EN)

    addKey(ERROR_PASSWORD_MATCH_KEY, 'As senhas não coincidem.', LanguageOption.PT_BR)
    tr[ERROR_PASSWORD_MATCH_KEY] = addKey(ERROR_PASSWORD_MATCH_KEY, 'Passwords do not match.', LanguageOption.EN)

    return tr
  }

  useEffect(() => {
    setTranslation({
      [TITLE_KEY]: getValue(TITLE_KEY),
      [SUBTITLE_KEY]: getValue(SUBTITLE_KEY),
      [PERSONAL_DATA_KEY]: getValue(PERSONAL_DATA_KEY),
      [ACCESS_KEY]: getValue(ACCESS_KEY),
      [SUBMIT_KEY]: getValue(SUBMIT_KEY),
      [ERROR_REQUIRED_KEY]: getValue(ERROR_REQUIRED_KEY),
      [ERROR_PASSWORD_MATCH_KEY]: getValue(ERROR_PASSWORD_MATCH_KEY),
    })

    addOrSetField({ ...form().firstName, label: getValue(FIRST_NAME_KEY), placeholder: getValue(PH_FIRST_NAME_KEY) })
    addOrSetField({ ...form().lastName, label: getValue(LAST_NAME_KEY), placeholder: getValue(PH_LAST_NAME_KEY) })
    addOrSetField({ ...form().email, label: getValue(EMAIL_KEY), placeholder: getValue(PH_EMAIL_KEY) })
    addOrSetField({ ...form().phone, label: getValue(PHONE_KEY), placeholder: getValue(PH_PHONE_KEY) })
    addOrSetField({ ...form().birthdate, label: getValue(BIRTHDATE_KEY) })
    addOrSetField({ ...form().password, label: getValue(PASSWORD_KEY), placeholder: getValue(PH_PASSWORD_KEY) })
    addOrSetField({ ...form().confirmPassword, label: getValue(CONFIRM_PASSWORD_KEY), placeholder: getValue(PH_CONFIRM_PASSWORD_KEY) })
  }, [language])

  const handleChange = (fieldName: string, value: string) => {
    setEnabled(false)
    const { success, field } = getFieldValue(fieldName, value)
    if (!success)
      return

    if (fieldName === 'password' || fieldName === 'confirmPassword') {
      const passwordValue = fieldName === 'password' ? value : form().password.value
      const confirmValue = fieldName === 'confirmPassword' ? value : form().confirmPassword.value

      const confirmIsValid = confirmValue !== ''
        ? passwordValue !== '' && passwordValue === confirmValue
        : null

      addOrSetField({ ...form().confirmPassword, value: fieldName === 'confirmPassword' ? value : form().confirmPassword.value, isValid: confirmIsValid })
      if (fieldName === 'password') {
        addOrSetField({ ...form().password, value: value, isValid: field.isValid })
      }
    } else
      addOrSetField({ ...form()[fieldName], value: value, isValid: field.isValid })
  }

  const handleBlur = () => {
    onFieldBlur()
    setEnabled(isAllValid())
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isAllValid())
      return

    console.log('Enviou')
  }

  return <main style={styles.container}>
    <div style={styles.card}>
      <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{translation[TITLE_KEY]}</ThemeText>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{translation[SUBTITLE_KEY]}</ThemeText>
      <form noValidate>

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[PERSONAL_DATA_KEY]}</ThemeText>

        <div style={styles.row}>
          <FrameworkInput
            {...form().firstName}
            onBlur={handleBlur}
            changeHandle={(e) => handleChange('firstName', e.target.value)}
          />
          <FrameworkInput
            {...form().lastName}
            onBlur={handleBlur}
            changeHandle={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <FrameworkInput
          {...form().email}
          onBlur={handleBlur}
          changeHandle={(e) => handleChange('email', e.target.value)}
        />

        <div style={styles.row}>
          <FrameworkInput
            {...form().phone}
            onBlur={handleBlur}
            changeHandle={(e) => handleChange('phone', e.target.value)}
          />
          <FrameworkInput
            {...form().birthdate}
            onBlur={handleBlur}
            changeHandle={(e) => handleChange('birthdate', e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[ACCESS_KEY]}</ThemeText>

        <FrameworkInput
          {...form().password}
          onBlur={handleBlur}
          changeHandle={(e) => handleChange('password', e.target.value)}
        />

        <FrameworkInput
          {...form().confirmPassword}
          onBlur={handleBlur}
          changeHandle={(e) => handleChange('confirmPassword', e.target.value)}
        />

        <div style={styles.buttonsContainer}>
          <ThemeButton enabled={enabled} clickHandle={handleSubmit}>
            {translation[SUBMIT_KEY]}
          </ThemeButton>
        </div>
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
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
}
