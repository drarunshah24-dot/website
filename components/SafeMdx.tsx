import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkBreaks from "remark-breaks";

interface SafeMdxProps {
  source: string;
}

export async function SafeMdx({ source }: SafeMdxProps) {
  if (!source) return null;

  return (
    <div className="prose prose-slate prose-blue max-w-none prose-headings:font-heading prose-a:text-blue-600 prose-li:marker:text-blue-500">
      <MDXRemote 
        source={source} 
        options={{
          mdxOptions: {
            remarkPlugins: [remarkBreaks],
          },
        }}
      />
    </div>
  );
}
