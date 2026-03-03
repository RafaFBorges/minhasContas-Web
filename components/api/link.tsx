import React from 'react'


export interface LinkProps {
  children: React.ReactNode;
  style?: React.CSSProperties | null;
  href: string;
  color?: string;
}

export default function Link({
  children,
  style,
  href,
  color = '#33ebeb'
}: LinkProps) {
  const linkStyle = { ...styles.link, ...style }
  if (color != '')
    linkStyle.color = color

  return <a style={linkStyle} href={href}>{children}</a>
}

const styles: { [key: string]: React.CSSProperties } = {
  link: {
    color: '#33ebeb'
  }
}
