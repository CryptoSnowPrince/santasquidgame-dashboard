import React, { AnchorHTMLAttributes, forwardRef } from "react";
// import { NavLink } from "react-router-dom";
import styled from 'styled-components'
import NextLink from 'next/link'

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: any
  replace?: boolean
  innerRef?: React.Ref<HTMLAnchorElement>
  // next
  prefetch?: boolean
}

const A = styled.a``

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = React.forwardRef<any, LinkProps>(
  ({ to, replace, children, prefetch, ...props }, ref) => (
    <NextLink href={to as string} replace={replace} passHref prefetch={prefetch}>
      <A ref={ref} {...props}>
        {children}
      </A>
    </NextLink>
  ),
)


const MenuLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, ...otherProps }) => {
  const isHttpLink = href?.startsWith("http");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = isHttpLink ? "a" : NextLinkFromReactRouter;
  const props = isHttpLink ? { href } : { to: href };
  return <Tag {...props} {...otherProps} />;
};

export default MenuLink;
