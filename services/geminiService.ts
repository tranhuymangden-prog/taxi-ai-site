
import { GoogleGenAI } from "@google/genai";
import type { WebsiteData, Geolocation, PointOfInterest, GroundingChunk, BlogPost } from '../types';

// FIX: Per coding guidelines, the API key must be obtained exclusively from process.env.API_KEY and used directly. The fallback and warning have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContentWithMaps = async (prompt: string, location: Geolocation) => {
  const modelConfig: any = {
    tools: [{ googleMaps: {} }],
  };
  if (location) {
    modelConfig.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: modelConfig,
    });
    
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Không thể tạo nội dung. Vui lòng thử lại.");
  }
};

export const generateWebsiteContent = async (
  data: WebsiteData,
  location: Geolocation
): Promise<{ content: Partial<WebsiteData>, galleryImagePrompts: string[] }> => {
  const prompt = `Với vai trò là một chuyên gia marketing cho dịch vụ taxi, hãy tạo nội dung cho một trang web dựa trên thông tin sau:
- Tên doanh nghiệp: ${data.businessName}
- Khu vực hoạt động: ${data.serviceArea}
- Các dịch vụ cung cấp: ${data.services.map(s => s.name).join(', ')}

Hãy tạo ra:
1.  Một câu khẩu hiệu (tagline) hấp dẫn.
2.  Một đoạn văn "Về chúng tôi" chuyên nghiệp và thân thiện.
3.  Liệt kê 5-7 "Điểm đến nổi bật" hoặc địa điểm phổ biến trong khu vực hoạt động.
4.  Ba đánh giá (testimonial) giả định từ khách hàng. Mỗi đánh giá bao gồm "customerName", "rating" (một số từ 4 đến 5), và "review" (một vài câu).
5.  Bốn gợi ý (prompt) để tạo hình ảnh cho một thư viện ảnh. Các gợi ý này phải mô tả cảnh đẹp hoặc các tình huống liên quan đến dịch vụ taxi tại "${data.serviceArea}". Ví dụ: "Một chiếc taxi đang chờ khách trước một khách sạn sang trọng vào lúc bình minh ở ${data.serviceArea}", "Ảnh chụp từ trong xe taxi nhìn ra cảnh đêm lung linh của thành phố ${data.serviceArea}".
6.  Ba bài viết blog ngắn (mỗi bài có "title" và "excerpt") liên quan đến du lịch, mẹo di chuyển hoặc các địa điểm thú vị ở ${data.serviceArea}.

Định dạng phản hồi của bạn dưới dạng một đối tượng JSON với các khóa: "tagline", "aboutUs", "pointsOfInterest" (một mảng các đối tượng với khóa "name" và "description"), "testimonials" (một mảng các đối tượng với khóa "customerName", "rating", "review"), "galleryImagePrompts" (một mảng các chuỗi), và "blogPosts" (một mảng các đối tượng với "title" và "excerpt").
`;

  const { text, groundingChunks } = await generateContentWithMaps(prompt, location);
  
  try {
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
        jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    }
    const parsed = JSON.parse(jsonText);
    
    const poisWithLinks: PointOfInterest[] = (parsed.pointsOfInterest || []).map((poi: PointOfInterest) => {
        const relevantChunk = groundingChunks.find(chunk => 
            chunk.maps && (chunk.maps.title.includes(poi.name) || poi.name.includes(chunk.maps.title))
        );
        if (relevantChunk?.maps) {
            return { ...poi, uri: relevantChunk.maps.uri, title: relevantChunk.maps.title };
        }
        return poi;
    });

    const content: Partial<WebsiteData> = {
      tagline: parsed.tagline,
      aboutUs: parsed.aboutUs,
      pointsOfInterest: poisWithLinks,
      testimonials: (parsed.testimonials || []).map((t: any, i: number) => ({...t, id: `testimonial-${i}`})),
      blogPosts: (parsed.blogPosts || []).map((p: BlogPost, i: number) => ({
        ...p,
        id: `blog-${Date.now()}-${i}`,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(p.title)}/400/300` // Placeholder image
      })),
    };

    const galleryImagePrompts = parsed.galleryImagePrompts || [];

    return { content, galleryImagePrompts };
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON", error);
    return {
        content: {
            tagline: "Dịch vụ taxi đáng tin cậy của bạn",
            aboutUs: "Chúng tôi cung cấp dịch vụ vận chuyển an toàn, nhanh chóng và chuyên nghiệp.",
            pointsOfInterest: [],
            testimonials: [],
            blogPosts: [],
        },
        galleryImagePrompts: []
    }
  }
};

export const regenerateTagline = async (
  data: WebsiteData,
  location: Geolocation
): Promise<{ tagline: string }> => {
  const prompt = `Với vai trò là một chuyên gia marketing cho dịch vụ taxi, hãy tạo một câu khẩu hiệu (tagline) mới, hấp dẫn và độc đáo dựa trên thông tin sau:
- Tên doanh nghiệp: ${data.businessName}
- Khu vực hoạt động: ${data.serviceArea}
- Các dịch vụ cung cấp: ${data.services.map(s => s.name).join(', ')}
- Khẩu hiệu hiện tại (để tham khảo, hãy tạo một cái khác): "${data.tagline}"

Chỉ trả về câu khẩu hiệu mới dưới dạng một chuỗi văn bản thuần túy, không có thêm bất kỳ lời giải thích nào.`;

  const { text } = await generateContentWithMaps(prompt, location);
  return { tagline: text.replace(/["']/g, "").trim() };
};

export const regenerateAboutUs = async (
  data: WebsiteData,
  location: Geolocation
): Promise<{ aboutUs: string }> => {
  const prompt = `Với vai trò là một chuyên gia copywriting, hãy viết lại đoạn văn "Về chúng tôi" cho một dịch vụ taxi. Hãy làm cho nó chuyên nghiệp, thân thiện và đáng tin cậy hơn.
Thông tin doanh nghiệp:
- Tên doanh nghiệp: ${data.businessName}
- Khu vực hoạt động: ${data.serviceArea}
- Các dịch vụ cung cấp: ${data.services.map(s => s.name).join(', ')}
- Đoạn văn "Về chúng tôi" hiện tại: "${data.aboutUs}"

Hãy viết lại một phiên bản mới tốt hơn. Chỉ trả về đoạn văn mới dưới dạng một chuỗi văn bản thuần túy, không có tiêu đề "Về chúng tôi" hay lời giải thích nào khác.`;

  const { text } = await generateContentWithMaps(prompt, location);
  return { aboutUs: text.trim() };
};

export const generateServiceImage = async (serviceName: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, professional, and symbolic image for a website section about a taxi service: "${serviceName}". The style should be clean, modern, and easily understandable. Focus on a central, clear visual metaphor. Avoid text.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error(`Error generating image for "${serviceName}":`, error);
        return ""; // Return empty string on failure
    }
};

export const generateGalleryImage = async (imagePrompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A beautiful, high-resolution, realistic photograph of: "${imagePrompt}". Suitable for a taxi service's website gallery. The photo should be vibrant and professional.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error(`Error generating gallery image for prompt "${imagePrompt}":`, error);
        return ""; // Return empty string on failure
    }
};
