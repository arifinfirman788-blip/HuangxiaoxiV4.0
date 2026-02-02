import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import WeChatSharePreview from './WeChatSharePreview';
import GuizhouLandscapeImg from '../image/guizhou_landscape.jpg';
import DefaultAvatar from '../image/托腮_1.png';
import BusinessCardForm from './BusinessCardForm';
import BusinessCardPreview from './BusinessCardPreview';
import BusinessCardDetail from './BusinessCardDetail';

const BusinessCardModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [viewMode, setViewMode] = useState('detail'); // 'detail', 'edit', 'preview'
  const [showSharePreview, setShowSharePreview] = useState(false);
  
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
    if (initialData) {
      // Existing card: Go to Detail
      setFormData({ 
        ...formData, 
        ...initialData,
        avatar: initialData.avatar || DefaultAvatar,
        bgImage: initialData.bgImage || GuizhouLandscapeImg 
      });
      setViewMode('detail');
    } else {
        // New card: Start with Edit
        setFormData(prev => ({
            ...prev,
            name: '旅行者_9527',
            organization: '贵州省文化和旅游厅', // Default
            title: '特邀体验官', // Default
            phone: '138 **** 8888',
            email: 'traveler@guizhou.gov.cn',
            avatar: DefaultAvatar,
            bgImage: GuizhouLandscapeImg
        }));
        setViewMode('edit');
    }
  }, [initialData, isOpen]);

  const handleSave = (newData) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    setViewMode('detail');
    onSave(updatedData);
  };

  const handleShare = () => {
    setShowSharePreview(true);
  };

  const handleConfirm = (card) => {
      onSave(card);
      setViewMode('detail');
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col h-[85vh] max-h-[800px]"
            onClick={(e) => e.stopPropagation()}
          >
            {viewMode === 'detail' && (
              <BusinessCardDetail 
                card={formData}
                onEdit={() => setViewMode('edit')}
                onPreview={() => setViewMode('preview')}
                onBack={onClose}
              />
            )}
            
            {viewMode === 'edit' && (
              <BusinessCardForm 
                initialData={formData} 
                onSubmit={handleSave} 
                onBack={() => initialData ? setViewMode('detail') : onClose()} 
              />
            )}

            {viewMode === 'preview' && (
              <BusinessCardPreview 
                card={formData} 
                mode="own" 
                onConfirm={handleConfirm}
                onBack={() => setViewMode('detail')}
                onShare={handleShare}
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>,
    document.body
  );
};

export default BusinessCardModal;
