import React from 'react';
import type { WebsiteData } from '../types';

interface Step5FinalizeProps {
  data: WebsiteData;
  updateData: (fields: Partial<WebsiteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; name: string, type?: string }> = 
({ label, value, onChange, placeholder, name, type = 'text' }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name?: string; rows?: number }> = 
({ label, value, onChange, name, rows = 4 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} rows={rows} value={value} onChange={onChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
    </div>
);


const Step5_Finalize: React.FC<Step5FinalizeProps> = ({ data, updateData, onNext, onBack }) => {

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name will be 'facebook' or 'instagram'
    updateData({
        socialLinks: {
            ...data.socialLinks,
            [name]: value,
        },
    });
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newVideoState = { ...(data.video || { url: '', description: '' }), [name]: value };

    if (!newVideoState.url && !newVideoState.description) {
        // If both are empty, remove the video object
        const { video, ...rest } = data;
        updateData({ video: undefined });
    } else {
        updateData({ video: newVideoState });
    }
  };


  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-2">Hoàn thiện trang web</h2>
      <p className="text-center text-slate-500 mb-6">Thêm các thông tin sau để trang web của bạn chuyên nghiệp hơn. Bạn có thể bỏ qua và cập nhật sau.</p>
      
      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Mạng xã hội</h3>
            <InputField 
                label="Link Facebook"
                name="facebook"
                value={data.socialLinks?.facebook || ''}
                onChange={handleSocialLinkChange}
                placeholder="https://facebook.com/tendocuaban"
            />
            <InputField 
                label="Link Instagram"
                name="instagram"
                value={data.socialLinks?.instagram || ''}
                onChange={handleSocialLinkChange}
                placeholder="https://instagram.com/tendocuaban"
            />
        </div>
        
        <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Video Giới thiệu</h3>
            <InputField 
                label="URL Video (YouTube)" 
                name="url" 
                value={data.video?.url || ''} 
                onChange={handleVideoChange} 
                placeholder="https://www.youtube.com/watch?v=..." 
            />
            <TextAreaField 
                label="Mô tả Video" 
                name="description" 
                value={data.video?.description || ''} 
                onChange={handleVideoChange} 
                rows={3} 
            />
        </div>
      </div>


      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Xem trước trang web
        </button>
      </div>
    </div>
  );
};

export default Step5_Finalize;
