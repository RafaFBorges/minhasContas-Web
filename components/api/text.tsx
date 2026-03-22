import React from 'react'


export enum TextTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
}

export interface TextProps<T> {
  children: React.ReactNode;
  textTag?: TextTag;
  style?: React.CSSProperties | null;
  onClick?: (item: T) => void;
  onMouseEnter?: (item: T | null) => void;
  onMouseLeave?: (item: T | null) => void;
}

export default function Text<T>({
  children,
  textTag = TextTag.P,
  style = null,
  onClick = () => { },
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}: TextProps<T>) {
  let textStyle: React.CSSProperties = (style != null) ? style : {}

  return React.createElement(
    textTag,
    {
      style: textStyle,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    },
    children
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  notSelectable: {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  }
}
