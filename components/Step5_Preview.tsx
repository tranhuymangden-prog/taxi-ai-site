import React, { useState, useEffect } from 'react';
import type { WebsiteData } from '../types';
import { logoBase64 } from '../assets';

interface Step6PreviewProps {
  data: WebsiteData;
  onGoToAdmin: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}>
                <path fillRule="evenodd" d="M10.788 3.21c.448-.876 1.527-.876 1.976 0l2.1 4.215a1.125 1.125 0 0 0 .95 1.767l4.636.67c.969.14 1.362 1.242.66 1.93l-3.35 3.268a1.125 1.125 0 0 0-.326 1.054l.79 4.617c.175.95-.81 1.67-1.664 1.22l-4.14-2.176a1.125 1.125 0 0 0-1.05 0l-4.14 2.176c-.854.45-1.84-.27-1.664-1.22l.79-4.617a1.125 1.125 0 0 0-.326-1.054L2.24 11.8c-.702-.688-.31-1.79.66-1.93l4.636-.67a1.125 1.125 0 0 0 .95-1.767l2.1-4.215Z" clipRule="evenodd" />
            </svg>
        ))}
    </div>
);


const Step6_Preview: React.FC<Step6PreviewProps> = ({ data, onGoToAdmin }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: `Dịch vụ taxi của ${data.businessName}`,
      text: `Tìm kiếm dịch vụ taxi uy tín? Hãy thử ${data.businessName}! Liên hệ ngay: ${data.phone}. "${data.tagline}"`,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing content:', err);
    }
  };

  const hasGallery = data.galleryImages && data.galleryImages.length > 0;
  const hasTestimonials = data.testimonials && data.testimonials.length > 0;
  const hasBlogPosts = data.blogPosts && data.blogPosts.length > 0;
  
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      // Not a valid URL, maybe it's already an embed link
    }
    return url; // Assume it's a valid embed link if parsing fails
  };

  return (
    <div className="w-full mx-auto animate-fade-in flex flex-col flex-grow">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative flex-grow">
            {/* Header */}
            <header className="bg-slate-800 text-white p-6 md:p-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center text-center md:text-left">
                        <img src={logoBase64} alt={`${data.businessName} logo`} className="h-16 w-auto mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold">{data.businessName}</h1>
                            <p className="text-indigo-300 mt-1 italic">"{data.tagline}"</p>
                        </div>
                    </div>
                    <a href={`tel:${data.phone}`} className="flex-shrink-0 bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105">
                        Gọi ngay: {data.phone}
                    </a>
                </div>
            </header>

            <main className="p-6 md:p-10 space-y-12 md:space-y-16">
                {/* About Us */}
                <section id="about" className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-4">Về chúng tôi</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.aboutUs}</p>
                </section>

                {/* Video Section */}
                {data.video && data.video.url && (
                    <section id="video" className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-4">Video Giới thiệu</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">{data.video.description}</p>
                        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border">
                             <iframe
                                src={getYouTubeEmbedUrl(data.video.url)}
                                title="Video giới thiệu dịch vụ taxi"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </section>
                )}


                {/* Services */}
                <section id="services" className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-6">Dịch vụ của chúng tôi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.services.map(service => (
                            <div key={service.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col text-center shadow-sm">
                                <div className="w-full h-40 mb-4 flex items-center justify-center bg-slate-200 rounded-md overflow-hidden">
                                    {service.imageUrl === undefined ? (
                                        <div className="w-full h-full animate-pulse"></div>
                                    ) : service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">{service.name}</h3>
                                <p className="text-slate-600 mt-1 flex-grow">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                 {/* Testimonials */}
                {hasTestimonials && (
                    <section id="testimonials" className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-6">Khách hàng nói gì</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.testimonials.map(testimonial => (
                                <div key={testimonial.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col shadow-sm">
                                    <StarRating rating={testimonial.rating} />
                                    <p className="text-slate-600 italic my-4 flex-grow">"{testimonial.review}"</p>
                                    <p className="font-bold text-right text-slate-800">- {testimonial.customerName}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Blog Posts */}
                {hasBlogPosts && (
                     <section id="blog" className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-6">Tin tức & Kinh nghiệm Di chuyển</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.blogPosts.map(post => (
                                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-slate-200 flex flex-col">
                                    <div className="w-full h-48 bg-slate-200">
                                         <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-xl text-slate-800 mb-2">{post.title}</h3>
                                        <p className="text-slate-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                                        <a href="#" className="text-indigo-600 hover:text-indigo-800 font-semibold self-start">
                                            Đọc thêm &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Gallery */}
                {hasGallery && (
                    <section id="gallery" className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-6">Thư viện ảnh</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {data.galleryImages.map((imageUrl, index) => (
                                <div key={index} className="aspect-video bg-slate-200 rounded-lg overflow-hidden shadow-md">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* POIs */}
                {data.pointsOfInterest.length > 0 && (
                    <section id="destinations" className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold border-b-4 border-indigo-500 pb-2 inline-block mb-6">Điểm đến nổi bật</h2>
                        <div className="space-y-4">
                            {data.pointsOfInterest.map(poi => (
                                <div key={poi.name} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-bold text-lg">{poi.name}</h3>
                                        <p className="text-slate-600">{poi.description}</p>
                                        {poi.uri && (
                                            <a href={poi.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">
                                                Xem trên bản đồ
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

             {/* Footer */}
             <footer className="bg-slate-800 text-slate-300 p-8">
                <div className="max-w-5xl mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} {data.businessName}. All rights reserved.</p>
                    <p>Liên hệ: {data.phone} {data.email && `| ${data.email}`}</p>
                    
                    {(data.socialLinks?.facebook || data.socialLinks?.instagram) && (
                        <div className="flex items-center justify-center gap-4 mt-4">
                            {data.socialLinks.facebook && (
                                <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {data.socialLinks.instagram && (
                                <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.002 6.363a4.158 4.158 0 11-8.316 0 4.158 4.158 0 018.316 0zM12 15.363a3.363 3.363 0 100-6.726 3.363 3.363 0 000 6.726zm4.838-8.12a1.423 1.423 0 100-2.846 1.423 1.423 0 000 2.846z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
             </footer>

            {/* Floating Call Button */}
            <a href={`tel:${data.phone}`} title={`Gọi ${data.phone}`} className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.956-.852-1.081l-6.26-1.46c-.534-.125-1.082.16-1.405.66l-2.08 2.08a15.753 15.753 0 0 1-7.257-7.257l2.08-2.08c.491-.323.785-.871.66-1.405l-1.46-6.26C3.206 3.601 2.766 3.25 2.25 3.25H1.372c-1.24 0-2.25 1.01-2.25 2.25v.75Z" />
                </svg>
                <span className="sr-only">Gọi ngay</span>
            </a>
        </div>


        <div className="flex flex-wrap justify-center gap-4 mt-8">
             <button
                onClick={onGoToAdmin}
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
               </svg>
               <span>Quản lý Trang</span>
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.036 15.016 7.217-4.11m-9.637 4.109 4.819-4.109m-4.819 4.109-4.819-4.109m9.637 4.109.002-8.217m-9.637 4.108.002-8.217m0 0a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm9.637 0a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-4.819 4.108a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                 </svg>
                 <span>Chia sẻ</span>
              </button>
            )}
        </div>
    </div>
  );
};

export default Step6_Preview;
