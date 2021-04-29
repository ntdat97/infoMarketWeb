import { ReactNode } from 'react';

export interface PostLayoutProps {
  header?: ReactNode;
  main?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  footer?: ReactNode;
}
export const PostLayout = ({
  header,
  main,
  left,
  right,
  footer,
}: PostLayoutProps) => {
  return (
    <>
      {header}
      {main}
      {left}
      {right}
      {footer}
    </>
  );
};
