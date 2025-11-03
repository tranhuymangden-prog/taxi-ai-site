
import React, { useState, useEffect, useCallback } from 'react';
import type { WebsiteData } from './types';
import { generateWebsiteContent, generateServiceImage, generateGalleryImage } from './services/geminiService';
import { bannerBase64 } from './assets';
import Step6_Preview from './components/Step6_Preview';
import AdminPanel from './components/AdminPanel';

// Dữ liệu được điền sẵn từ thông tin bạn cung cấp
const prefilledWebsiteData: WebsiteData = {
  businessName: 'TAXI TRẦN MĂNG ĐEN',
  phone: '0376 774 168',
  email: 'tranhuykpl@gmail.com',
  serviceArea: 'MĂNG ĐEN - KON TUM - QUẢNG NGÃI - PLEIKU',
  services: [
    { id: 'dua-don-san-bay', name: 'Đưa đón sân bay', description: 'Dịch vụ đưa đón sân bay đúng giờ và an toàn.' },
    { id: 'taxi-duong-dai', name: 'Taxi đường dài', description: 'Di chuyển liên tỉnh với giá cước hợp lý.' },
    { id: 'tham-quan-thanh-pho', name: 'Tham quan thành phố', description: 'Khám phá các điểm đến nổi bật trong thành phố.' },
    { id: 'xe-hop-dong-su-kien', name: 'Xe hợp đồng, sự kiện', description: 'Cung cấp xe cho các sự kiện, cưới hỏi.' }
  ],
  tagline: '',
  aboutUs: '',
  pointsOfInterest: [],
  testimonials: [],
  galleryImages: [],
  blogPosts: [],
  // Thêm video trải nghiệm mẫu
  video: {
    url: 'https://www.youtube.com/watch?v=Xb1T24o6P5A', // Video về Măng Đen
    description: 'Cùng khám phá vẻ đẹp hoang sơ và không khí trong lành của Măng Đen qua những thước phim ấn tượng. Chúng tôi hân hạnh được đồng hành cùng bạn trên mọi nẻo đường khám phá.'
  },
  socialLinks: {
    facebook: '',
    instagram: '',
  },
};

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50 transition-opacity duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-slate-700 font-semibold text-lg">{message}</p>
        <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát...</p>
    </div>
);

const App: React.FC = () => {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(prefilledWebsiteData);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('AI đang khởi tạo trang web của bạn...');
  const [view, setView] = useState<'preview' | 'admin'>('preview');

  const generateAndBuildWebsite = useCallback(async (initialData: WebsiteData) => {
    setIsGenerating(true);
    setWebsiteData(initialData); // Reset data

    try {
      // 1. Generate text content
      setLoadingMessage('AI đang sáng tạo nội dung chữ...');
      const { content, galleryImagePrompts } = await generateWebsiteContent(initialData, null);
      setWebsiteData(prev => ({ ...prev, ...content }));

      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      const totalImages = initialData.services.length + galleryImagePrompts.length;
      let generatedCount = 0;

      // 2. Generate service images sequentially
      const updatedServices = [...initialData.services];
      for (let i = 0; i < updatedServices.length; i++) {
        generatedCount++;
        setLoadingMessage(`Đang tạo hình ảnh (${generatedCount}/${totalImages})...`);
        const imageUrl = await generateServiceImage(updatedServices[i].name);
        updatedServices[i].imageUrl = imageUrl;
        setWebsiteData(prev => ({ ...prev, services: [...updatedServices] }));
        await delay(1500);
      }

      // 3. Generate gallery images sequentially
      const generatedGalleryImages = [bannerBase64];
      for (const prompt of galleryImagePrompts) {
        generatedCount++;
        setLoadingMessage(`Đang tạo hình ảnh (${generatedCount}/${totalImages})...`);
        const imageUrl = await generateGalleryImage(prompt);
        if (imageUrl) generatedGalleryImages.push(imageUrl);
        setWebsiteData(prev => ({ ...prev, galleryImages: [...generatedGalleryImages] }));
        await delay(1500);
      }
      
      setWebsiteData(prev => ({ ...prev, galleryImages: generatedGalleryImages, services: updatedServices }));

    } catch (error) {
      console.error("Lỗi khi khởi tạo trang web:", error);
      setLoadingMessage('Đã xảy ra lỗi khi tạo trang web. Vui lòng tải lại trang.');
      // Keep isGenerating true to show error message
      return;
    }
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    // Generate content on initial load
    generateAndBuildWebsite(prefilledWebsiteData);
  }, [generateAndBuildWebsite]);

  const handleSaveFromAdmin = (newData: WebsiteData) => {
    setWebsiteData(newData);
    alert('Thông tin trang web đã được cập nhật!');
    setView('preview'); 
  };

  const handleGoToAdmin = () => setView('admin');
  const handleGoToWebsiteFromAdmin = () => setView('preview');
  
  const handleStartOver = () => {
    if (window.confirm('Bạn có muốn tạo lại trang web mới không? Tất cả các thay đổi sẽ bị mất.')) {
      setView('preview');
      generateAndBuildWebsite(prefilledWebsiteData);
    }
  };
  
  const renderContent = () => {
    if (isGenerating) {
        return <LoadingScreen message={loadingMessage} />;
    }
    
    if (view === 'admin') {
      return (
        <div className="bg-white rounded-xl shadow-lg min-h-[80vh] flex flex-col">
          <AdminPanel data={websiteData} onSave={handleSaveFromAdmin} onGoToWebsite={handleGoToWebsiteFromAdmin} />
        </div>
      );
    }

    return (
        <>
            <Step6_Preview data={websiteData} onGoToAdmin={handleGoToAdmin} />
            <div className="text-center mt-4">
                <button 
                   onClick={handleStartOver} 
                   className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors"
               >
                   Tạo lại trang web với AI
               </button>
           </div>
        </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 bg-slate-100">
      <div className="w-full max-w-5xl mx-auto">
        {renderContent()}
        {!isGenerating && (
            <footer className="text-center mt-6 text-slate-400 text-sm">
              <p>Được hỗ trợ bởi Gemini API</p>
            </footer>
        )}
      </div>
    </div>
  );
};

export default App;
