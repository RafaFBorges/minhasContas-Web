import React, { useEffect, useState } from 'react'

import { useTheme } from '../../utils/hook/themeHook'
import Calendar, { CALENDAR_ITEM_COUNT, CalendarProps, WeekDaysType } from '../input/dateInput/calendar'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'


export default function ThemeCalendar({ ...rest }: CalendarProps) {
  const DOM_KEY = 'ThemeCalendar.weekDays.Dom'
  const SEG_KEY = 'ThemeCalendar.weekDays.Seg'
  const TER_KEY = 'ThemeCalendar.weekDays.Ter'
  const QUA_KEY = 'ThemeCalendar.weekDays.Qua'
  const QUI_KEY = 'ThemeCalendar.weekDays.Qui'
  const SEX_KEY = 'ThemeCalendar.weekDays.Sex'
  const SAB_KEY = 'ThemeCalendar.weekDays.Sab'
  const JANUARY_KEY = 'ThemeCalendar.monthNames.Jan'
  const FEBRUARY_KEY = 'ThemeCalendar.monthNames.Feb'
  const MARCH_KEY = 'ThemeCalendar.monthNames.Mar'
  const APRIL_KEY = 'ThemeCalendar.monthNames.Apr'
  const MAY_KEY = 'ThemeCalendar.monthNames.May'
  const JUNE_KEY = 'ThemeCalendar.monthNames.Jun'
  const JULY_KEY = 'ThemeCalendar.monthNames.Jul'
  const AUGUST_KEY = 'ThemeCalendar.monthNames.Aug'
  const SEPTEMBER_KEY = 'ThemeCalendar.monthNames.Sep'
  const OCTOBER_KEY = 'ThemeCalendar.monthNames.Oct'
  const NOVEMBER_KEY = 'ThemeCalendar.monthNames.Nov'
  const DECEMBER_KEY = 'ThemeCalendar.monthNames.Dec'

  const { config } = useTheme()
  const { language, addKeys, getValue } = useTranslate()
  const [weekDays, setWeekDays] = useState<WeekDaysType>(createWeekDays())
  const [monthNames, setmonthNames] = useState<Record<number, string>>(createMonthDays())

  function createWeekDays(): WeekDaysType {
    return [
      addKeys(DOM_KEY, [{ value: 'Dom', lang: LanguageOption.PT_BR }, { value: 'Sun', lang: LanguageOption.EN },]),
      addKeys(SEG_KEY, [{ value: 'Seg', lang: LanguageOption.PT_BR }, { value: 'Mon', lang: LanguageOption.EN },]),
      addKeys(TER_KEY, [{ value: 'Ter', lang: LanguageOption.PT_BR }, { value: 'Tue', lang: LanguageOption.EN },]),
      addKeys(QUA_KEY, [{ value: 'Qua', lang: LanguageOption.PT_BR }, { value: 'Wed', lang: LanguageOption.EN },]),
      addKeys(QUI_KEY, [{ value: 'Qui', lang: LanguageOption.PT_BR }, { value: 'Thu', lang: LanguageOption.EN },]),
      addKeys(SEX_KEY, [{ value: 'Sex', lang: LanguageOption.PT_BR }, { value: 'Fri', lang: LanguageOption.EN },]),
      addKeys(SAB_KEY, [{ value: 'Sáb', lang: LanguageOption.PT_BR }, { value: 'Sat', lang: LanguageOption.EN },]),
    ]
  }

  function createMonthDays(): Record<number, string> {
    return {
      1: addKeys(JANUARY_KEY, [{ value: 'Janeiro', lang: LanguageOption.PT_BR }, { value: 'January', lang: LanguageOption.EN },]),
      2: addKeys(FEBRUARY_KEY, [{ value: 'Fevereiro', lang: LanguageOption.PT_BR }, { value: 'February', lang: LanguageOption.EN },]),
      3: addKeys(MARCH_KEY, [{ value: 'Março', lang: LanguageOption.PT_BR }, { value: 'March', lang: LanguageOption.EN },]),
      4: addKeys(APRIL_KEY, [{ value: 'Abril', lang: LanguageOption.PT_BR }, { value: 'April', lang: LanguageOption.EN },]),
      5: addKeys(MAY_KEY, [{ value: 'Maio', lang: LanguageOption.PT_BR }, { value: 'May', lang: LanguageOption.EN },]),
      6: addKeys(JUNE_KEY, [{ value: 'Junho', lang: LanguageOption.PT_BR }, { value: 'June', lang: LanguageOption.EN },]),
      7: addKeys(JULY_KEY, [{ value: 'Julho', lang: LanguageOption.PT_BR }, { value: 'July', lang: LanguageOption.EN },]),
      8: addKeys(AUGUST_KEY, [{ value: 'Agosto', lang: LanguageOption.PT_BR }, { value: 'August', lang: LanguageOption.EN },]),
      9: addKeys(SEPTEMBER_KEY, [{ value: 'Setembro', lang: LanguageOption.PT_BR }, { value: 'September', lang: LanguageOption.EN },]),
      10: addKeys(OCTOBER_KEY, [{ value: 'Outubro', lang: LanguageOption.PT_BR }, { value: 'October', lang: LanguageOption.EN },]),
      11: addKeys(NOVEMBER_KEY, [{ value: 'Novembro', lang: LanguageOption.PT_BR }, { value: 'November', lang: LanguageOption.EN },]),
      12: addKeys(DECEMBER_KEY, [{ value: 'Dezembro', lang: LanguageOption.PT_BR }, { value: 'December', lang: LanguageOption.EN },]),
    }
  }

  useEffect(() => {
    setWeekDays([getValue(DOM_KEY), getValue(SEG_KEY), getValue(TER_KEY), getValue(QUA_KEY), getValue(QUI_KEY), getValue(SEX_KEY), getValue(SAB_KEY)])
    setmonthNames({
      1: getValue(JANUARY_KEY),
      2: getValue(FEBRUARY_KEY),
      3: getValue(MARCH_KEY),
      4: getValue(APRIL_KEY),
      5: getValue(MAY_KEY),
      6: getValue(JUNE_KEY),
      7: getValue(JULY_KEY),
      8: getValue(AUGUST_KEY),
      9: getValue(SEPTEMBER_KEY),
      10: getValue(OCTOBER_KEY),
      11: getValue(NOVEMBER_KEY),
      12: getValue(DECEMBER_KEY),
    })
  }, [language])

  return <Calendar
    borderColor={config.borderColor}
    backgroundColor={config.backgroundColor}
    disabledFontColor={config.disabledFontColor}
    selectedDate={config.selectedDate}
    diferentMonth={config.diferentMonth}
    calendarItemCount={CALENDAR_ITEM_COUNT}
    monthName={monthNames}
    weekDays={weekDays}

    {...rest}
  />
}
