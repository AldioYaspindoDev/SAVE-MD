import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onNavigate?: (path: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const navSections = [
    {
      group: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
        { id: 'kategori', label: 'Kategori', icon: FolderKanban, route: '/dashboard/categories' },
        { id: 'snippets', label: 'Snippets, Rules & Prompt', icon: Code2, route: '/dashboard/snippets' },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    if (onNavigate) onNavigate(id);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-zinc-200 flex flex-col justify-between select-none font-sans shrink-0">
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-1">
        <Link href="/">
          <div className="h-14 px-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <Image
                width={30}
                height={30}
                alt="logo"
                src="/Images/VaultsLogo.jpeg"
                className="rounded"
              />
              <span className="text-neutral-900 text-lg font-semibold tracking-tight">
                Vault
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="px-3 py-3 flex-1 overflow-y-auto space-y-5">
          {navSections.map((section) => (
            <div key={section.group} className="flex flex-col gap-1">
              <div className="px-2.5 pb-1">
                <span className="text-zinc-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  {section.group}
                </span>
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  // ⬇️ aktif kalau pathname sama PERSIS dengan route
                  const isActive = pathname === item.route;

                  return (
                    <Link
                      href={item.route}
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full px-2.5 py-2 rounded flex items-center gap-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-600/30 font-semibold'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-neutral-900 border border-transparent'
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${
                          isActive ? 'text-blue-700' : 'text-zinc-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-2.5 shrink-0 text-xs font-mono">
        <div className="pt-2.5 border-t border-zinc-200 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="size-7 bg-neutral-900 rounded-full flex items-center justify-center text-white shrink-0">
              <Shield className="size-3.5 text-blue-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-neutral-900 font-medium text-xs truncate leading-tight">
                Admin Core
              </span>
              <span className="text-zinc-400 text-[10px] font-mono truncate leading-tight">
                root@vault.ai
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              title="Notifikasi"
              className="p-1 text-zinc-500 hover:text-neutral-900 hover:bg-zinc-200 rounded transition-colors"
            >
              <Bell className="size-3.5" />
            </button>
            <button
              type="button"
              title="Keluar"
              className="p-1 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}