import React, { ReactNode, useEffect, useState } from 'react'

import { IconType } from 'react-icons'

import FrameworkInput from '../../components/framework/frameworkInput'
import ThemeText from '../../components/themeComponents/themeText'
import { TextTag } from '../../components/api/text'
import { FormInputField } from './useForm'
import ThemeButton from '../../components/themeComponents/themeButton'
import { LanguageOption, useTranslate } from './translateHook'
import { PaginationItem, usePagination } from './usePagination'


interface UseViewFormProps {
  orderedFields: () => FormInputField[]
  onFieldBlur: () => void
  handleChange: (name: string, value: string) => void
  onSuccess?: () => ReactNode
  title?: string
  subtitle?: string
  canSubmit: () => boolean
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

interface SectionBlock {
  sectionKey: string
  sectionLabel?: string
  Icon?: IconType | undefined
  rows: (FormInputField | FormInputField[])[]
}

interface UseViewReturn {
  renderForm: () => React.JSX.Element | undefined
  setSucess: (value: boolean) => void
}

export function useViewForm({
  orderedFields,
  onFieldBlur,
  handleChange,
  onSuccess,
  title = undefined,
  subtitle = undefined,
  canSubmit,
  handleSubmit,
}: UseViewFormProps): UseViewReturn {
  const SUBMIT_KEY = 'Registration.Submit'

  const [sucess, setSucess] = useState<boolean>(false)
  const { addKeys, getValue, language } = useTranslate()
  const [submitLabel, setSubmitLabel] = useState<string>(translate())
  const [paginationList,] = useState<PaginationItem[]>(buildPagination())
  const { renderController, renderNextButton, renderPreviousButton, renderContent } = usePagination({
    list: paginationList,
    firstIndex: 0,
    lastAction: {
      buttonName: submitLabel,
      action: (e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e),
      enabled: canSubmit,
    }
  })

  function translate(): string {
    return addKeys(SUBMIT_KEY, [{ value: 'Cadastrar', lang: LanguageOption.PT_BR }, { value: 'Register', lang: LanguageOption.EN },])
  }

  function CanGoFurther(section: SectionBlock): boolean {
    if (section == null || section.rows == null)
      return true

    if (!Array.isArray(section.rows)) {
      const isValidRow: boolean | null = (section.rows as FormInputField).isValid
      return isValidRow != null && isValidRow
    }

    for (const row of section.rows) {
      if (Array.isArray(row)) {
        for (const field of row)
          if (!field.isValid)
            return false
      } else {
        if (!row.isValid)
          return false
      }
    }

    return true
  }

  function buildPagination(): PaginationItem[] {
    const sections: SectionBlock[] = buildSections()

    return sections.map((section, index) => {
      return {
        name: section.sectionLabel ?? section.sectionKey,
        Icon: section.Icon,
        renderPage: () => {
          const current = buildSections().find(s => s.sectionKey === section.sectionKey)
          return current ? renderSectionRows(current) : undefined
        },
        canGoFurther: (): boolean => {
          const current = buildSections().find(s => s.sectionKey === section.sectionKey)

          return current
            ? CanGoFurther(current) && ((index != sections.length - 1) || canSubmit())
            : true
        },
      }
    })
  }

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
          Icon: field.sectionIcon,
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

  function renderSectionRows(section: SectionBlock) {
    return (
      <div>
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
            {renderRow(row)}
            {rIndex < section.rows.length - 1 && <div style={styles.rowDivider} />}
          </div>
        ))}
      </div>
    )
  }

  function renderRow(row: FormInputField | FormInputField[]) {
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
          {renderSectionRows(section)}
          {sIndex < sections.length - 1 && <hr style={styles.sectionDivider} />}
        </div>
      ))}
    </div>
  }

  function renderButtons(): React.JSX.Element | undefined {
    if (paginationList.length <= 0)
      return <ThemeButton enabled={canSubmit()} clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}>
        {submitLabel}
      </ThemeButton>

    return <div style={styles.buttonsContainer}>
      {renderPreviousButton()}
      {renderNextButton()}
    </div>
  }

  function renderFormContent(): React.JSX.Element | undefined {
    if (sucess)
      return onSuccess ? <>{onSuccess()}</> : undefined

    return paginationList.length <= 0 ? renderFields() : renderContent()
  }

  function renderForm() {
    return <>
      <div style={styles.header}>
        <ThemeText noSelection noWrap style={styles.title} textTag={TextTag.H1} color={'#000'}>{title}</ThemeText>
        {!sucess && renderController()}
      </div>
      <ThemeText noSelection noWrap style={styles.subtitle} textTag={TextTag.P} color={'#000'}>{subtitle}</ThemeText>
      <form noValidate>
        {renderFormContent()}
        {!sucess && renderButtons()}
      </form>
    </>
  }

  useEffect(() => {
    setSubmitLabel(getValue(SUBMIT_KEY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

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
    overflow: 'hidden',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
