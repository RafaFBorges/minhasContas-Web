import React from 'react'
import ThemeDateInput from '../../themeComponents/themeDateInput'
import { PasswordInput, PhoneInput, SpinInput, StyledInputProps, StyledInput } from '@rafafborges/componentes'

const INPUT_REGISTRY: Partial<Record<React.HTMLInputTypeAttribute, React.ComponentType<StyledInputProps>>> = {
  tel: PhoneInput,
  number: SpinInput,
  password: PasswordInput,
  date: ThemeDateInput,
  text: StyledInput,
}

export function resolveInput(type: React.HTMLInputTypeAttribute): React.ComponentType<StyledInputProps> {
  return INPUT_REGISTRY[type] ?? StyledInput
}
