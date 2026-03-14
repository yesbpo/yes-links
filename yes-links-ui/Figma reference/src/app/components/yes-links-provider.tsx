import { ReactNode } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Link2, BarChart3, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

export default function YesLinksProvider() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const navItems = [
    { path: '/', label: 'Enlaces Activos', icon: Link2 },
    { path: '/stats', label: 'Estadísticas Globales', icon: BarChart3 },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--yes-surface-secondary)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-[var(--yes-surface-glass)] backdrop-blur-md"
        style={{
          borderBottom: '1px solid var(--yes-border-subtle)',
          boxShadow: 'var(--yes-shadow-sm)',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-[var(--yes-radius-md)] bg-gradient-to-br from-[var(--yes-accent-gradient-from)] to-[var(--yes-accent-gradient-to)]"
                style={{ boxShadow: 'var(--yes-shadow-glow)' }}
              >
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl font-semibold text-[var(--yes-text-primary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  YesLinks
                </h1>
                <p
                  className="text-xs text-[var(--yes-text-tertiary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Precision SDK
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative px-4 py-2 rounded-[var(--yes-radius-md)] transition-all"
                    style={{
                      backgroundColor: isActive
                        ? 'var(--yes-accent-primary)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--yes-text-on-accent)'
                        : 'var(--yes-text-secondary)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span
                        className="text-sm font-medium"
                        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                      >
                        {item.label}
                      </span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-[var(--yes-radius-md)] bg-[var(--yes-accent-primary)]"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-[var(--yes-radius-md)] bg-[var(--yes-surface-primary)] hover:bg-[var(--yes-surface-tertiary)] transition-colors"
              style={{
                border: '1px solid var(--yes-border-subtle)',
              }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-[var(--yes-text-secondary)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--yes-text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="mt-16 py-8"
        style={{ borderTop: '1px solid var(--yes-border-subtle)' }}
      >
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className="text-xs text-[var(--yes-text-tertiary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                © 2024 YesLinks Precision SDK
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-xs text-[var(--yes-text-tertiary)] hover:text-[var(--yes-accent-primary)] transition-colors"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="text-xs text-[var(--yes-text-tertiary)] hover:text-[var(--yes-accent-primary)] transition-colors"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  API Reference
                </a>
                <a
                  href="#"
                  className="text-xs text-[var(--yes-text-tertiary)] hover:text-[var(--yes-accent-primary)] transition-colors"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Support
                </a>
              </div>
            </div>
            
            <div
              className="text-xs text-[var(--yes-text-tertiary)]"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              v2.4.1
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--yes-surface-primary)',
            color: 'var(--yes-text-primary)',
            border: '1px solid var(--yes-border-subtle)',
            boxShadow: 'var(--yes-shadow-lg)',
            borderRadius: 'var(--yes-radius-lg)',
          },
        }}
      />
    </div>
  );
}