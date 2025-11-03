
import React, { useState } from 'react';
import type { WebsiteData, Service } from '../types';

interface Step3ServicesProps {
  data: WebsiteData;
  updateData: (fields: Partial<WebsiteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const suggestedServices: Omit<Service, 'id'>[] = [
    { name: 'Đưa đón sân bay', description: 'Dịch vụ đưa đón sân bay đúng giờ và an toàn.' },
    { name: 'Taxi đường dài', description: 'Di chuyển liên tỉnh với giá cước hợp lý.' },
    { name: 'Tham quan thành phố', description: 'Khám phá các điểm đến nổi bật trong thành phố.' },
    { name: 'Cho thuê xe theo giờ', description: 'Linh hoạt thuê xe theo nhu cầu của bạn.' },
    { name: 'Xe hợp đồng, sự kiện', description: 'Cung cấp xe cho các sự kiện, cưới hỏi.' }
];

const Step3Services: React.FC<Step3ServicesProps> = ({ data, updateData, onNext, onBack }) => {
    const [selectedServices, setSelectedServices] = useState<Set<string>>(
        new Set(data.services.map(s => s.name))
    );

    const handleToggleService = (service: Omit<Service, 'id'>) => {
        const newSelectedServices = new Set(selectedServices);
        if (newSelectedServices.has(service.name)) {
            newSelectedServices.delete(service.name);
        } else {
            newSelectedServices.add(service.name);
        }
        setSelectedServices(newSelectedServices);

        const updatedServicesList = suggestedServices
            .filter(s => newSelectedServices.has(s.name))
            .map(s => ({ ...s, id: s.name.toLowerCase().replace(/\s/g, '-') }));
        
        updateData({ services: updatedServicesList });
    };
    
    return (
        <div className="w-full max-w-lg mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-2">Dịch vụ của bạn</h2>
            <p className="text-center text-slate-500 mb-6">Chọn các dịch vụ bạn cung cấp. Điều này sẽ giúp AI hiểu rõ hơn về doanh nghiệp của bạn.</p>

            <div className="space-y-3">
                {suggestedServices.map((service) => (
                    <div
                        key={service.name}
                        onClick={() => handleToggleService(service)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                            selectedServices.has(service.name)
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500'
                                : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full mr-4 flex-shrink-0 border-2 ${selectedServices.has(service.name) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400'}`}>
                           {selectedServices.has(service.name) && <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{service.name}</h3>
                            <p className="text-sm text-slate-500">{service.description}</p>
                        </div>
                    </div>
                ))}
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
                    disabled={selectedServices.size === 0}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default Step3Services;
