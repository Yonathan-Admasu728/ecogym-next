'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiChevronRight, HiHome } from 'react-icons/hi';

interface Breadcrumb {
  href: string;
  label: string;
}

export default function Breadcrumb(): JSX.Element | null {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  const breadcrumbs: Breadcrumb[] = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const label = path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return { href, label };
  });

  return (
    <nav className="py-4 px-4 sm:px-6 lg:px-8">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            href="/"
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
          >
            <HiHome className="w-4 h-4" />
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <HiChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={breadcrumb.href}
              className={`ml-2 ${
                index === breadcrumbs.length - 1
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-white transition-colors duration-200'
              }`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
