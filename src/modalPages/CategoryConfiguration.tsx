'use client'

import React, { useEffect, useState } from 'react'

import ModalContentProps from './ModalPagePropsInterface'
import { useModal } from '../../utils/hook/modalHook'
import StyledInput from '../../components/input/input'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'


export interface CategoryVerifyData {
  name: string;
}

interface CategoryConfigurationProps extends ModalContentProps<CategoryVerifyData> {
  oldValue: string;
}

export default function CategoryConfiguration({ oldValue, enabledVerify = null }: CategoryConfigurationProps) {
  const NAME_PLACEHOLDER_KEY = 'CategoryConfiguration.NamePlaceholder'

  const [name, setName] = useState<string>(oldValue)
  const [placeholder, setPlaceholder] = useState<string>('')

  const { setEnabledSave, setData } = useModal()
  const { addKeys, getValue, language } = useTranslate()

  function translate() {
    addKeys(NAME_PLACEHOLDER_KEY, [{ value: 'Nome', lang: LanguageOption.PT_BR }, { value: 'Name', lang: LanguageOption.EN },])
  }

  useEffect(() => {
    if (enabledVerify != null)
      setEnabledSave(enabledVerify({
        name: name,
      }))

    setData('name', name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    translate()
    setPlaceholder(getValue(NAME_PLACEHOLDER_KEY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPlaceholder(getValue(NAME_PLACEHOLDER_KEY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return <div style={styles.content}>
    <StyledInput
      placeholder={placeholder}
      type={'text'}
      name={'categoryName'}
      value={name}
      changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
    />
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
