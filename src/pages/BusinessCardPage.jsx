import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WeChatSharePreview from '../components/WeChatSharePreview';
import GuizhouLandscapeImg from '../image/guizhou_landscape.jpg';
import DefaultAvatar from '../image/托腮_1.png';
import BusinessCardForm from '../components/BusinessCardForm';
import BusinessCardPreview from '../components/BusinessCardPreview';
import BusinessCardDetail from '../components/BusinessCardDetail';

const BusinessCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial state from location or defaults
  const [viewMode, setViewMode] = useState('detail'); // 'detail', 'edit', 'preview', 'shared_preview'
  const [showSharePreview, setShowSharePreview] = useState(false);
  
  // Check if we have data passed via navigation state
  const initialCardData = location.state?.cardData;
  const initialMode = location.state?.mode;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    phone: '',
    email: '',
    location: '贵州 · 贵阳',
    slogan: '山地公园省，多彩贵州风',
    avatar: DefaultAvatar,
    bgImage: GuizhouLandscapeImg,
    wechatId: ''
  });

  useEffect(() => {
    // Try to load from localStorage first if not passed via state
    const savedCard = localStorage.getItem('user_business_card');
    
    if (initialCardData) {
        setFormData({ 
            ...formData, 
            ...initialCardData,
            avatar: initialCardData.avatar || DefaultAvatar,
            bgImage: initialCardData.bgImage || GuizhouLandscapeImg 
        });
    } else if (savedCard) {
        const parsedCard = JSON.parse(savedCard);
        setFormData({ 
            ...formData, 
            ...parsedCard,
            avatar: parsedCard.avatar || DefaultAvatar,
            bgImage: parsedCard.bgImage || GuizhouLandscapeImg 
        });
    } else {
        // New card defaults
        setFormData(prev => ({
            ...prev,
            name: '旅行者_9527',
            organization: '贵州省文化和旅游厅', 
            title: '特邀体验官', 
            phone: '138 **** 8888',
            email: 'traveler@guizhou.gov.cn',
            avatar: DefaultAvatar,
            bgImage: GuizhouLandscapeImg
        }));
        // If no saved card, default to edit mode unless specified otherwise
        if (!initialMode) setViewMode('edit');
    }

    if (initialMode) {
        setViewMode(initialMode);
    }
  }, [initialCardData, initialMode]);

  const handleSave = (newData) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    
    // Persist to local storage
    localStorage.setItem('user_business_card', JSON.stringify(updatedData));
    
    setViewMode('detail');
  };

  const handleShare = () => {
    setShowSharePreview(true);
  };

  const handleConfirm = (card) => {
      handleSave(card);
      setViewMode('detail');
  };

  const handleSharedCardView = () => {
     setShowSharePreview(false);
     setViewMode('shared_preview'); 
  };

  const handleBack = () => {
      if (viewMode === 'edit' && localStorage.getItem('user_business_card')) {
          setViewMode('detail');
      } else {
          navigate(-1);
      }
  };

  return (
    <div className="h-full w-full bg-white relative">
      <AnimatePresence mode="wait">
        {viewMode === 'detail' && (
          <motion.div 
            key="detail"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessCardDetail 
              card={formData}
              onEdit={() => setViewMode('edit')}
              onPreview={() => setViewMode('preview')}
              onBack={() => navigate(-1)}
              onViewCard={handleSharedCardView}
            />
          </motion.div>
        )}
        
        {viewMode === 'edit' && (
          <motion.div 
            key="edit"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessCardForm 
              initialData={formData} 
              onSubmit={handleSave} 
              onBack={handleBack} 
            />
          </motion.div>
        )}

        {viewMode === 'preview' && (
          <motion.div 
            key="preview"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessCardPreview 
              card={formData} 
              mode="own" 
              onConfirm={handleConfirm}
              onBack={() => setViewMode('detail')}
              onShare={handleShare}
              onCloseModal={() => navigate(-1)}
            />
          </motion.div>
        )}

        {viewMode === 'shared_preview' && (
          <motion.div 
            key="shared"
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessCardPreview 
              card={formData} 
              mode="shared" 
              onBack={() => setViewMode('detail')}
              onCloseModal={() => navigate(-1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* WeChat Share Preview Modal */}
      <WeChatSharePreview 
         isOpen={showSharePreview} 
         onClose={() => setShowSharePreview(false)} 
         cardData={formData}
         onViewCard={handleSharedCardView}
      />
    </div>
  );
};

export default BusinessCardPage;