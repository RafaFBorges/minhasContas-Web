import React from 'react'
import { DateInput, DateInputProps } from '@rafafborges/componentes'
import ThemeCalendar from './themeCalendar'


export default function ThemeDateInput({ ...rest }: DateInputProps) {
  return <DateInput
    Calendar={ThemeCalendar}

    {...rest}
  />
}
