import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { oldConfig } from 'components/Menu/config/config'
import useTheme from 'hooks/useTheme'
import { useSSGBNBPrice, useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { usePhishingBannerManager } from 'state/user/hooks'
import { multiplyPriceByAmount } from 'utils/prices'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import { SettingsMode } from './GlobalSettings/types'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const ssgPriceBNB = useSSGBNBPrice({ forceMainnet: true })
  const bnbPriceUsd = useBNBBusdPrice({ forceMainnet: true })

  const { currentLanguage, setLanguage, t } = useTranslation()
  // const { pathname } = useRouter()
  const [showPhishingWarningBanner] = usePhishingBannerManager()

  // const menuItems = useMenuItems()

  // const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  // const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
  // useEffect(() => {
  //   console.log("Menu activeMenuItem: ", activeMenuItem?.href)
  //   console.log("Menu activeSubMenuItem: ", activeSubMenuItem?.href)
  // }, [activeMenuItem, activeSubMenuItem])

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  useEffect(() => {
    if (!isDark) {
      setTheme('dark')
    }
  }, [])

  return (
    <>
      <UikitMenu
        linkComponent={(linkProps) => {
          return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
        }}
        rightSide={
          <>
            <UserMenu />
          </>
        }
        banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={multiplyPriceByAmount(ssgPriceBNB, multiplyPriceByAmount(bnbPriceUsd, 1))}
        // links={menuItems}
        links={oldConfig}
        // subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        // activeItem={activeMenuItem?.href}
        // activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy CAKE')}
        {...props}
      />
    </>
  )
}

export default Menu
