import styled from "styled-components";
import { StyledMenuButton } from "../../../components/Button/StyledButton";

const MenuButton = styled(StyledMenuButton)`
  color: white;
  padding: 0 8px;
  border-radius: 8px;
  display: none;
  
  @media screen and (max-width: 1080px) {
    display: inline-flex;
  }
`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

export default MenuButton;
