import React, { JSX, useEffect, useRef, useState } from 'react'

import { HiChevronLeft as LeftIcon, HiChevronRight as RightIcon } from 'react-icons/hi'

import { DateValue } from './dateInput'
import Text, { TextTag } from '../../api/text'
import { isLeapYear } from '../../../utils/validations'


export type WeekDaysType = [string, string, string, string, string, string, string]
export const WEEK_DAYS: WeekDaysType = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const CALENDAR_ITEM_COUNT: number = 35
export const MONTH_NAME: Record<number, string>
  = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro',
}

export interface CalendarProps {
  date: DateValue
  show: boolean
  setShow: (show: boolean) => void
  top: number
  onSelect: (date: DateValue) => void
  maxDate?: DateValue
  minDate?: DateValue
  calendarItemCount?: number
  borderColor?: string
  backgroundColor?: string
  disabledFontColor?: string
  fontColor?: string
  selectedDate?: string
  diferentMonth?: string
  monthName?: Record<number, string>
  weekDays?: WeekDaysType
}

interface CalendarDay {
  date: DateValue
  selected: boolean
  diferentMonth: boolean
  enabled: boolean
}

interface CalendarYear {
  year: number
  selected: boolean
  enabled: boolean
}

export default function Calendar({
  date,
  show,
  setShow,
  top,
  maxDate,
  minDate,
  onSelect = () => { },
  borderColor = '#555',
  backgroundColor = '#fff',
  disabledFontColor = '#555',
  fontColor = '',
  selectedDate = '#0070f3',
  diferentMonth = '#D8D8D8',
  calendarItemCount = CALENDAR_ITEM_COUNT,
  monthName = MONTH_NAME,
  weekDays = WEEK_DAYS,
}: CalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null)
  const [currentMonth, setCurrentMonth] = useState<DateValue>(date)
  const [isMonth, setIsMonth] = useState<boolean>(true)

  function incrementYear(inc: number): void {
    setCurrentMonth(currentMonth.update('year', String(Number(currentMonth.year) + inc)))
  }

  function incrementMonth(inc: number): void {
    const newMonth = (parseInt(currentMonth.month) - 1) + inc
    const incYear = (11 < newMonth) ? 1 : (newMonth < 0) ? -1 : 0

    setCurrentMonth(
      currentMonth
        .update('month', String(((newMonth + 12) % 12) + 1).padStart(2, '0'))
        .update('year', String(+currentMonth.year + incYear))
    )
  }

  function advanceDate(isForward: boolean): void {
    const direction: number = isForward ? 1 : -1
    if (isMonth)
      incrementMonth(1 * direction)
    else
      incrementYear(4 * direction)
  }

  function getNextLeapYear(year: number): number {
    let selectedYear: number = Number(year)
    while (!isLeapYear(selectedYear))
      selectedYear += 1

    return selectedYear
  }

  function calendarTitle(): string {
    if (isMonth)
      return monthName[parseInt(currentMonth.month)] + ' / ' + currentMonth.year

    const baseLeapYear = getNextLeapYear(Number(currentMonth.year))
    return String(baseLeapYear - 7) + ' - ' + String(baseLeapYear + 4)
  }

  function renderDaysOfMonth(): JSX.Element {
    return <>
      <div style={styles.weekDays}>
        {weekDays.map((day) => {
          return <Text
            key={day}
            noSelection
            noWrap
            fontSize={12}
            textTag={TextTag.P}
            color={disabledFontColor}
            fontColor={fontColor}
            disabledFontColor={disabledFontColor}
            style={{ textAlign: 'center' }}
          >
            {day}
          </Text>
        })}
      </div>

      <div style={{ ...styles.body, ...styles.dayBody }}>
        {getDaysOfMonth(currentMonth).map((item: CalendarDay, index: number) => {
          let style: React.CSSProperties = item.selected
            ? { ...styles.day, backgroundColor: selectedDate }
            : item.diferentMonth
              ? { ...styles.day, backgroundColor: diferentMonth }
              : styles.day

          if (!item.enabled)
            style = { ...style, opacity: 0.4, cursor: 'not-allowed' }

          return renderCalendarItem(index, style, () => item.enabled && onSelect(item.date), item.date.day)
        })}
      </div>
    </>
  }

  function renderCalendarItem(index: number, style: React.CSSProperties, onClick: () => void, value: React.ReactNode): JSX.Element {
    return <div key={index} style={style} onClick={onClick}>
      <Text
        noWrap
        noSelection
        textTag={TextTag.P}
        fontColor={fontColor}
        disabledFontColor={disabledFontColor}
      >
        {value}
      </Text>
    </div>
  }

  function renderYear(): JSX.Element {
    return <div style={{ ...styles.body, ...styles.yearBody }}>
      {getYearsList(currentMonth).map((item: CalendarYear, index: number) => {
        let style: React.CSSProperties = item.selected
          ? { ...styles.year, backgroundColor: selectedDate }
          : styles.year

        if (!item.enabled)
          style = { ...style, opacity: 0.4, cursor: 'not-allowed' }

        return renderCalendarItem(index, style, () => {
          setCurrentMonth(currentMonth.update('year', String(item.year)))
          setIsMonth(true)
        }, item.year)
      })}
    </div>
  }

  function renderCalendar(): JSX.Element {
    return isMonth ? renderDaysOfMonth() : renderYear()
  }

  function renderHeader(): JSX.Element {
    return <>
      <div style={styles.header}>
        <LeftIcon
          size={18}
          color={disabledFontColor}
          onClick={() => advanceDate(false)}
        />
        <Text
          noSelection
          noWrap
          fontSize={14}
          textTag={TextTag.P}
          color={disabledFontColor}
          fontColor={fontColor}
          disabledFontColor={disabledFontColor}
          onClick={() => setIsMonth(!isMonth)}
          style={styles.headerTile}
        >
          {calendarTitle()}
        </Text>
        <RightIcon
          size={18}
          color={disabledFontColor}
          onClick={() => advanceDate(true)}
        />
      </div>

      <hr style={{ ...styles.sectionDivider, borderColor: disabledFontColor }} />
    </>
  }

  function getYearsList(selectedDate: DateValue): CalendarYear[] {
    let selectedYear: number = getNextLeapYear(Number(selectedDate.year))

    return Array.from({ length: 12 }, (_, i) => {
      const currentYear = selectedYear - 7 + i

      return {
        year: currentYear,
        selected: currentYear == Number(date.year),
        enabled: (!minDate || Number(minDate.year) <= currentYear) && (!maxDate || currentYear <= Number(maxDate.year)),
      }
    })
  }

  function getDaysOfMonth(selectedDate: DateValue): CalendarDay[] {
    const base: Date = new Date(Number(selectedDate.year), Number(selectedDate.month) - 1, 1)
    const firstDayOfWeek: number = base.getDay()

    return Array.from({ length: calendarItemCount }, (_, i) => {
      const today = new Date(base)
      today.setDate(base.getDate() - firstDayOfWeek + i)

      const dayDate = new DateValue(
        String(today.getDate()).padStart(2, '0'),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getFullYear()),
      )

      return {
        date: dayDate,
        selected: dayDate.eq(date),
        diferentMonth: today.getMonth() + 1 !== +selectedDate.month || today.getFullYear() !== +selectedDate.year,
        enabled: (!minDate || dayDate.gt(minDate)) && (!maxDate || dayDate.lt(maxDate)),
      }
    })
  }

  useEffect(() => {
    if (!show)
      return

    setCurrentMonth(date)
    const handleMouseDown = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node))
        setShow(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [show])

  if (!show)
    return null

  return <div
    ref={calendarRef}
    style={{
      ...styles.calendar,
      top: top,
      border: `1.5px solid ${borderColor}`,
      backgroundColor: backgroundColor,
    }}>
    {renderHeader()}
    {renderCalendar()}
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  calendar: {
    width: '230px',
    paddingBottom: '0.6em',
    right: 0,
    position: 'absolute',
    borderRadius: '8px',
    zIndex: 9999,
  },
  header: {
    width: '100%',
    padding: '0px 0.5rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '2px 0',
  },
  headerTile: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDivider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '0px 8px',
  },
  weekDays: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'grid',
    rowGap: '4px',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0px 8px',
    margin: '4px 0px',
  },
  body: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '0px 8px',
    display: 'grid',
    rowGap: '4px',
  },
  dayBody: {
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(5, 1fr)',
  },
  yearBody: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
  },
  day: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25px',
    height: '25px',
    borderRadius: '6px',
  },
  year: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '6px',
  },
}
