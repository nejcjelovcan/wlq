import React from "react";
import ErrorPage from "../src/pages/ErrorPage";

interface ErrorProps {
  statusCode?: number | null | undefined;
}

export default function Error({ statusCode }: ErrorProps) {
  return <ErrorPage statusCode={statusCode} />;
}

export const getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
