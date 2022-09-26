import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    color: "white",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary",
    boxShadow: "none",
    color: "primary",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    border: "0px",
    color: "primary",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    border: "0px",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    border: "0px",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    border: "0px",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    border: "0px",
    color: "primary",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    border: "0px",
    color: "textSubtle",
    boxShadow: "none",
  },
};
