import React from "react"

import { FaTrash as DeleteIcon } from 'react-icons/fa'

import StyledButton from "./button"

interface CardProps {
  title: number | string;
  date: string;
  id: number;
  deleteClickHandle?: (index: number) => void;
}

export default function Card({ title, date, id = -1, deleteClickHandle = () => { } }: CardProps) {
  return <div style={styles.card}>
    <div style={styles.content}>
      <div style={styles.flexRow}>
        <h6 style={styles.title}>{title}</h6>
        {deleteClickHandle != null &&
          <StyledButton
            clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => deleteClickHandle(id)}
            Icon={DeleteIcon}
            isClickableIcon
          />
        }
      </div>
      <p style={styles.date}>{date}</p>
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: '#fff',
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
  date: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: '#555',
  },
}
