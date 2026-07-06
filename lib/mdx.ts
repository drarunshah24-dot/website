import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MdxFile<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function resolveFolderPath(folder: string): string | null {
  const dirPath = path.join(contentDirectory, folder);
  if (fs.existsSync(dirPath)) return dirPath;
  if (folder === 'blogs' && fs.existsSync(path.join(contentDirectory, 'blog'))) {
    return path.join(contentDirectory, 'blog');
  }
  if (folder === 'blog' && fs.existsSync(path.join(contentDirectory, 'blogs'))) {
    return path.join(contentDirectory, 'blogs');
  }
  return null;
}

export function getMdxFiles(folder: string): string[] {
  const dirPath = resolveFolderPath(folder);
  if (!dirPath) {
    return [];
  }
  return fs.readdirSync(dirPath).filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md');
}

export function getMdxBySlug<T>(folder: string, slug: string): MdxFile<T> | null {
  try {
    const dirPath = resolveFolderPath(folder) || path.join(contentDirectory, folder);
    let fullPath = path.join(dirPath, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(dirPath, `${slug}.md`);
    }
    
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as T,
      content,
    };
  } catch (error) {
    console.error(`Error reading MDX file: ${folder}/${slug}`, error);
    return null;
  }
}

export function getAllMdx<T>(folder: string): MdxFile<T>[] {
  const files = getMdxFiles(folder);
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      return getMdxBySlug<T>(folder, slug);
    })
    .filter((file): file is MdxFile<T> => file !== null);
}
