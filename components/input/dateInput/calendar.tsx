import React, { useEffect, useRef, useState } from 'react'

import { HiChevronLeft as LeftIcon, HiChevronRight as RightIcon } from 'react-icons/hi'

import { DateValue } from './dateInput'
import Text, { TextTag } from '../../api/text'


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

  function incrementMonth(inc: number) {
    const newMonth = (parseInt(currentMonth.month) - 1) + inc
    const incYear = (11 < newMonth) ? 1 : (newMonth < 0) ? -1 : 0

    setCurrentMonth(
      currentMonth
        .update('month', String(((newMonth + 12) % 12) + 1).padStart(2, '0'))
        .update('year', String(+currentMonth.year + incYear))
    )
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
    <div style={styles.header}>
      <LeftIcon size={18} color={disabledFontColor} onClick={() => incrementMonth(-1)} />
      <Text
        noSelection
        noWrap
        fontSize={14}
        textTag={TextTag.P}
        color={disabledFontColor}
        fontColor={fontColor}
        disabledFontColor={disabledFontColor}
      >
        {monthName[parseInt(currentMonth.month)] + ' / ' + currentMonth.year}
      </Text>
      <RightIcon size={18} color={disabledFontColor} onClick={() => incrementMonth(1)} />
    </div>

    <hr style={{ ...styles.sectionDivider, borderColor: disabledFontColor }} />

    <div style={styles.weekDays}>
      {weekDays.map((day) => <Text
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
      )}
    </div>

    <div style={styles.body}>
      {getDaysOfMonth(currentMonth).map((item: CalendarDay, index: number) => {
        let style = item.selected
          ? { ...styles.day, backgroundColor: selectedDate }
          : item.diferentMonth
            ? { ...styles.day, backgroundColor: diferentMonth }
            : styles.day

        if (!item.enabled)
          style = { ...style, opacity: 0.4, cursor: 'not-allowed' }

        return <div key={index} style={style} onClick={() => item.enabled && onSelect(item.date)}>
          <Text
            noWrap
            noSelection
            textTag={TextTag.P}
            fontColor={fontColor}
            disabledFontColor={disabledFontColor}
          >
            {item.date.day}
          </Text>
        </div>
      })}
    </div>
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
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(5, 1fr)',
  },
  day: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25px',
    height: '25px',
    borderRadius: '6px',
  },
}
