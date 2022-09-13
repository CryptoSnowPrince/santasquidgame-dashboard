import React from "react";
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
  activeItem: string;
  activeSubItem: string;
}

const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links, activeItem, activeSubItem }) => {
  //   const location = useLocation();

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;

  return (
    <Container>
      {links.map((entry) => {
        const Icon = Icons[entry.icon];
        const iconElement =
          <Icon
            marginLeft={entry.label === 'Staking' ? "4px" : "0px"}
            marginTop={entry.label === 'Staking' ? "16px" : "0px"}
            width={entry.label === 'Staking' ? "33px" : "30px"}
            mr={entry.label === 'Staking' ? "3px" : "8px"}
          />;
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

        if (entry.items) {
          // const itemsMatchIndex = entry.items.findIndex((item) => item.href === location.pathname);
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === activeItem);
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0;

          return (
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={iconElement}
              label={entry.label}
              initialOpenState={initialOpenState}
              className={calloutClass}
              // isActive={entry.items.some((item) => item.href === location.pathname)}
              isActive={entry.items.some((item) => item.href === activeItem)}
            >
              {isPushed &&
                entry.items.map((item) => (
                  // <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                  <MenuEntry key={item.href} secondary isActive={item.href === activeSubItem} onClick={handleClick}>
                    <MenuLink href={item.href}>{item.label}</MenuLink>
                  </MenuEntry>
                ))}
            </Accordion>
          );
        }
        return (
          // <MenuEntry key={entry.label} isActive={entry.href === location.pathname} className={calloutClass}>
          <MenuEntry key={entry.label} isActive={entry.href === activeItem} className={calloutClass}>
            <MenuLink href={entry.href} onClick={handleClick}>
              {iconElement}
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
            </MenuLink>
          </MenuEntry>
        );
      })}
    </Container>
  );
};

export default PanelBody;
