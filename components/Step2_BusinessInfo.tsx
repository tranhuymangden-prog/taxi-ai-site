
import React from 'react';
import type { WebsiteData } from '../types';

interface Step2BusinessInfoProps {
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


const Step2BusinessInfo: React.FC<Step2BusinessInfoProps> = ({ data, updateData, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const canProceed = data.businessName && data.phone && data.serviceArea;

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-2">Thông tin cơ bản</h2>
      <p className="text-center text-slate-500 mb-6">Hãy cho tôi biết một chút về doanh nghiệp của bạn.</p>
      
      <InputField 
        label="Tên doanh nghiệp / Tên dịch vụ của bạn là gì?"
        name="businessName"
        value={data.businessName}
        onChange={handleChange}
        placeholder="Ví dụ: Taxi ABC, Dịch vụ xe Sài Gòn"
      />
       <InputField 
        label="Số điện thoại đặt xe"
        name="phone"
        type="tel"
        value={data.phone}
        onChange={handleChange}
        placeholder="Ví dụ: 090 xxx xxxx"
      />
      <InputField 
        label="Email liên hệ (không bắt buộc)"
        name="email"
        type="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Ví dụ: contact@email.com"
      />
       <InputField 
        label="Khu vực hoạt động chính của bạn?"
        name="serviceArea"
        value={data.serviceArea}
        onChange={handleChange}
        placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Step2BusinessInfo;
