'use client'

import React, { forwardRef, useState } from 'react'
import { IconType } from 'react-icons'
import { lightenCor } from '../../utils/colors'

export interface StyledButtonProps {
  children?: React.ReactNode;
  clickHandle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  clickHandleDisabled?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  Icon?: IconType | null;
  isClickableIcon?: boolean;
  width?: string;
  enabled?: boolean;
  iconSize?: string;
  isSecondary?: boolean;
  borderRadius?: string;
  color?: string;
  style?: React.CSSProperties | null;
}

const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(({
  children,
  clickHandle,
  clickHandleDisabled,
  Icon = null,
  isClickableIcon = false,
  width = '',
  enabled = true,
  iconSize = '16',
  isSecondary = false,
  borderRadius = '4px',
  color = '#0070f3',
  style = undefined,
}: StyledButtonProps, ref) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const LIGHTEN_FACTOR = 15
  const actualColor = (isHovered) ? lightenCor(color, LIGHTEN_FACTOR) : color

  let buttonStyle: React.CSSProperties = isClickableIcon
    ? { ...styles.clickableIcon, color: actualColor }
    : isSecondary
      ? { ...styles.buttonSecondary, border: 'solid ' + actualColor + ' 2px' }
      : { ...styles.button, backgroundColor: actualColor }

  buttonStyle = { ...buttonStyle, borderRadius: borderRadius }
  if (width != '')
    buttonStyle = { ...buttonStyle, width: width }

  if (!enabled)
    buttonStyle = (isClickableIcon)
      ? { ...buttonStyle, color: '#696969ff', ...styles.notClickable }
      : { ...buttonStyle, backgroundColor: '#696969ff', ...styles.notClickable }

  buttonStyle = { ...buttonStyle, ...style }

  const handleMouseEnter = () => { setIsHovered(true) }
  const handleMouseLeave = () => { setIsHovered(false) }

  return <button
    type={'button'}
    ref={ref}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={enabled ? clickHandle : clickHandleDisabled}
    style={buttonStyle}
  >
    {children}
    {Icon != null &&
      <Icon
        color={isSecondary && !isClickableIcon ? actualColor : undefined}
        size={iconSize}
      />
    }
  </button>
})

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    padding: '0.3rem',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickableIcon: {
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notClickable: {
    cursor: 'default',
  }
}

StyledButton.displayName = 'StyledButton'
export default StyledButton
