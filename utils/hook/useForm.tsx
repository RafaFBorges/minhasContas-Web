import { useRef, useState } from 'react'
import React from 'react'

export interface FormInputField {
  value: string
  isValid: boolean | null
  type: React.HTMLInputTypeAttribute
  name: string
  label: string
  placeholder?: string
  style?: React.CSSProperties
  validate?: (value: string) => boolean
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
}

interface UseFormReturn {
  form: () => FormState
  addOrSetField: (field: FormInputField) => void
  getFieldValue: (name: string, value: string) => getFieldValueResult
  isAllValid: () => boolean
  onFieldBlur: () => void
}

export function useForm(initialFields: FormInputField[] = []): UseFormReturn {
  const buildInitialState = (): FormState => {
    return initialFields.reduce<FormState>((acc, field) => {
      acc[field.name] = field
      return acc
    }, {})
  }

  const formRef = useRef<FormState>(buildInitialState())
  const isAllValidRef = useRef<boolean>(false)
  const [, forceUpdate] = useState(0)

  const addOrSetField = (field: FormInputField) => {
    formRef.current = {
      ...formRef.current,
      [field.name]: field,
    }

    forceUpdate(n => n + 1)
  }

  const onFieldBlur = () => {
    isAllValidRef.current = Object.values(formRef.current).every(f => f.isValid === true)
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

  const isAllValid = (): boolean => isAllValidRef.current

  return { form, onFieldBlur, addOrSetField, getFieldValue, isAllValid }
}
