import React from 'react'

import { FaTrash as DeleteIcon, FaEdit as EditIcon } from 'react-icons/fa'

import ThemeButton from '../themeButton'
import Text, { TextTag } from '../text'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'

export interface CardProps {
  title: string;
  date: string;
  category?: string;
  id: number;
  editClickHandle?: null | ((index: number) => void);
  deleteClickHandle?: null | ((index: number) => void);
  backgroundColor?: string;
}

export default function Card({ title, date, category, id = -1, editClickHandle = null, deleteClickHandle = null, backgroundColor = '' }: CardProps) {
  const UNKOWN_CATEGORY_KEY = 'unkownCategory'

  const { addKey, getValue } = useTranslate()

  let style = styles.card
  if (backgroundColor != '')
    style = { ...style, backgroundColor: backgroundColor }

  function translate() {
    addKey(UNKOWN_CATEGORY_KEY, 'desconhecido', LanguageOption.PT_BR)
    addKey(UNKOWN_CATEGORY_KEY, 'unkown', LanguageOption.EN)
  }

  translate()

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
      <div style={styles.category}>
        <Text textTag={TextTag.P} style={styles.categoryTitle} disabled>{category ? category : getValue(UNKOWN_CATEGORY_KEY)}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
  },
  category: {
    margin: '0 0 0.5rem 0',
  },
  categoryTitle: {
    fontSize: '0.85rem',
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
