'use client'

import React, { useEffect, useState } from 'react'

import StyledInput from '../../components/input'
import ModalContentProps from './ModalPagePropsInterface'
import { useModal } from '../../utils/hook/modalHook'

interface ExpenseConfigurationProps extends ModalContentProps {
  oldValue: number;
}

export default function ExpenseConfiguration({ oldValue, enabledVerify = null }: ExpenseConfigurationProps) {
  const [value, setValue] = useState<number>(oldValue)
  const { setEnabledSave, setData } = useModal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed)) {
      setValue(parsed)

      if (enabledVerify != null)
        setEnabledSave(enabledVerify(parsed))

      setData('value', parsed)
    }
  }

  useEffect(() => {
    if (enabledVerify != null)
      setEnabledSave(enabledVerify(value))

    setData('value', value)
  }, [])

  return <div style={styles.content}>
    <StyledInput
      type={'number'}
      name={'expenseValue'}
      value={value}
      changeHandle={handleChange}
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    width: '100%',
  }
}