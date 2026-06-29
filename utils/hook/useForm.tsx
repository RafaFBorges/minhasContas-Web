import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { DateValue } from '../../components/input/dateInput/dateInput'
import { handlePOST } from '@/comunication/ApiResthandler'
import { TextTag } from '../../components/api/text'
import ThemeText from '../../components/themeComponents/themeText'
import FrameworkInput from '../../components/framework/frameworkInput'
import ThemeButton from '../../components/themeComponents/themeButton'
import { LanguageOption, useTranslate } from './translateHook'


export interface FormInputField {
  value: string
  isValid: boolean | null
  type: React.HTMLInputTypeAttribute
  name: string
  label: string
  position: number
  group?: string
  section?: string
  placeholder?: string
  style?: React.CSSProperties
  validate?: (value: string) => boolean
  maxDate?: DateValue
  minDate?: DateValue
}

interface SectionBlock {
  sectionKey: string
  sectionLabel?: string
  rows: (FormInputField | FormInputField[])[]
}

export interface getFieldValueResult {
  success: boolean
  field: FormInputField
}

export interface FormState {
  [key: string]: FormInputField
}

const EMPTY_FIELD: FormInputField = {
  value: '',
  isValid: null,
  type: 'text',
  name: '',
  label: '',
  position: 0,
}

interface UseFormReturn {
  form: () => FormState
  renderForm: () => React.JSX.Element | undefined
  addOrSetField: (field: FormInputField) => void
  getFieldValue: (name: string, value: string) => getFieldValueResult
  canSubmit: () => boolean
  onFieldChange: () => void
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>, path: string) => void
}

interface UseFormProps {
  initialFields: FormInputField[]
  name: string
  handleChange: (name: string, value: string) => void
  processResponse: undefined | ((response: any) => boolean)
  onSucsess?: () => ReactNode
  path: string
  title?: string
  subtitle?: string
}

export function useForm({ initialFields = [], name, handleChange, processResponse = undefined, onSucsess, path = '', title = undefined, subtitle = undefined }: UseFormProps): UseFormReturn {
  const SUBMIT_KEY = 'Registration.Submit'

  const buildInitialState = (): FormState => {
    return initialFields.reduce<FormState>((acc, field, index) => {
      acc[field.name] = { ...field, position: field.position ?? index }
      return acc
    }, {})
  }

  const formRef = useRef<FormState>(buildInitialState())
  const orderRef = useRef<string[]>(initialFields.map(f => f.name))
  const canSubmitRef = useRef<boolean>(false)
  const [notSending, setNotSending] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [, forceUpdate] = useState(0)
  const { addKeys, getValue } = useTranslate()

  const addOrSetField = (field: FormInputField) => {
    const isNew = !formRef.current[field.name]

    formRef.current = {
      ...formRef.current,
      [field.name]: field,
    }

    if (isNew) {
      orderRef.current = [
        ...orderRef.current.filter(n => n !== field.name),
        field.name,
      ].sort((a, b) => (formRef.current[a]?.position ?? 0) - (formRef.current[b]?.position ?? 0))
    }

    forceUpdate(n => n + 1)
  }

  const orderedFields = (): FormInputField[] =>
    orderRef.current
      .map(name => formRef.current[name])
      .filter(Boolean)
      .sort((a, b) => a.position - b.position)

  const onFieldBlur = () => {
    canSubmitRef.current = Object.values(formRef.current).every(f => f.isValid === true)
    forceUpdate(n => n + 1)
  }

  const onFieldChange = () => {
    canSubmitRef.current = false
    forceUpdate(n => n + 1)
  }

  const getFieldValue = (name: string, value: string): getFieldValueResult => {
    const fieldData = formRef.current[name]
    if (!fieldData)
      return { success: false, field: EMPTY_FIELD }

    const isValid = fieldData.validate ? fieldData.validate(value) : null

    return {
      success: true,
      field: { ...fieldData, value, isValid },
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!canSubmit)
      return

    setNotSending(true)
    const userRegistration = {
      "name": form().firstName.value.trim() + ' ' + form().lastName.value.trim(),
      "email": form().email.value.trim(),
      "user": form().user.value.trim(),
      "password": form().password.value
    }

    const response = await handlePOST(path, userRegistration)

    if (response != null && processResponse != undefined)
      setSucess(processResponse(response))

    setNotSending(false)
    console.log('handleSubmit > ' + name + ' response=' + (response != null))
  }

  const buildSections = (): SectionBlock[] => {
    const fields: FormInputField[] = orderedFields()
    const sections: SectionBlock[] = []
    const sectionMap: Map<string, SectionBlock> = new Map<string, SectionBlock>()
    const groupMap: Map<string, FormInputField[]> = new Map<string, FormInputField[]>()

    for (const field of fields) {
      const sectionKey = field.section ?? '__default__'

      if (!sectionMap.has(sectionKey)) {
        const block: SectionBlock = {
          sectionKey,
          sectionLabel: field.section,
          rows: [],
        }

        sectionMap.set(sectionKey, block)
        sections.push(block)
      }

      const section = sectionMap.get(sectionKey)!

      if (field.group) {
        const groupKey = `${sectionKey}::${field.group}`

        if (!groupMap.has(groupKey)) {
          const group: FormInputField[] = []
          groupMap.set(groupKey, group)
          section.rows.push(group)
        }

        groupMap.get(groupKey)!.push(field)
      } else
        section.rows.push(field)
    }

    return sections
  }

  const renderField = (item: FormInputField) => <FrameworkInput
    key={item.name}
    {...item}
    onBlur={onFieldBlur}
    changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.name, e.target.value)}
  />

  const renderRow = (row: FormInputField | FormInputField[], index: number) => {
    if (Array.isArray(row)) {
      return <div key={row.map(f => f.name).join('-')} style={styles.group}>
        {row.map(renderField)}
      </div>
    }

    return renderField(row)
  }

  const renderFields = () => {
    const sections = buildSections()

    return <div>
      {sections.map((section, sIndex) => (
        <div key={section.sectionKey}>
          {section.sectionLabel && (
            <ThemeText
              noSelection
              noWrap
              style={styles.sectionLabel}
              textTag={TextTag.P}
              color={'#000'}
            >
              {section.sectionLabel}
            </ThemeText>
          )}

          {section.rows.map((row, rIndex) => (
            <div key={rIndex}>
              {renderRow(row, rIndex)}
              {rIndex < section.rows.length - 1 && <div style={styles.rowDivider} />}
            </div>
          ))}

          {sIndex < sections.length - 1 && <hr style={styles.sectionDivider} />}
        </div>
      ))}
    </div>
  }

  function renderForm() {
    return <>
      <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{title}</ThemeText>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{subtitle}</ThemeText>
      <form noValidate>
        {sucess
          ? onSucsess ? onSucsess() : undefined
          : renderFields()}

        {!sucess && <div style={styles.buttonsContainer}>
          <ThemeButton enabled={canSubmit()} clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}>
            {getValue(SUBMIT_KEY)}
          </ThemeButton>
        </div>}
      </form>
    </>
  }

  const form = (): FormState => formRef.current

  const canSubmit = (): boolean => !notSending && canSubmitRef.current

  useEffect(() => {
    addKeys(SUBMIT_KEY, [{ value: 'Cadastrar', lang: LanguageOption.PT_BR }, { value: 'Register', lang: LanguageOption.EN },])
  }, [])

  return { form, canSubmit, onFieldChange, addOrSetField, getFieldValue, handleSubmit, renderForm }
}

const styles: { [key: string]: React.CSSProperties } = {
  group: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 1rem',
  },
  rowDivider: {
    height: 8,
  },
  sectionDivider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '1.25rem 0',
  },
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
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
}
