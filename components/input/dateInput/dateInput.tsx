import React, { useEffect, useRef, useState } from 'react'

import { StyledInputProps } from '../input'
import { FaRegCalendar as CalendarIcon } from 'react-icons/fa'
import { validateDate } from '../../../utils/validations'
import Text from '../../api/text'
import SpinInput from '../spinInput'
import { CalendarProps } from './calendar'


export interface DateInputProps extends StyledInputProps {
  iconColor?: string
  maxDate?: DateValue
  minDate?: DateValue
  Calendar?: React.ComponentType<CalendarProps>
}

export type DateField = 'day' | 'month' | 'year'

export class DateValue {
  day: string
  month: string
  year: string

  constructor(day: string, month: string, year: string) {
    this.day = day
    this.month = month
    this.year = year
  }

  update(field: DateField, value: string): DateValue {
    return new DateValue(
      field === 'day' ? value : this.day,
      field === 'month' ? value : this.month,
      field === 'year' ? value : this.year,
    )
  }

  private toNumber(): number {
    return +`${this.year}${this.month.padStart(2, '0')}${this.day.padStart(2, '0')}`
  }

  lt(other: DateValue): boolean { return this.toNumber() < other.toNumber() }   // <
  gt(other: DateValue): boolean { return this.toNumber() > other.toNumber() }   // >
  lte(other: DateValue): boolean { return this.toNumber() <= other.toNumber() } // <=
  gte(other: DateValue): boolean { return this.toNumber() >= other.toNumber() } // >=
  eq(other: DateValue): boolean { return this.toNumber() === other.toNumber() } // ==
}

export default function DateInput({
  name,
  value,
  changeHandle,
  style = null,
  height = 36,
  borderErrorColor = '#e24b4a',
  borderSuccessColor = '#639922',
  borderNormalColor = '#d1d5db',
  validate = undefined,
  onKeyDown = undefined,
  iconColor = '#6b7280',
  isValid = null,
  onBlur = undefined,
  maxDate = undefined,
  minDate = undefined,
  Calendar = undefined,
  isTouched = false,
  setIsTouched = undefined,
}: DateInputProps) {
  const TEXT_WIDTH = 152
  const DAY_FIELD = 'day'
  const MONTH_FIELD = 'month'
  const YEAR_FIELD = 'year'

  const [show, setShow] = useState<boolean>(false)
  const [hasIconSpace, setHasIconSpace] = useState<boolean>(false)
  const [dateStruct, setDateStruct] = useState<DateValue>(getDateStruct(String(value)))
  const [isValidState, setIsValid] = useState<boolean | null>(getValidState())
  const [touched, setTouched] = useState(isTouched)
  const [focused, setFocused] = useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  const iconSize = 18
  const iconTop = height / 2 - iconSize / 2
  const calendarMargin = 6

  const validValue = focused
    ? null
    : validate !== undefined
      ? isValidState
      : touched ? isValid : null

  const borderColor = validValue === false
    ? borderErrorColor
    : validValue === true
      ? borderSuccessColor
      : borderNormalColor

  const inputStyle: React.CSSProperties = {
    ...styles.container,
    height: height,
    border: `1.5px solid ${borderColor}`,
    ...style
  }

  function getValidState(): boolean | null {
    if (!isTouched)
      return null

    if (validate !== undefined)
      return validate(getSettedDate(dateStruct))

    return isValid !== undefined ? isValid : null
  }

  function getDateStruct(value: string): DateValue {
    const date = validateDate(String(value)) ? String(value) : getTodayDate()
    const [day, month, year] = date.split('/')

    return new DateValue(day, month, year)
  }

  function getTodayDate(): string {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  function getSettedDate(date: DateValue): string {
    return `${date.day}/${date.month}/${date.year}`
  }

  function isFocused(): boolean {
    return dayRef.current === document.activeElement || monthRef.current === document.activeElement || yearRef.current === document.activeElement
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(true)

    const target = e.target
    requestAnimationFrame(() => target.select())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, field: string) {
    const input = e.target as HTMLInputElement
    const isAtEnd = (input.selectionEnd === input.selectionStart) && (input.selectionStart === input.value.length)
    const isAtStart = (input.selectionEnd === input.selectionStart) && (input.selectionStart === 0)

    if (e.key === 'ArrowRight' && isAtEnd) {
      if (field === DAY_FIELD)
        monthRef.current?.focus()
      else if (field === MONTH_FIELD)
        yearRef.current?.focus()
    }

    if (e.key === 'ArrowLeft' && isAtStart) {
      if (field === MONTH_FIELD)
        dayRef.current?.focus()
      else if (field === YEAR_FIELD)
        monthRef.current?.focus()
    }

    if (onKeyDown)
      onKeyDown(e)
  }

  function blurStructHandle(_field: string) {
    const isFocusedNow = isFocused()
    setFocused(isFocusedNow)
    setTouched(true)

    if (setIsTouched != null)
      setIsTouched(true)

    if (!isFocusedNow && validate !== undefined)
      setIsValid(validate(getSettedDate(dateStruct)))

    if (!isFocusedNow && onBlur)
      onBlur()
  }

  function changeStructHandle(e: React.ChangeEvent<HTMLInputElement>, field: string) {
    if (validate !== undefined)
      setIsValid(null)

    const newValue = e.target.value

    const updatedStruct = dateStruct.update(field as DateField, newValue)
    setDateStruct(updatedStruct)

    if (changeHandle)
      changeHandle({ ...e, target: { ...e.target, value: getSettedDate(dateStruct), } } as React.ChangeEvent<HTMLInputElement>)
  }

  function changeCalendarHandle(value: DateValue) {
    if (!changeHandle)
      return

    setDateStruct(value)
    const event = { target: { value: getSettedDate(value) }, } as React.ChangeEvent<HTMLInputElement>
    changeHandle(event)
  }

  function checkHasIconSpace() {
    if (!containerRef.current)
      return

    const inputRect = containerRef.current.getBoundingClientRect()
    setHasIconSpace(TEXT_WIDTH < inputRect.width)
  }

  useEffect(() => {
    checkHasIconSpace()

    window.addEventListener('resize', checkHasIconSpace)
    return () => window.removeEventListener('resize', checkHasIconSpace)
  }, [])

  return <div ref={containerRef} style={inputStyle}  >
    <div style={styles.row}>
      <SpinInput
        ref={dayRef}
        disabledButtons
        padNumber={2}
        name={name + DAY_FIELD}
        value={dateStruct.day}
        changeHandle={(e) => changeStructHandle(e, DAY_FIELD)}
        style={styles.dayInput}
        step={1}
        max={31}
        min={1}
        height={25}
        onFocus={handleFocus}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, DAY_FIELD)}
        onBlur={() => blurStructHandle(DAY_FIELD)}
      />

      <Text>/</Text>

      <SpinInput
        ref={monthRef}
        disabledButtons
        padNumber={2}
        name={name + MONTH_FIELD}
        value={dateStruct.month}
        changeHandle={(e) => changeStructHandle(e, MONTH_FIELD)}
        style={styles.dayInput}
        step={1}
        max={12}
        min={1}
        height={25}
        onFocus={handleFocus}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, MONTH_FIELD)}
        onBlur={() => blurStructHandle(MONTH_FIELD)}
      />

      <Text>/</Text>

      <SpinInput
        ref={yearRef}
        disabledButtons
        padNumber={4}
        name={name + YEAR_FIELD}
        value={dateStruct.year}
        changeHandle={(e) => changeStructHandle(e, YEAR_FIELD)}
        style={styles.yearInput}
        step={1}
        max={9999}
        min={0}
        height={25}
        onFocus={handleFocus}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, YEAR_FIELD)}
        onBlur={() => blurStructHandle(YEAR_FIELD)}
      />
    </div>

    {Calendar && hasIconSpace && <CalendarIcon
      color={iconColor}
      size={iconSize}
      style={{ ...styles.icon, top: iconTop }}
      onMouseDown={() => setShow(true)}
    />}

    {Calendar && <Calendar
      show={show}
      setShow={setShow}
      date={dateStruct}
      top={height + calendarMargin}
      onSelect={changeCalendarHandle}
      maxDate={maxDate}
      minDate={minDate}
    />}
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    outline: 'none',
    fontSize: '1rem',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  row: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px',
  },
  dayInput: {
    margin: '0px',
    width: '34px',
    border: 'none',
  },
  yearInput: {
    width: '52px',
    margin: '0px',
    border: 'none',
  },
  icon: {
    position: 'absolute',
    right: '0.5rem',
    cursor: 'pointer',
  },
  calendar: {
    width: '200px',
    height: '150px',
    right: 0,
    position: 'absolute',
    backgroundColor: 'grey',
    borderRadius: '8px',
    zIndex: 9999,
  },
}
