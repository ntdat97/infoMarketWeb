import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import isEqual from 'lodash/isEqual'

export const ActiveLink = ({ href, children, activeClassName }) => {
  const router = useRouter();

  let className = children.props.className || '';

  if (router.pathname === href.pathname && isEqual(router.query, href.query)) {
    className = `${className} ${activeClassName}`;
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};
