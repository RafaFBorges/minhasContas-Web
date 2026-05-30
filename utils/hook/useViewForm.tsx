import React from 'react'
import FrameworkInput from '../../components/framework/frameworkInput'
import ThemeText from '../../components/themeComponents/themeText'
import { TextTag } from '../../components/api/text'
import { FormInputField } from './useForm'

interface UseViewFormProps {
  orderedFields: () => FormInputField[]
  onFieldBlur: () => void
  handleChange: (name: string, value: string) => void
}

interface SectionBlock {
  sectionKey: string
  sectionLabel?: string
  rows: (FormInputField | FormInputField[])[]
}

export function useViewForm({ orderedFields, onFieldBlur, handleChange }: UseViewFormProps) {

  const buildSections = (): SectionBlock[] => {
    const fields = orderedFields()
    const sections: SectionBlock[] = []
    const sectionMap = new Map<string, SectionBlock>()
    const groupMap = new Map<string, FormInputField[]>()

    for (const field of fields) {
      const sectionKey = field.section ?? '__default__'

      if (!sectionMap.has(sectionKey)) {
        const block: SectionBlock = {
          sectionKey,
          sectionLabel: field.section,
          rows: [],
        }

        sectionMap.set(sectionKey, block)
        sections.push(block)
      }

      const section = sectionMap.get(sectionKey)!

      if (field.group) {
        const groupKey = `${sectionKey}::${field.group}`

        if (!groupMap.has(groupKey)) {
          const group: FormInputField[] = []
          groupMap.set(groupKey, group)
          section.rows.push(group)
        }

        groupMap.get(groupKey)!.push(field)
      } else
        section.rows.push(field)
    }

    return sections
  }

  const renderField = (item: FormInputField) => (
    <FrameworkInput
      key={item.name}
      {...item}
      onBlur={onFieldBlur}
      changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.name, e.target.value)}
    />
  )

  const renderRow = (row: FormInputField | FormInputField[], index: number) => {
    if (Array.isArray(row)) {
      return <div key={row.map(f => f.name).join('-')} style={styles.group}>
        {row.map(renderField)}
      </div>
    }

    return renderField(row)
  }

  const renderFields = () => {
    const sections = buildSections()

    return <div>
      {sections.map((section, sIndex) => (
        <div key={section.sectionKey}>
          {section.sectionLabel && (
            <ThemeText
              noSelection
              noWrap
              style={styles.sectionLabel}
              textTag={TextTag.P}
              color={'#000'}
            >
              {section.sectionLabel}
            </ThemeText>
          )}

          {section.rows.map((row, rIndex) => (
            <div key={rIndex}>
              {renderRow(row, rIndex)}
              {rIndex < section.rows.length - 1 && <div style={styles.rowDivider} />}
            </div>
          ))}

          {sIndex < sections.length - 1 && <hr style={styles.sectionDivider} />}
        </div>
      ))}
    </div>
  }

  return { renderFields }
}

const styles: { [key: string]: React.CSSProperties } = {
  group: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 1rem',
  },
  rowDivider: {
    height: 8,
  },
  sectionDivider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '1.25rem 0',
  },
}
