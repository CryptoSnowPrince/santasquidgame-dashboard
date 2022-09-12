import React from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NextLinkFromReactRouter } from 'components/NextLink'

const StyledNav = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
`

function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const { t } = useTranslation()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem id="swap-nav-link" to="/swap" as={NextLinkFromReactRouter}>
          {t('Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/pool" as={NextLinkFromReactRouter}>
          {t('Liquidity')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav >
  )
}

export default Nav
