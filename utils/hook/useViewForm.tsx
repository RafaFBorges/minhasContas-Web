import React, { ReactNode, useEffect, useState } from 'react'

import FrameworkInput from '../../components/framework/frameworkInput'
import ThemeText from '../../components/themeComponents/themeText'
import { TextTag } from '../../components/api/text'
import { FormInputField } from './useForm'
import ThemeButton from '../../components/themeComponents/themeButton'
import { LanguageOption, useTranslate } from './translateHook'


interface UseViewFormProps {
  orderedFields: () => FormInputField[]
  onFieldBlur: () => void
  handleChange: (name: string, value: string) => void
  onSucsess?: () => ReactNode
  title?: string
  subtitle?: string
  canSubmit: () => boolean
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

interface SectionBlock {
  sectionKey: string
  sectionLabel?: string
  rows: (FormInputField | FormInputField[])[]
}

interface UseViewReturn {
  renderForm: () => React.JSX.Element | undefined
  setSucess: (value: boolean) => void
}

export function useViewForm({ orderedFields, onFieldBlur, handleChange, onSucsess, title = undefined, subtitle = undefined, canSubmit, handleSubmit }: UseViewFormProps): UseViewReturn {
  const SUBMIT_KEY = 'Registration.Submit'

  const [sucess, setSucess] = useState<boolean>(false)
  const { addKeys, getValue } = useTranslate()

  function buildSections(): SectionBlock[] {
    const fields: FormInputField[] = orderedFields()
    const sections: SectionBlock[] = []
    const sectionMap: Map<string, SectionBlock> = new Map<string, SectionBlock>()
    const groupMap: Map<string, FormInputField[]> = new Map<string, FormInputField[]>()

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

  function renderField(item: FormInputField) {
    return <FrameworkInput
      key={item.name}
      {...item}
      onBlur={onFieldBlur}
      changeHandle={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.name, e.target.value)}
    />
  }

  function renderRow(row: FormInputField | FormInputField[], index: number) {
    if (Array.isArray(row)) {
      return <div key={row.map(f => f.name).join('-')} style={styles.group}>
        {row.map(renderField)}
      </div>
    }

    return renderField(row)
  }

  function renderFields() {
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

  function renderForm() {
    return <>
      <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{title}</ThemeText>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{subtitle}</ThemeText>
      <form noValidate>
        {sucess
          ? onSucsess ? onSucsess() : undefined
          : renderFields()}

        {!sucess && <div style={styles.buttonsContainer}>
          <ThemeButton enabled={canSubmit()} clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}>
            {getValue(SUBMIT_KEY)}
          </ThemeButton>
        </div>}
      </form>
    </>
  }

  useEffect(() => {
    addKeys(SUBMIT_KEY, [{ value: 'Cadastrar', lang: LanguageOption.PT_BR }, { value: 'Register', lang: LanguageOption.EN },])
  }, [])

  return { renderForm, setSucess }
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
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 500,
    margin: '0 0 0.25rem',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: '0 0 1.75rem',
  },
}
