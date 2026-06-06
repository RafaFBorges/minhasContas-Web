import { StyledInputProps } from '../../input/input'
import PhoneInput from '../../input/phoneInput'
import StyledInput from '../../input/input'
import React from 'react'
import SpinInput from '../../input/spinInput'
import PasswordInput from '../../input/passwordInput'
import DateInput from '../../input/dateInput'

const INPUT_REGISTRY: Partial<Record<React.HTMLInputTypeAttribute, React.ComponentType<StyledInputProps>>> = {
  tel: PhoneInput,
  number: SpinInput,
  password: PasswordInput,
  date: DateInput,
  text: StyledInput,
}

export function resolveInput(type: React.HTMLInputTypeAttribute): React.ComponentType<StyledInputProps> {
  return INPUT_REGISTRY[type] ?? StyledInput
}
