'use client'

import React, { useEffect, useState } from 'react'
import ThemeButton from '../../../components/themeComponents/themeButton'
import ThemeText from '../../../components/themeComponents/themeText'
import { TextTag } from '../../../components/api/text'
import FrameworkInput from '../../../components/framework/frameworkInput'
import { LanguageOption, useTranslate } from '../../../utils/hook/translateHook'
import { notEmpty, validateDate, validateEmail, validateStrongPassword } from '../../../utils/validations'
import { useForm, FormInputField } from '../../../utils/hook/useForm'
import { useViewForm } from '../../../utils/hook/useViewForm'


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

  function buildInitialFields(): FormInputField[] {
    return [
      {
        position: 0,
        value: '',
        isValid: null,
        type: 'text',
        name: 'firstName',
        label: addKeys(FIRST_NAME_KEY, [{ value: 'Nome', lang: LanguageOption.PT_BR }, { value: 'First name', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_FIRST_NAME_KEY, [{ value: 'João', lang: LanguageOption.PT_BR }, { value: 'John', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: notEmpty,
      },
      {
        position: 1,
        value: '',
        isValid: null,
        type: 'text',
        name: 'lastName',
        label: addKeys(LAST_NAME_KEY, [{ value: 'Sobrenome', lang: LanguageOption.PT_BR }, { value: 'Last name', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_LAST_NAME_KEY, [{ value: 'Silva', lang: LanguageOption.PT_BR }, { value: 'Smith', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: notEmpty,
      },
      {
        position: 2,
        value: '',
        isValid: null,
        type: 'email',
        name: 'email',
        label: addKeys(EMAIL_KEY, [{ value: 'Email', lang: LanguageOption.PT_BR }, { value: 'Email', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_EMAIL_KEY, [{ value: 'joao@email.com', lang: LanguageOption.PT_BR }, { value: 'john@email.com', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: validateEmail,
      },
      {
        position: 3,
        value: '',
        isValid: null,
        type: 'tel',
        name: 'phone',
        label: addKeys(PHONE_KEY, [{ value: 'Telefone', lang: LanguageOption.PT_BR }, { value: 'Phone', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_PHONE_KEY, [{ value: '(51) 99999-0000', lang: LanguageOption.PT_BR }, { value: '(555) 99999-0000', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: notEmpty,
      },
      {
        position: 4,
        value: '',
        isValid: null,
        type: 'date',
        name: 'birthdate',
        label: addKeys(BIRTHDATE_KEY, [{ value: 'Data de nascimento', lang: LanguageOption.PT_BR }, { value: 'Date of birth', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: validateDate,
      },
      {
        position: 5,
        value: '',
        isValid: null,
        type: 'password',
        name: 'password',
        label: addKeys(PASSWORD_KEY, [{ value: 'Senha', lang: LanguageOption.PT_BR }, { value: 'Password', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_PASSWORD_KEY, [{ value: 'Mínimo 8 caracteres', lang: LanguageOption.PT_BR }, { value: 'Minimum 8 characters', lang: LanguageOption.EN },]),
        style: styles.field,
        validate: validateStrongPassword,
      },
      {
        position: 6,
        value: '',
        isValid: null,
        type: 'password',
        name: 'confirmPassword',
        label: addKeys(CONFIRM_PASSWORD_KEY, [{ value: 'Confirmar senha', lang: LanguageOption.PT_BR }, { value: 'Confirm password', lang: LanguageOption.EN },]),
        placeholder: addKeys(PH_CONFIRM_PASSWORD_KEY, [{ value: 'Repita a senha', lang: LanguageOption.PT_BR }, { value: 'Repeat password', lang: LanguageOption.EN },]),
        style: styles.field,
      },
    ]
  }

  function translate(): RegistrationTranslations {
    const tr = {} as RegistrationTranslations

    tr[TITLE_KEY] = addKeys(TITLE_KEY, [{ value: 'Criar conta', lang: LanguageOption.PT_BR }, { value: 'Create account', lang: LanguageOption.EN },])
    tr[SUBTITLE_KEY] = addKeys(SUBTITLE_KEY, [{ value: 'Preencha os dados abaixo para se cadastrar.', lang: LanguageOption.PT_BR }, { value: 'Fill in the details below to register.', lang: LanguageOption.EN },])
    tr[PERSONAL_DATA_KEY] = addKeys(PERSONAL_DATA_KEY, [{ value: 'Dados pessoais', lang: LanguageOption.PT_BR }, { value: 'Personal data', lang: LanguageOption.EN },])
    tr[ACCESS_KEY] = addKeys(ACCESS_KEY, [{ value: 'Acesso', lang: LanguageOption.PT_BR }, { value: 'Access', lang: LanguageOption.EN },])
    tr[SUBMIT_KEY] = addKeys(SUBMIT_KEY, [{ value: 'Cadastrar', lang: LanguageOption.PT_BR }, { value: 'Register', lang: LanguageOption.EN },])
    tr[ERROR_REQUIRED_KEY] = addKeys(ERROR_REQUIRED_KEY, [{ value: 'Por favor, preencha os campos obrigatórios.', lang: LanguageOption.PT_BR }, { value: 'Please fill in the required fields.', lang: LanguageOption.EN },])
    tr[ERROR_PASSWORD_MATCH_KEY] = addKeys(ERROR_PASSWORD_MATCH_KEY, [{ value: 'As senhas não coincidem.', lang: LanguageOption.PT_BR }, { value: 'Passwords do not match.', lang: LanguageOption.EN },])

    return tr
  }

  const handleChange = (fieldName: string, value: string) => {
    onFieldChange()
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!canSubmit)
      return

    console.log('Enviou')
  }

  const { language, addKeys, getValue } = useTranslate()
  const { form, orderedFields, addOrSetField, getFieldValue, canSubmit, onFieldBlur, onFieldChange } = useForm(buildInitialFields())
  const { renderFields } = useViewForm({ orderedFields, onFieldBlur, handleChange })

  const [translation, setTranslation] = useState<RegistrationTranslations>(translate())

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

  return <main style={styles.container}>
    <div style={styles.card}>
      <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{translation[TITLE_KEY]}</ThemeText>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{translation[SUBTITLE_KEY]}</ThemeText>
      <form noValidate>

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[PERSONAL_DATA_KEY]}</ThemeText>

        <div style={styles.row}>
          <FrameworkInput
            {...form().firstName}
            onBlur={onFieldBlur}
            changeHandle={(e) => handleChange('firstName', e.target.value)}
          />
          <FrameworkInput
            {...form().lastName}
            onBlur={onFieldBlur}
            changeHandle={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <FrameworkInput
          {...form().email}
          onBlur={onFieldBlur}
          changeHandle={(e) => handleChange('email', e.target.value)}
        />

        <div style={styles.row}>
          <FrameworkInput
            {...form().phone}
            onBlur={onFieldBlur}
            changeHandle={(e) => handleChange('phone', e.target.value)}
          />
          <FrameworkInput
            {...form().birthdate}
            onBlur={onFieldBlur}
            changeHandle={(e) => handleChange('birthdate', e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        <ThemeText noSelection noWrap style={styles.sectionLabel} textTag={TextTag.P} color={'#000'}>{translation[ACCESS_KEY]}</ThemeText>

        <FrameworkInput
          {...form().password}
          onBlur={onFieldBlur}
          changeHandle={(e) => handleChange('password', e.target.value)}
        />

        <FrameworkInput
          {...form().confirmPassword}
          onBlur={onFieldBlur}
          changeHandle={(e) => handleChange('confirmPassword', e.target.value)}
        />

        <div style={styles.buttonsContainer}>
          <ThemeButton enabled={canSubmit()} clickHandle={handleSubmit}>
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
