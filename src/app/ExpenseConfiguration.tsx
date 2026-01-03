'use client'

import React, { useEffect, useState } from 'react'

import ModalContentProps from './ModalPagePropsInterface'
import { useModal } from '../../utils/hook/modalHook'
import Spin from '../../components/spin'
import TagList from '../../components/lists/tagList'
import { Tag } from '@/domain/Tag'


export interface ExpenseVerifyData {
  value: number;
  tags: Array<Tag>;
}

interface ExpenseConfigurationProps extends ModalContentProps<ExpenseVerifyData> {
  oldValue: number;
  oldCategories: Array<Tag>;
}

export default function ExpenseConfiguration({ oldValue, oldCategories, enabledVerify = null }: ExpenseConfigurationProps) {
  const [value, setValue] = useState<number>(oldValue)
  const [categories, setCategories] = useState<Array<Tag>>(oldCategories.map((tag: Tag) => tag.clone()))

  const { setEnabledSave, setData } = useModal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  useEffect(() => {
    if (enabledVerify != null)
      setEnabledSave(enabledVerify({
        value: value,
        tags: categories
      }))

    setData('value', value)
    setData('categories', categories)
  }, [value, categories])

  return <div style={styles.content}>
    <Spin
      name={'expenseValue'}
      value={value}
      changeHandle={handleChange}
      setValueHandle={setValue}
    />
    <TagList style={styles.tagContainer} tagList={categories} setTagList={setCategories} selectable addNewTags />
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
