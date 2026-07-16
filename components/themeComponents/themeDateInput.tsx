import React from 'react'
import DateInput, { DateInputProps } from '../input/dateInput/dateInput'
import ThemeCalendar from './themeCalendar'


export default function ThemeDateInput({ ...rest }: DateInputProps) {
  return <DateInput
    Calendar={ThemeCalendar}

    {...rest}
  />
}
