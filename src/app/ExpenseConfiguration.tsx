'use client'

import React, { useEffect, useState } from 'react'

import ModalContentProps from './ModalPagePropsInterface'
import { useModal } from '../../utils/hook/modalHook'
import Spin from '../../components/spin'
import TagList from '../../components/tagList'
import { Category } from '@/domain/Category'

interface ExpenseConfigurationProps extends ModalContentProps<number> {
  oldValue: number;
  oldCategories: Array<Category>;
}

export default function ExpenseConfiguration({ oldValue, oldCategories, enabledVerify = null }: ExpenseConfigurationProps) {
  const [value, setValue] = useState<number>(oldValue)
  const [categories, setCategories] = useState<Array<Category>>(oldCategories)

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
    <TagList style={styles.tagContainer} itensList={categories} />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    width: '100%',
  },
  tagContainer: {
    marginTop: '0.5em'
  }
}
