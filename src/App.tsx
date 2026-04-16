import React, { useState } from 'react';
import { Home, Map as MapIcon, Plus, ShoppingBag, User } from 'lucide-react';
import HomePage from './pages/Home';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';
import Mall from './pages/Mall';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AnnouncementPage from './pages/AnnouncementPage';
import TranslationPage from './pages/TranslationPage';
import Settings from './pages/Settings';
import Login from './pages/Login';
import DigitalAvatar from './pages/DigitalAvatar';
import DigitalCard from './pages/DigitalCard';
import CardFavorites from './pages/CardFavorites';
import AddSheet from './components/AddSheet';
import OnboardingGuide from './components/OnboardingGuide';
import SmartImport from './pages/SmartImport';
import { Page } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentAgentTitle, setCurrentAgentTitle] = useState<string>('黄小西');
  const [chatData, setChatData] = useState<any>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('138****8888');
  const [hasDigitalAvatar, setHasDigitalAvatar] = useState(false);
  const [showGuide, setShowGuide] = useState(() => !sessionStorage.getItem('onboardingDone'));

  // Global Toast State
  const [globalToast, setGlobalToast] = useState<{
    show: boolean;
    status: 'loading' | 'success';
    message: string;
  }>({ show: false, status: 'loading', message: '' });

  // Expose toast controller via window so any deep component can trigger it easily
  React.useEffect(() => {
    (window as any).showGlobalToast = (status: 'loading' | 'success', message: string) => {
      setGlobalToast({ show: true, status, message });
    };
    (window as any).hideGlobalToast = () => {
      setGlobalToast(prev => ({ ...prev, show: false }));
    };
  }, []);

  const handleNavigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    if (page === 'chat') {
      setCurrentAgentTitle(data?.agentTitle || '黄小西');
      setChatData(data);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleLogin = (phone: string) => {
    setIsLoggedIn(true);
    setPhoneNumber(phone);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'trip-list': return <TripList onNavigate={handleNavigate} />;
      case 'trip-detail': return <TripDetail onNavigate={handleNavigate} isPreview={false} />;
      case 'trip-detail-preview': return <TripDetail onNavigate={handleNavigate} isPreview={true} />;
      case 'trip-detail-adopted': return <TripDetail onNavigate={handleNavigate} isPreview={false} fromChat={true} />;
      case 'mall': return <Mall onNavigate={handleNavigate} />;
      case 'profile': return <Profile onNavigate={handleNavigate} hasDigitalAvatar={hasDigitalAvatar} />;
      case 'chat': return <Chat onNavigate={handleNavigate} agentTitle={currentAgentTitle} data={chatData} />;
      case 'announcement': return <AnnouncementPage onNavigate={handleNavigate} />;
      case 'translation': return <TranslationPage onNavigate={handleNavigate} />;
      case 'settings': return <Settings onNavigate={handleNavigate} onLogout={handleLogout} phoneNumber={phoneNumber} onResetGuide={() => { sessionStorage.removeItem('onboardingDone'); setShowGuide(true); setCurrentPage('home'); }} />;
      case 'login': return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'digital-avatar': return <DigitalAvatar onNavigate={handleNavigate} onAvatarGenerated={() => setHasDigitalAvatar(true)} hasDigitalAvatar={hasDigitalAvatar} />;
      case 'digital-card': return <DigitalCard onNavigate={handleNavigate} />;
      case 'card-favorites': return <CardFavorites onNavigate={handleNavigate} />;
      case 'smart-import': return <SmartImport onNavigate={handleNavigate} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showBottomNav = ['home', 'trip-list', 'mall', 'profile'].includes(currentPage);

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center overflow-hidden font-sans">
      {/* Mobile Container (iPhone 14 Pro dimensions approx) */}
      <div data-guide-container className="w-full h-full sm:w-[393px] sm:h-[852px] sm:rounded-[3rem] sm:shadow-2xl bg-white relative flex flex-col overflow-hidden sm:border-[8px] sm:border-gray-900">
        
        {/* Global Click Interceptor for Logged Out State */}
        {!isLoggedIn && currentPage !== 'login' && (
          <div 
            className="absolute inset-0 z-[9999] cursor-pointer"
            onClickCapture={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurrentPage('login');
            }}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
          {renderPage()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <div data-guide="bottom-nav" className="h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-safe relative z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <NavItem icon={<Home />} label="首页" isActive={currentPage === 'home'} onClick={() => handleNavigate('home')} />
            <NavItem icon={<MapIcon />} label="行程" isActive={currentPage === 'trip-list'} onClick={() => handleNavigate('trip-list')} />
            
            {/* Add Button */}
            <div className="relative -top-6 flex justify-center w-16">
              <button 
                onClick={() => setIsAddOpen(true)}
                className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
              >
                <Plus size={32} />
              </button>
            </div>

            <NavItem icon={<ShoppingBag />} label="优选" isActive={currentPage === 'mall'} onClick={() => handleNavigate('mall')} />
            <div data-guide="nav-mine">
              <NavItem icon={<User />} label="我的" isActive={currentPage === 'profile'} onClick={() => handleNavigate('profile')} />
            </div>
          </div>
        )}

        <AddSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onNavigate={handleNavigate} />

        {showGuide && currentPage === 'home' && isLoggedIn && (
          <OnboardingGuide onFinish={() => { setShowGuide(false); sessionStorage.setItem('onboardingDone', 'true'); }} />
        )}

        {/* Global Toast Capsule */}
        <AnimatePresence>
          {globalToast.show && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
            >
              <div className="bg-gray-900/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  if (globalToast.status === 'success') {
                    handleNavigate('trip-list');
                    (window as any).hideGlobalToast();
                  }
                }}
              >
                {globalToast.status === 'loading' ? (
                  <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles size={8} className="text-indigo-400 animate-pulse" />
                  </div>
                ) : (
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                )}
                <span className="text-[14px] font-bold tracking-wide whitespace-nowrap">{globalToast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 gap-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
