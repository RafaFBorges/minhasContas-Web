'use client'

import React, { useEffect, useState } from 'react'

import ModalContentProps from './ModalPagePropsInterface'
import { useModal } from '../../utils/hook/modalHook'
import Spin from '../../components/spin'

interface ExpenseConfigurationProps extends ModalContentProps<number> {
  oldValue: number;
}

export default function ExpenseConfiguration({ oldValue, enabledVerify = null }: ExpenseConfigurationProps) {
  const [value, setValue] = useState<number>(oldValue)

  const { setEnabledSave, setData } = useModal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  useEffect(() => {
    if (enabledVerify != null)
      setEnabledSave(enabledVerify(value))

    setData('value', value)
  }, [value])

  return <div style={styles.content}>
    <Spin
      name={'expenseValue'}
      value={value}
      changeHandle={handleChange}
      setValueHandle={setValue}
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    width: '100%',
  }
}
