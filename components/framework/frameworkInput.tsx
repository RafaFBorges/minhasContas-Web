import React from 'react'
import { MAX_VALUE, MIN_VALUE } from '../../utils/DataConstants'
import StyledInput, { StyledInputProps } from '../input'
import ThemeText from '../themeComponents/themeText'
import { TextTag } from '../api/text'
import { useTheme } from '../../utils/hook/themeHook'

interface FrameworkInputProps extends StyledInputProps {
  label: string;
}

export default function FrameworkInput({
  type,
  name,
  label,
  value,
  placeholder,
  changeHandle,
  style = null,
  step = null,
  max = MAX_VALUE,
  min = MIN_VALUE,
  height = 36,
  borderErrorColor = undefined,
  borderSuccessColor = undefined,
  borderNormalColor = undefined,
  validate = undefined,
}: FrameworkInputProps) {
  const { config } = useTheme()

  return <div style={styles.container}>
    <ThemeText noSelection noWrap fontSize={14} style={styles.title} textTag={TextTag.P} color={config.disabledFontColor}>{label}</ThemeText>

    <StyledInput
      type={type}
      name={name}
      step={step != null ? step : 1}
      value={value}
      max={max}
      min={min = Number.MAX_VALUE ? MIN_VALUE : min}
      changeHandle={changeHandle}
      placeholder={placeholder}
      style={style}
      height={height}
      validate={validate}
      borderErrorColor={borderErrorColor ? borderErrorColor : config.borderErrorColor}
      borderSuccessColor={borderSuccessColor ? borderSuccessColor : config.borderSuccessColor}
      borderNormalColor={borderNormalColor ? borderNormalColor : config.borderColor}
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
