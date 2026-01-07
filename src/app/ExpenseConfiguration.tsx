'use client'

import React from 'react'

import ModalContentProps from './ModalPagePropsInterface'
import { Tag } from '@/domain/Tag'
import ExpenseUI from '@/fragments/expenseUI'


export interface ExpenseVerifyData {
  value: number;
  tags: Array<Tag>;
}

interface ExpenseConfigurationProps extends ModalContentProps<ExpenseVerifyData> {
  oldValue: number;
  oldCategories: Array<Tag>;
}

export default function ExpenseConfiguration({ oldValue, oldCategories, enabledVerify = null }: ExpenseConfigurationProps) {
  return <ExpenseUI
    startValue={oldValue}
    enabledVerify={enabledVerify}
    tagList={oldCategories}
  />
}
