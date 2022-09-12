import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

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
        {/* <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}> */}
        <ButtonMenuItem id="swap-nav-link" as="a">
          {t('Swap')}
        </ButtonMenuItem>
        {/* <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}> */}
        <ButtonMenuItem id="pool-nav-link" as="a">
          {t('Liquidity')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
