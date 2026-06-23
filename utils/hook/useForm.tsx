import { useRef, useState } from 'react'
import React from 'react'
import { DateValue } from '../../components/input/dateInput/dateInput'

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
  orderedFields: () => FormInputField[]
  addOrSetField: (field: FormInputField) => void
  getFieldValue: (name: string, value: string) => getFieldValueResult
  canSubmit: () => boolean
  onFieldBlur: () => void
  onFieldChange: () => void
}

export function useForm(initialFields: FormInputField[] = []): UseFormReturn {
  const buildInitialState = (): FormState => {
    return initialFields.reduce<FormState>((acc, field, index) => {
      acc[field.name] = { ...field, position: field.position ?? index }
      return acc
    }, {})
  }

  const formRef = useRef<FormState>(buildInitialState())
  const orderRef = useRef<string[]>(initialFields.map(f => f.name))
  const canSubmitRef = useRef<boolean>(false)
  const [, forceUpdate] = useState(0)

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

  const form = (): FormState => formRef.current

  const canSubmit = (): boolean => canSubmitRef.current

  return { form, orderedFields, canSubmit, onFieldBlur, onFieldChange, addOrSetField, getFieldValue }
}
