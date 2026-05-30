import React from 'react'
import FrameworkInput from '../../components/framework/frameworkInput'
import { FormInputField } from './useForm'

interface UseViewFormProps {
  orderedFields: () => FormInputField[]
  onFieldBlur: () => void
  handleChange: (name: string, value: string) => void
}

export function useViewForm({ orderedFields, onFieldBlur, handleChange }: UseViewFormProps) {
  const renderFields = () => <div>
    {orderedFields().map(item => (
      <FrameworkInput
        key={item.name}
        {...item}
        onBlur={onFieldBlur}
        changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.name, e.target.value)}
      />
    ))}
  </div>

  return { renderFields }
}
