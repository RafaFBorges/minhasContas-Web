import React, { useEffect, useRef, useState } from 'react'

import { HiChevronLeft as LeftIcon, HiChevronRight as RightIcon } from 'react-icons/hi'

import { DateValue } from './dateInput'
import ThemeText from '../../themeComponents/themeText'
import { TextTag } from '../../api/text'
import { useTheme } from '../../../utils/hook/themeHook'


interface CalendarProps {
  date: DateValue
  show: boolean
  setShow: (show: boolean) => void
  top: number
  onSelect: (date: DateValue) => void
  maxDate?: DateValue
  minDate?: DateValue
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
}: CalendarProps) {
  const CALENDAR_ITEM_COUNT = 35
  const MONTH_NAME = {
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
  const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const calendarRef = useRef<HTMLDivElement>(null)
  const [currentMonth, setCurrentMonth] = useState<DateValue>(date)

  const { config } = useTheme()

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

    return Array.from({ length: CALENDAR_ITEM_COUNT }, (_, i) => {
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
        enabled: (!minDate || dayDate.gte(minDate)) && (!maxDate || dayDate.lte(maxDate)),
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
      border: `1.5px solid ${config.borderColor}`,
      backgroundColor: config.backgroundColor,
    }}>
    <div style={styles.header}>
      <LeftIcon size={18} color={config.disabledFontColor} onClick={() => incrementMonth(-1)} />
      <ThemeText noSelection noWrap fontSize={14} textTag={TextTag.P} color={config.disabledFontColor}>
        {MONTH_NAME[parseInt(currentMonth.month) as keyof typeof MONTH_NAME] + ' / ' + currentMonth.year}
      </ThemeText>
      <RightIcon size={18} color={config.disabledFontColor} onClick={() => incrementMonth(1)} />
    </div>

    <hr style={styles.sectionDivider} />

    <div style={styles.weekDays}>
      {WEEK_DAYS.map((day) => <ThemeText
        key={day}
        noSelection
        noWrap
        fontSize={12}
        textTag={TextTag.P}
        color={config.disabledFontColor}
        style={{ textAlign: 'center' }}
      >
        {day}
      </ThemeText>
      )}
    </div>

    <div style={styles.body}>
      {getDaysOfMonth(currentMonth).map((item: CalendarDay, index: number) => {
        let style = item.diferentMonth
          ? { ...styles.day, backgroundColor: config.diferentMonth }
          : item.selected
            ? { ...styles.day, backgroundColor: config.selectedDate }
            : styles.day

        if (!item.enabled)
          style = { ...style, opacity: 0.4, cursor: 'not-allowed' }

        return <div key={index} style={style} onClick={() => item.enabled && onSelect(item.date)}>
          <ThemeText noWrap noSelection textTag={TextTag.P}>{item.date.day}</ThemeText>
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
