import { Currency, CurrencyAmount } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { isAddress, shortenAddress } from '../../utils'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { TruncatedText } from './styleds'

export default function SwapModalHeader({
  currencies,
  formattedAmounts,
  slippageAdjustedAmounts,
  priceImpactSeverity,
  independentField,
  recipient
}: {
  currencies: { [field in Field]?: Currency }
  formattedAmounts: { [field in Field]?: string }
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount }
  priceImpactSeverity: number
  independentField: Field
  recipient: string | null
}) {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <TruncatedText fontSize={24} fontWeight={500}>
          {formattedAmounts[Field.INPUT]}
        </TruncatedText>
        <RowFixed gap="4px">
          <CurrencyLogo currency={currencies[Field.INPUT]} size={'24px'} />
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {currencies[Field.INPUT]?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} />
      </RowFixed>
      <RowBetween align="flex-end">
        <TruncatedText fontSize={24} fontWeight={500} color={priceImpactSeverity > 2 ? theme.red1 : ''}>
          {formattedAmounts[Field.OUTPUT]}
        </TruncatedText>
        <RowFixed gap="4px">
          <CurrencyLogo currency={currencies[Field.OUTPUT]} size={'24px'} />
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {currencies[Field.OUTPUT]?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {independentField === Field.INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`預估收益。您至少會收到 `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {currencies[Field.OUTPUT]?.symbol}
            </b>
            {' 否則交易將取消。'}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`預估付出.您最多將出售 `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {currencies[Field.INPUT]?.symbol}
            </b>
            {' 否則交易將取消。'}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
