
import React, { useState } from 'react';
import type { WebsiteData, Service, Testimonial, BlogPost } from '../types';

interface AdminPanelProps {
  data: WebsiteData;
  onSave: (newData: WebsiteData) => void;
  onGoToWebsite: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onSave, onGoToWebsite }) => {
  const [localData, setLocalData] = useState<WebsiteData>(JSON.parse(JSON.stringify(data))); // Deep copy

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name will be 'facebook' or 'instagram'
    setLocalData(prev => ({
        ...prev,
        socialLinks: {
            ...prev.socialLinks,
            [name]: value,
        },
    }));
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => {
        const newVideoState = { ...(prev.video || { url: '', description: '' }), [name]: value };
        if (!newVideoState.url && !newVideoState.description) {
            const { video, ...rest } = prev;
            return rest;
        }
        return { ...prev, video: newVideoState };
    });
  };

  const handleNestedChange = <T,>(section: keyof WebsiteData, index: number, field: keyof T, value: any) => {
    setLocalData(prev => {
        const newSection = [...(prev[section] as any[])];
        newSection[index] = { ...newSection[index], [field]: value };
        return { ...prev, [section]: newSection };
    });
  };
  
  const handleDeleteItem = (section: keyof WebsiteData, index: number) => {
    if(confirm('Bạn có chắc chắn muốn xóa mục này?')) {
        setLocalData(prev => {
            const newSection = [...(prev[section] as any[])];
            newSection.splice(index, 1);
            return { ...prev, [section]: newSection };
        });
    }
  }

  const handleAddItem = (section: keyof WebsiteData) => {
     setLocalData(prev => {
        const newSection = [...(prev[section] as any[])];
        let newItem;
        switch(section) {
            case 'services':
                newItem = { id: `new-${Date.now()}`, name: 'Dịch vụ mới', description: 'Mô tả dịch vụ', imageUrl: '' };
                break;
            case 'testimonials':
                 newItem = { id: `new-${Date.now()}`, customerName: 'Tên khách hàng', rating: 5, review: 'Nội dung đánh giá.' };
                break;
            case 'blogPosts':
                 newItem = { id: `new-${Date.now()}`, title: 'Tiêu đề bài viết mới', excerpt: 'Mô tả ngắn...', imageUrl: 'https://via.placeholder.com/400x300.png?text=Ảnh+mới' };
                break;
            case 'galleryImages':
                 const newImageUrl = prompt("Nhập URL hình ảnh mới:", "https://via.placeholder.com/800x450.png?text=Ảnh+mới");
                 if(newImageUrl) newSection.push(newImageUrl);
                 return { ...prev, [section]: newSection };
            default:
                return prev;
        }
        newSection.push(newItem);
        return { ...prev, [section]: newSection };
     });
  }

  return (
    <div className="w-full mx-auto animate-fade-in flex flex-col flex-grow">
      <header className="bg-slate-700 text-white p-4 flex justify-between items-center rounded-t-xl">
        <h1 className="text-xl font-bold">Bảng điều khiển Admin</h1>
        <button onClick={onGoToWebsite} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          Xem trang web
        </button>
      </header>
      
      <main className="p-6 bg-slate-100 flex-grow overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Business Info */}
          <AdminSection title="Thông tin cơ bản">
            <InputField label="Tên doanh nghiệp" name="businessName" value={localData.businessName} onChange={handleInputChange} />
            <InputField label="Số điện thoại" name="phone" value={localData.phone} onChange={handleInputChange} />
            <InputField label="Email" name="email" value={localData.email} onChange={handleInputChange} />
            <InputField label="Khu vực hoạt động" name="serviceArea" value={localData.serviceArea} onChange={handleInputChange} />
          </AdminSection>

          {/* Social Links */}
          <AdminSection title="Mạng xã hội">
            <InputField label="Link Facebook" name="facebook" value={localData.socialLinks?.facebook || ''} onChange={handleSocialLinkChange} placeholder="https://facebook.com/tendocuaban" />
            <InputField label="Link Instagram" name="instagram" value={localData.socialLinks?.instagram || ''} onChange={handleSocialLinkChange} placeholder="https://instagram.com/tendocuaban" />
          </AdminSection>

          {/* Tagline & About */}
          <AdminSection title="Nội dung chính">
             <InputField label="Khẩu hiệu (Tagline)" name="tagline" value={localData.tagline} onChange={handleInputChange} />
             <TextAreaField label="Về chúng tôi" name="aboutUs" value={localData.aboutUs} onChange={handleInputChange} rows={6} />
          </AdminSection>
          
          {/* Video Section */}
          <AdminSection title="Video Giới thiệu">
            <InputField 
                label="URL Video (YouTube)" 
                name="url" 
                value={localData.video?.url || ''} 
                onChange={handleVideoChange} 
                placeholder="https://www.youtube.com/watch?v=..." 
            />
            <TextAreaField 
                label="Mô tả Video" 
                name="description" 
                value={localData.video?.description || ''} 
                onChange={handleVideoChange} 
                rows={3} 
            />
          </AdminSection>

          {/* Services */}
          <AdminSection title="Dịch vụ" onAdd={() => handleAddItem('services')}>
             {localData.services.map((service, index) => (
                <div key={service.id} className="p-3 border rounded-md bg-white mb-2">
                    <InputField label="Tên dịch vụ" value={service.name} onChange={e => handleNestedChange<Service>('services', index, 'name', e.target.value)} />
                    <InputField label="Mô tả" value={service.description} onChange={e => handleNestedChange<Service>('services', index, 'description', e.target.value)} />
                    <InputField label="URL Hình ảnh" value={service.imageUrl || ''} onChange={e => handleNestedChange<Service>('services', index, 'imageUrl', e.target.value)} />
                    <button onClick={() => handleDeleteItem('services', index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Xóa dịch vụ</button>
                </div>
             ))}
          </AdminSection>

          {/* Testimonials */}
          <AdminSection title="Đánh giá của khách hàng" onAdd={() => handleAddItem('testimonials')}>
             {localData.testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="p-3 border rounded-md bg-white mb-2">
                    <InputField label="Tên khách hàng" value={testimonial.customerName} onChange={e => handleNestedChange<Testimonial>('testimonials', index, 'customerName', e.target.value)} />
                    <InputField label="Đánh giá (1-5 sao)" type="number" value={testimonial.rating.toString()} onChange={e => handleNestedChange<Testimonial>('testimonials', index, 'rating', parseInt(e.target.value, 10))} />
                    <TextAreaField label="Nội dung đánh giá" value={testimonial.review} onChange={e => handleNestedChange<Testimonial>('testimonials', index, 'review', e.target.value)} rows={3}/>
                     <button onClick={() => handleDeleteItem('testimonials', index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Xóa đánh giá</button>
                </div>
             ))}
          </AdminSection>
          
          {/* Gallery */}
           <AdminSection title="Thư viện ảnh" onAdd={() => handleAddItem('galleryImages')}>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {localData.galleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                        <img src={imageUrl} className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => handleDeleteItem('galleryImages', index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
             </div>
           </AdminSection>
           
           {/* Blog Posts */}
            <AdminSection title="Bài viết Blog" onAdd={() => handleAddItem('blogPosts')}>
             {localData.blogPosts.map((post, index) => (
                <div key={post.id} className="p-3 border rounded-md bg-white mb-2">
                    <InputField label="Tiêu đề" value={post.title} onChange={e => handleNestedChange<BlogPost>('blogPosts', index, 'title', e.target.value)} />
                    <TextAreaField label="Mô tả ngắn" value={post.excerpt} onChange={e => handleNestedChange<BlogPost>('blogPosts', index, 'excerpt', e.target.value)} rows={3}/>
                    <InputField label="URL Hình ảnh" value={post.imageUrl || ''} onChange={e => handleNestedChange<BlogPost>('blogPosts', index, 'imageUrl', e.target.value)} />
                    <button onClick={() => handleDeleteItem('blogPosts', index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Xóa bài viết</button>
                </div>
             ))}
          </AdminSection>

        </div>
      </main>

      <footer className="p-4 bg-white border-t border-slate-200 rounded-b-xl">
        <div className="max-w-4xl mx-auto flex justify-end">
            <button onClick={() => onSave(localData)} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                Lưu thay đổi
            </button>
        </div>
      </footer>
    </div>
  );
};

// Helper Components for Admin Panel
const AdminSection: React.FC<{ title: string; children: React.ReactNode; onAdd?: () => void }> = ({ title, children, onAdd }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {onAdd && <button onClick={onAdd} className="bg-indigo-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-indigo-600">+ Thêm mới</button>}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name?: string; type?: string; placeholder?: string }> = 
({ label, value, onChange, name, type = 'text', placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition" />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name?: string; rows?: number }> = 
({ label, value, onChange, name, rows = 4 }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea name={name} rows={rows} value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition" />
    </div>
);


export default AdminPanel;
