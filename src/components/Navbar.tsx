'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Map', icon: '🗺️' },
  { href: '/inventory', label: 'Collection', icon: '📋' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#16213e] border-t border-gray-700 flex">
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 py-3 text-center transition-colors ${
              active ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="text-xl">{tab.icon}</div>
            <div className="text-xs mt-0.5">{tab.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
