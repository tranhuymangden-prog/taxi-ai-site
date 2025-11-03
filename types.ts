export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface PointOfInterest {
  name: string;
  description: string;
  uri?: string;
  title?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  review: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
}

export interface WebsiteData {
  businessName: string;
  phone: string;
  email: string;
  serviceArea: string;
  services: Service[];
  tagline: string;
  aboutUs: string;
  pointsOfInterest: PointOfInterest[];
  testimonials: Testimonial[];
  galleryImages: string[];
  blogPosts: BlogPost[];
  video?: {
    url: string;
    description: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

export type Geolocation = {
  latitude: number;
  longitude: number;
} | null;

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        title: string;
      }[];
    };
  };
}