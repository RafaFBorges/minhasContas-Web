"use client"

import { handlePOST } from '@/comunication/ApiResthandler'
import ThemeFrameworkInput from '../../components/themeComponents/themeFrameworkInput'
import { useTheme } from './themeHook'
import { LanguageOption, useTranslate } from './translateHook'
import { usePaginationTheme } from './usePagination'
import { useForm as useFormBase, UseFormProps as UseFormBaseProps, UseFormReturn, FormState } from '@rafafborges/componentes'

export type { FormInputField, FormState, getFieldValueResult, UseFormReturn } from '@rafafborges/componentes'

export type UseFormProps = Omit<UseFormBaseProps, 'onSubmit' | 'submitLabel' | 'color' | 'InputComponent' | 'pagination'> & {
  path: string
}

export function useForm({ path = '', ...props }: UseFormProps): UseFormReturn {
  const SUBMIT_KEY = 'Registration.Submit'

  const { config } = useTheme()
  const { addKeys } = useTranslate()
  const pagination = usePaginationTheme()

  function onSubmit(form: FormState) {
    const userRegistration = {
      "name": form.firstName.value.trim() + ' ' + form.lastName.value.trim(),
      "email": form.email.value.trim(),
      "user": form.user.value.trim(),
      "password": form.password.value
    }

    return handlePOST(path, userRegistration)
  }

  return useFormBase({
    ...props,
    onSubmit,
    submitLabel: addKeys(SUBMIT_KEY, [{ value: 'Cadastrar', lang: LanguageOption.PT_BR }, { value: 'Register', lang: LanguageOption.EN },]),
    color: config.color,
    InputComponent: ThemeFrameworkInput,
    pagination,
  })
}
