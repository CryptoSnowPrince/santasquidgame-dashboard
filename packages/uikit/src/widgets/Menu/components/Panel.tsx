import React from "react";
import styled from "styled-components";
import PanelBody from "./PanelBody";
import { LogoIcon, LogoWithTextIcon } from "../../../components/Svg";
import PanelFooter from "./PanelFooter";
import { SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from "../config";
import { PanelProps, PushedProps } from "../types";

interface Props extends PanelProps, PushedProps {
  showMenu: boolean;
  isMobile: boolean;
}

const StyledPanel = styled.div<{ isMobile: boolean; isPushed: boolean; showMenu: boolean }>`
  position: fixed;
  padding-top: ${({ showMenu }) => (showMenu ? "5px" : 0)};
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  // background-color: ${({ theme }) => theme.nav.background};
  background-color: #302f30;
  width: ${({ isPushed, isMobile }) => (isPushed || !isMobile ? `100%` : 0)};
  height: 100vh;
  transition: padding-top 0.2s, width 0.2s;
  border-right: ${({ isPushed, isMobile }) => (isPushed || !isMobile ? "2px solid rgba(133, 133, 133, 0.1)" : 0)};
  box-shadow: rgb(203 87 65) 0px 0px 15px 4px;
  z-index: 11;
  overflow: ${({ isPushed, isMobile }) => (isPushed || !isMobile ? "initial" : "hidden")};
  transform: translate3d(0, 0, 0);

  ${({ theme }) => theme.mediaQueries.xl} {
    border-right: 0px solid rgba(133, 133, 133, 0.1);
    width: ${({ isPushed, isMobile }) => `${isPushed || !isMobile ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
  box-shadow: rgb(203 87 65) 0px 0px 15px 4px;
`;

const Panel: React.FC<Props> = (props) => {
  const { isPushed, isMobile, showMenu } = props;
  return (
    <StyledPanel isMobile={isMobile} isPushed={isPushed} showMenu={showMenu}>
      <LogoIcon className="mobile-icon" />
      <PanelBody {...props} />
      {/* <PanelFooter {...props} /> */}
    </StyledPanel>
  );
};

export default Panel;
