import { CurrencyAmount, Percent, Trade, TradeType } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { formatExecutionPrice } from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini } from './styleds'

export default function SwapModalFooter({
  trade,
  showInverted,
  setShowInverted,
  severity,
  slippageAdjustedAmounts,
  onSwap,
  parsedAmounts,
  realizedLPFee,
  priceImpactWithoutFee,
  confirmText
}: {
  trade?: Trade
  showInverted: boolean
  setShowInverted: (inverted: boolean) => void
  severity: number
  slippageAdjustedAmounts?: { [field in Field]?: CurrencyAmount }
  onSwap: () => any
  parsedAmounts?: { [field in Field]?: CurrencyAmount }
  realizedLPFee?: CurrencyAmount
  priceImpactWithoutFee?: Percent
  confirmText: string
}) {
  const theme = useContext(ThemeContext)

  if (!trade) {
    return null
  }

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {trade?.tradeType === TradeType.EXACT_INPUT ? '最少獲得' : '最多賣出'}
            </TYPE.black>
            <QuestionHelper text="確認之前如果出現較大的不利價格變動，則您的交易會被取消恢復。" />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>
              {trade?.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TYPE.black>
            {parsedAmounts[Field.OUTPUT] && parsedAmounts[Field.INPUT] && (
              <TYPE.black fontSize={14} marginLeft={'4px'}>
                {trade?.tradeType === TradeType.EXACT_INPUT
                  ? parsedAmounts[Field.OUTPUT]?.currency?.symbol
                  : parsedAmounts[Field.INPUT]?.currency?.symbol}
              </TYPE.black>
            )}
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              滑點限制
            </TYPE.black>
            <QuestionHelper text="市場價格和您的價格之間的差額取決於交易量。" />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              流動性提供者費用
            </TYPE.black>
            <QuestionHelper text="每筆交易的一部分（0.30％）作為協議激勵給流動性提供者。" />
          </RowFixed>
          <TYPE.black fontSize={14}>
            {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade?.inputAmount?.currency?.symbol : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError onClick={onSwap} error={severity > 2} style={{ margin: '10px 0 0 0' }} id="confirm-swap-or-send">
          <Text fontSize={20} fontWeight={500}>
            {confirmText}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  )
}
