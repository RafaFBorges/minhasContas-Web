import React from 'react'

import { FaTrash as DeleteIcon, FaEdit as EditIcon } from 'react-icons/fa'

import ThemeButton from '../themeButton'
import Text, { TextTag } from '../text'

export interface CardProps {
  title: string;
  date: string;
  id: number;
  editClickHandle?: null | ((index: number) => void);
  deleteClickHandle?: null | ((index: number) => void);
  backgroundColor?: string;
}

export default function Card({ title, date, id = -1, editClickHandle = null, deleteClickHandle = null, backgroundColor = '' }: CardProps) {
  let style = styles.card
  if (backgroundColor != '')
    style = { ...style, backgroundColor: backgroundColor }

  return <div style={style}>
    <div style={styles.content}>
      <div style={styles.flexRow}>
        <Text textTag={TextTag.H6} style={styles.title} noWrap>{title}</Text>
        <div style={styles.buttonsArea}>
          {editClickHandle != null &&
            <ThemeButton
              clickHandle={() => editClickHandle(id)}
              Icon={EditIcon}
              isClickableIcon
            />
          }
          {deleteClickHandle != null &&
            <ThemeButton
              clickHandle={() => deleteClickHandle(id)}
              Icon={DeleteIcon}
              isClickableIcon
            />
          }
        </div>
      </div>
      <Text textTag={TextTag.P} style={styles.date} disabled>{date}</Text>
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '350px',
    marginTop: '2rem',
  },
  content: {
    padding: '1rem',
  },
  flexRow: {
    display: 'flex',
    gap: '0.5em',
    margin: '0 0 0.5rem 0',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.25rem',
  },
  buttonsArea: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
  },
}
