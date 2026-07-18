import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface SafeMdxProps {
  source: string;
}

export async function SafeMdx({ source }: SafeMdxProps) {
  if (!source) return null;

  return <MDXRemote source={source} />;
}
