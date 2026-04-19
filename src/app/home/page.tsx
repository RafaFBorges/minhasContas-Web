'use client'

import React, { useEffect, useState } from 'react'

import {
  EXPENSES_ENDPOINT,
  handleDELETE,
} from '@/comunication/ApiResthandler'
import { handleEditExpense } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import ThemeCard from '../../../components/themeComponents/themeCard'
import { useModal } from '../../../utils/hook/modalHook'
import ExpenseConfiguration, { ExpenseVerifyData } from '../../modalPages/ExpenseConfiguration'
import { TextTag } from '../../../components/api/text'
import ThemeText from '../../../components/themeComponents/themeText'
import { LanguageOption, useTranslate } from '../../../utils/hook/translateHook'
import { Category } from '@/domain/Category'
import { Tag } from '@/domain/Tag'
import FilterList from '../../../components/lists/filterList'
import ExpenseUI from '@/fragments/expenseUI'
import { getRealString } from '../../../utils/financialUtils'
import { useUser } from '../../../utils/hook/userHook'
import { useTheme } from '../../../utils/hook/themeHook'


export default function Home() {
  const SUBTITLE_KEY = 'Home.Subtitle'
  const PROPERTIES_TITLE_KEY = 'Home.PropertiesTitle'

  const { openModal } = useModal()
  const { addKey, getValue, language } = useTranslate()
  const { sideColor } = useTheme()
  const {
    financialList,
    categoriesList,
    total,
    deleteFinancial,
    editFinancialResponse,
    filterSelection,
    userInfo
  } = useUser()

  const [filteredexpenses, setFilteredexpenses] = useState<Expense[]>([])
  const [tagList, setTagList] = useState<Array<Tag>>([])
  const [filterList, setFilterList] = useState<Array<Tag>>([])
  const [expensesText, setExpensesText] = useState<string>(translate())

  function translate(): string {
    addKey(PROPERTIES_TITLE_KEY, 'Editar despesa', LanguageOption.PT_BR)
    addKey(PROPERTIES_TITLE_KEY, 'Edit expense', LanguageOption.EN)
    addKey(SUBTITLE_KEY, 'Despesas', LanguageOption.PT_BR)
    return addKey(SUBTITLE_KEY, 'Expenses', LanguageOption.EN)
  }

  const handleDeleteClick = async (index: number) => {
    const wasDeleted: boolean = await handleDELETE(EXPENSES_ENDPOINT + '/' + index, userInfo.token)

    if (wasDeleted)
      deleteFinancial(index)
  }

  const handleEditClick = (expense: Expense) => {
    openModal(getValue(PROPERTIES_TITLE_KEY), () => expenseEditContent(expense), (item: unknown) => handleEditExpense(item, expense, editFinancialResponse, userInfo.token), true)
  }

  const expenseEditContent = (expense: Expense) => {
    const tags: Array<Tag> = Category.getTagList(expense.categories, true)
    return <ExpenseConfiguration
      oldValue={expense.value}
      oldCategories={tags}
      enabledVerify={(item: ExpenseVerifyData) => expense.value != item.value || !Tag.sameTagList(tags, item.tags)}
    />
  }

  useEffect(() => {
    translate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setExpensesText(getValue(SUBTITLE_KEY))
  }, [language])

  useEffect(() => {
    setTagList(Category.getTagList(categoriesList, true))
    setFilterList(Category.getTagList(categoriesList, true, filterSelection))
  }, [categoriesList])

  return <main style={styles.page}>
    <ThemeText noWrap textTag={TextTag.H1} color={sideColor(total)}>{getRealString(total, language)}</ThemeText>
    <ThemeText noWrap textTag={TextTag.H3}>{expensesText}</ThemeText>

    <ExpenseUI
      isLoadLastEdition
      hasAddButton
      tagList={tagList}
      setTagList={setTagList}
    />

    <FilterList
      style={styles.filterContainer}
      tagList={filterList}
      setTagList={setFilterList}
      listToFilter={financialList}
      setter={setFilteredexpenses}
      filterCondition={(item: Expense, category: Tag): boolean => item.isCategory(category.id)}
    />

    <div style={styles.scrollList}>
      {filteredexpenses != null && filteredexpenses.map(item => {
        return <ThemeCard
          key={item.id}
          id={item.id}
          title={item.asText}
          categories={item.categories}
          editClickHandle={() => handleEditClick(item)}
          deleteClickHandle={handleDeleteClick}
          date={item.lastDate}
        />
      })}
    </div>
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '0em 1em 1em 1rem',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    boxSizing: 'border-box',
  },
  filterContainer: {
    marginTop: '1.2em',
  },
  scrollList: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxSizing: 'border-box',
    gap: '0.7em',
    marginTop: '0.3em',
  }
}
