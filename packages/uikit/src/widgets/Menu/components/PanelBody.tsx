import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { SvgProps } from "../../../components/Svg";
import * as IconModule from "../icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelProps, PushedProps } from "../types";

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  border-top: solid 2px rgba(133, 133, 133, 0.1);
  padding-top: 5px;
`;

const WrapMenuEntry = styled.div<{ isActive: boolean }>`
  box-shadow: ${({ isActive }) => (isActive ? `rgb(159 84 68) 0px 0px 20px 0px;` : "none")};
  margin-top: 10px;
  position: relative;

  ${({ isActive }) =>
    isActive
      ? `&:after {
    border-right: 17px solid rgb(157, 60, 45);
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    content: "";
    display: inline-block;
    position: absolute;
    right: 0px;
    opacity: 0.7;
    top: 15px;
    transition: opacity 150ms ease-in 0s;
    z-index: 100;
  }`
      : ``};
`;

const StakingIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      className="bi bi-cash-coin"
      viewBox="0 0 16 16"
    >
      <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
      <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
      <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
      <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
    </svg>
  );
};

const TelegramIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      className="bi bi-telegram"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
    </svg>
  );
};

const TradeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      className="bi bi-cash-coin"
      viewBox="2 2 20 18"
    >
      <path d="M18.86 4.86003L21.65 7.65003C21.84 7.84003 21.84 8.16003 21.64 8.35003L18.85 11.14C18.54 11.46 18 11.24 18 10.79V9.00003H4C3.45 9.00003 3 8.55003 3 8.00003C3 7.45003 3.45 7.00003 4 7.00003H18V5.21003C18 4.76003 18.54 4.54003 18.86 4.86003ZM5.14001 19.14L2.35001 16.35C2.16001 16.16 2.16001 15.84 2.36001 15.65L5.15001 12.86C5.46001 12.54 6.00001 12.76 6.00001 13.21V15H20C20.55 15 21 15.45 21 16C21 16.55 20.55 17 20 17H6.00001V18.79C6.00001 19.24 5.46001 19.46 5.14001 19.14Z" />
    </svg>
  );
};

const TwitterIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      className="bi bi-twitter"
      viewBox="0 0 16 16"
    >
      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
    </svg>
  );
};

const menuIcon = (icon: string) => {
  switch (icon) {
    case "TradeIcon":
      return TradeIcon;
    case "StakingIcon":
      return StakingIcon;
    case "TelegramIcon":
      return TelegramIcon;
    case "TwitterIcon":
      return TwitterIcon;
    default:
      return TradeIcon;
  }
};

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  //   const location = useLocation();
  const [pathname, setPathname] = useState("/swap");

  useEffect(() => {
    if (location?.pathname === "" || location?.pathname === "/") {
      setPathname("/swap");
    } else {
      setPathname(location?.pathname || "");
    }
  }, [location?.pathname]);

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;

  return (
    <Container>
      {links.map((entry, key) => {
        const MenuIcon = menuIcon(entry.icon);
        //   <Icon
        //     marginLeft={entry.label === 'Staking' ? "4px" : "0px"}
        //     marginTop={entry.label === 'Staking' ? "16px" : "0px"}
        //     width={entry.label === 'Staking' ? "33px" : "30px"}
        //     mr={entry.label === 'Staking' ? "3px" : "8px"}
        //   />;
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

        // if (entry.items) {
        //   const itemsMatchIndex = entry.items.findIndex((item) => item.href === pathname);
        //   const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0;

        //   return (
        //     <Accordion
        //       key={entry.label}
        //       isPushed={isPushed}
        //       pushNav={pushNav}
        //       icon={iconElement}
        //       label={entry.label}
        //       initialOpenState={initialOpenState}
        //       className={calloutClass}
        //       isActive={entry.items.some((item) => item.href === pathname)}
        //     >
        //       {isPushed &&
        //         entry.items.map((item) => (
        //           <MenuEntry key={item.href} secondary isActive={item.href === pathname} onClick={handleClick}>
        //             <MenuLink href={item.href}>{item.label}</MenuLink>
        //           </MenuEntry>
        //         ))}
        //     </Accordion>
        //   );
        // }
        return (
          <WrapMenuEntry isActive={entry.href === pathname} key={key}>
            <MenuEntry key={entry.label} isActive={entry.href === pathname} className={calloutClass}>
              <MenuLink href={entry.href} onClick={handleClick}>
                <MenuIcon />
                <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              </MenuLink>
            </MenuEntry>
          </WrapMenuEntry>
        );
      })}
    </Container>
  );
};

export default PanelBody;
