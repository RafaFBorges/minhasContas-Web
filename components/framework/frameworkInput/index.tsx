import React from 'react'

import { StyledInputProps } from '../../input/input'
import ThemeText from '../../themeComponents/themeText'
import { TextTag } from '../../api/text'
import { useTheme } from '../../../utils/hook/themeHook'
import { resolveInput } from './inputRegiostry'


interface FrameworkInputProps extends StyledInputProps {
  label: string;
}

export default function FrameworkInput({
  type = 'text',
  name,
  label,
  value,
  placeholder,
  changeHandle,
  style = null,
  height = 36,
  borderErrorColor = undefined,
  borderSuccessColor = undefined,
  borderNormalColor = undefined,
  isValid = null,
  validate = undefined,
  onBlur
}: FrameworkInputProps) {
  const { config } = useTheme()
  const InputComponent = resolveInput(type)

  return <div style={styles.container}>
    <ThemeText noSelection noWrap fontSize={14} style={styles.title} textTag={TextTag.P} color={config.disabledFontColor}>{label}</ThemeText>

    <InputComponent
      type={type}
      name={name}
      value={value}
      changeHandle={changeHandle}
      placeholder={placeholder}
      style={style}
      height={height}
      validate={validate}
      isValid={isValid}
      borderErrorColor={borderErrorColor ? borderErrorColor : config.borderErrorColor}
      borderSuccessColor={borderSuccessColor ? borderSuccessColor : config.borderSuccessColor}
      borderNormalColor={borderNormalColor ? borderNormalColor : config.borderColor}
      onBlur={onBlur}
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    outline: 'none',
    gap: '0.1rem',
    borderRadius: '8px',
    border: 'none',
    boxSizing: 'border-box',
  },
}
