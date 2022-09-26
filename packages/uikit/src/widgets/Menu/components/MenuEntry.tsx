import React from "react";
import styled, { keyframes, DefaultTheme } from "styled-components";
import { MENU_ENTRY_HEIGHT } from "../config";

export interface Props {
  secondary?: boolean;
  isActive?: boolean;
  theme: DefaultTheme;
}

const rainbowAnimation = keyframes`
  0%,
  100% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

const LinkLabel = styled.div<{ isPushed: boolean }>`
  color: white;
  transition: color 0.4s;
  font-size: 16px;
  font-weight: 400;
  flex-grow: 1;
  margin-left: 20px;
`;

const MenuEntry = styled.div<Props>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: ${({ secondary }) => (secondary ? "0 32px" : "0 20px")};
  font-size: ${({ secondary }) => (secondary ? "14px" : "30px")};
  background-color: ${({ secondary, theme }) => (secondary ? "#857e85" : "transparent")};
  color: white;
  opacity: 0.7;

  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  svg {
    fill: white;
  }

  &:hover {
    box-shadow: 0 0 10px 0 rgb(0 68 255 / 50%);
  }

  // Safari fix
  flex-shrink: 0;

  &.rainbow {
    background-clip: text;
    animation: ${rainbowAnimation} 3s ease-in-out infinite;
    background: ${({ theme }) => theme.colors.primaryDark};
    background-size: 400% 100%;
  }
`;
MenuEntry.defaultProps = {
  secondary: false,
  isActive: false,
  role: "button",
};

const LinkLabelMemo = React.memo(LinkLabel, (prev, next) => prev.isPushed === next.isPushed);

export { MenuEntry, LinkLabelMemo as LinkLabel };
