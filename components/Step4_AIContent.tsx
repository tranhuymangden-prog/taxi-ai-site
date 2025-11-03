import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { WebsiteData, Geolocation } from '../types';
import { generateWebsiteContent, regenerateTagline, regenerateAboutUs, generateServiceImage, generateGalleryImage } from '../services/geminiService';
import { bannerBase64 } from '../assets';

interface Step4AIContentProps {
  data: WebsiteData;
  updateData: (fields: Partial<WebsiteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
);

const LocationPermissionPrompt: React.FC<{ onAllow: () => void; onDeny: () => void; }> = ({ onAllow, onDeny }) => (
    <div className="text-center p-6 border rounded-lg bg-slate-100">
        <h3 className="font-bold text-lg mb-2">Sử dụng vị trí của bạn?</h3>
        <p className="text-slate-600 mb-4">
            Để AI có thể đề xuất các địa điểm nổi bật chính xác nhất tại khu vực của bạn, vui lòng cho phép chúng tôi sử dụng vị trí hiện tại của bạn.
        </p>
        <div className="flex justify-center gap-4">
            <button onClick={onAllow} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Cho phép</button>
            <button onClick={onDeny} className="bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-400">Từ chối</button>
        </div>
    </div>
);

const OptimizeButton: React.FC<{ isOptimizing: boolean; onClick: () => void; disabled: boolean }> = ({ isOptimizing, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || isOptimizing}
        className="flex-shrink-0 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-live="polite"
    >
        {isOptimizing ? (
            <svg className="animate-spin h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.125 16.5l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" />
            </svg>
        )}
        <span>{isOptimizing ? 'Đang...' : 'Tối ưu hóa'}</span>
    </button>
);


const Step4AIContent: React.FC<Step4AIContentProps> = ({ data, updateData, onNext, onBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<Geolocation>(null);
    const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [isOptimizing, setIsOptimizing] = useState({ tagline: false, aboutUs: false });
    const [galleryPrompts, setGalleryPrompts] = useState<string[]>([]);
    const [imageStatus, setImageStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
    const [imageProgress, setImageProgress] = useState('');
    
    const imagesGenerated = useRef(false);

    const fetchContent = useCallback(async (loc: Geolocation) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!data.tagline && !data.aboutUs) {
                const { content, galleryImagePrompts } = await generateWebsiteContent(data, loc);
                updateData(content);
                if (galleryImagePrompts && galleryImagePrompts.length > 0) {
                    setGalleryPrompts(galleryImagePrompts);
                }
            }
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [data.businessName, data.serviceArea, data.services.length, updateData]);

    useEffect(() => {
        const areServicesImagesNeeded = data.services.length > 0 && !data.services.some(s => s.imageUrl !== undefined);
        const areGalleryImagesNeeded = galleryPrompts.length > 0 && data.galleryImages.length === 0;

        if (!data.tagline || isLoading || imagesGenerated.current) {
            return;
        }

        if(areServicesImagesNeeded || areGalleryImagesNeeded) {
            imagesGenerated.current = true; // Set flag to prevent re-running
            setImageStatus('generating');

            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

            const generateAllImages = async () => {
                const updates: Partial<WebsiteData> = {};
                const totalImagesToGenerate = (areServicesImagesNeeded ? data.services.length : 0) + (areGalleryImagesNeeded ? galleryPrompts.length : 0);
                let generatedCount = 0;

                // Process service images sequentially to avoid rate limiting
                if (areServicesImagesNeeded) {
                    const updatedServices = [];
                    for (const service of data.services) {
                        generatedCount++;
                        setImageProgress(`(${generatedCount}/${totalImagesToGenerate})`);
                        try {
                            const imageUrl = await generateServiceImage(service.name);
                            updatedServices.push({ ...service, imageUrl });
                        } catch (err) {
                            console.error(`Failed to generate image for service: ${service.name}`, err);
                            updatedServices.push({ ...service, imageUrl: '' }); // Push with empty URL on error
                        }
                        await delay(1500); // Add a 1.5-second delay
                    }
                    updates.services = updatedServices;
                }

                // Process gallery images sequentially to avoid rate limiting
                if (areGalleryImagesNeeded) {
                    const generatedGalleryImages = [bannerBase64]; // Start with banner
                    for (const prompt of galleryPrompts) {
                        generatedCount++;
                        setImageProgress(`(${generatedCount}/${totalImagesToGenerate})`);
                        try {
                            const imageUrl = await generateGalleryImage(prompt);
                            if (imageUrl) {
                                generatedGalleryImages.push(imageUrl);
                            }
                        } catch (err) {
                            console.error(`Failed to generate gallery image for prompt: ${prompt}`, err);
                        }
                        await delay(1500); // Add a 1.5-second delay
                    }
                    updates.galleryImages = generatedGalleryImages;
                }
                
                if (Object.keys(updates).length > 0) {
                    updateData(updates);
                }
                 setImageProgress('');
                 setImageStatus('done');
            };
            
            generateAllImages().catch(err => {
                console.error("An error occurred during image generation process:", err);
                setError("Có lỗi xảy ra trong quá trình tạo hình ảnh. Một vài hình ảnh có thể bị thiếu.");
                setImageProgress('');
                setImageStatus('error');
            });
        }
    }, [data.tagline, data.services, data.galleryImages, galleryPrompts, isLoading, updateData]);


    const handleOptimize = async (field: 'tagline' | 'aboutUs') => {
        setIsOptimizing(prev => ({ ...prev, [field]: true }));
        setError(null);
        try {
            let newData: Partial<WebsiteData> = {};
            if (field === 'tagline') {
                newData = await regenerateTagline(data, location);
            } else if (field === 'aboutUs') {
                newData = await regenerateAboutUs(data, location);
            }
            updateData(newData);
        } catch (e: any) {
            setError(`Không thể tối ưu hóa nội dung. Vui lòng thử lại.`);
        } finally {
            setIsOptimizing(prev => ({ ...prev, [field]: false }));
        }
    };


    const handleAllowLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setPermissionStatus('granted');
                fetchContent({ latitude, longitude });
            },
            () => {
                setPermissionStatus('denied');
                fetchContent(null);
            }
        );
    };

    const handleDenyLocation = () => {
        setPermissionStatus('denied');
        fetchContent(null);
    };
    
    useEffect(() => {
         if (data.tagline || data.aboutUs) {
            setIsLoading(false);
            setPermissionStatus('denied'); // Assume denied if we already have content
        }
    }, []);
    
    const showContent = permissionStatus !== 'prompt';

    const headingText = isLoading ? "AI đang sáng tạo nội dung..." : "Xem lại & Chỉnh sửa nội dung";
    const subHeadingText = isLoading 
        ? "Dựa trên thông tin bạn cung cấp, chúng tôi đang tạo ra nội dung độc đáo cho trang web của bạn."
        : "AI đã tạo xong! Bạn có thể chỉnh sửa hoặc dùng AI để tối ưu hóa nội dung bên dưới.";


    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-2">{headingText}</h2>
            <p className="text-center text-slate-500 mb-6">{subHeadingText}</p>

            {permissionStatus === 'prompt' && <LocationPermissionPrompt onAllow={handleAllowLocation} onDeny={handleDenyLocation} />}

            {isLoading && showContent && <LoadingSpinner />}
            
            {error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg my-4">{error}</div>}
            
            {!isLoading && !error && showContent && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-1">Khẩu hiệu (Tagline)</label>
                        <div className="flex items-center gap-2">
                             <input
                                id="tagline"
                                name="tagline"
                                type="text"
                                value={data.tagline}
                                onChange={(e) => updateData({ tagline: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100"
                                placeholder="Khẩu hiệu hấp dẫn"
                                disabled={isOptimizing.tagline}
                            />
                             <OptimizeButton 
                                isOptimizing={isOptimizing.tagline} 
                                onClick={() => handleOptimize('tagline')} 
                                disabled={isLoading || isOptimizing.aboutUs} 
                             />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Bạn có thể chỉnh sửa hoặc dùng AI để tạo khẩu hiệu mới.</p>
                    </div>

                    <div>
                        <label htmlFor="aboutUs" className="block text-sm font-medium text-slate-700 mb-1">Về chúng tôi</label>
                        <div className="flex items-start gap-2">
                            <textarea
                                id="aboutUs"
                                name="aboutUs"
                                rows={8}
                                value={data.aboutUs}
                                onChange={(e) => updateData({ aboutUs: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100"
                                placeholder="Mô tả về doanh nghiệp của bạn"
                                disabled={isOptimizing.aboutUs}
                            />
                            <OptimizeButton 
                                isOptimizing={isOptimizing.aboutUs} 
                                onClick={() => handleOptimize('aboutUs')} 
                                disabled={isLoading || isOptimizing.tagline} 
                            />
                        </div>
                         <p className="text-xs text-slate-500 mt-1">Bạn có thể chỉnh sửa hoặc dùng AI để viết lại phần giới thiệu.</p>
                    </div>
                </div>
            )}

            {imageStatus === 'generating' && (
                <div className="text-center text-slate-600 p-4 bg-slate-100 rounded-lg my-4 flex items-center justify-center gap-2" role="status" aria-live="polite">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang tạo hình ảnh {imageProgress}. Quá trình này có thể mất vài phút...</span>
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Quay lại
                </button>
                <button
                    onClick={onNext}
                    disabled={isLoading || permissionStatus === 'prompt' || imageStatus === 'generating'}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default Step4AIContent;