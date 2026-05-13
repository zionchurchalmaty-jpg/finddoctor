import { MetadataRoute } from 'next';
import { getPublishedContent } from '@/lib/firestore/client-content';

const baseUrl = 'https://finddoctor.kz';

export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const doctors = await getPublishedContent("doctors").catch(() => []) || [];
  const articles = await getPublishedContent("blog").catch(() => []) || [];

  const generateUrl = (
    path: string, 
    lastModified: Date, 
    priority: number, 
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  ): MetadataRoute.Sitemap[number] => {
    return {
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }; 
  };

  const staticPaths = [
    { path: '', priority: 1, freq: 'daily' as const },
    { path: '/search', priority: 0.9, freq: 'weekly' as const },
    { path: '/for-doctors', priority: 0.9, freq: 'weekly' as const },
    { path: '/about', priority: 0.8, freq: 'monthly' as const }, 
    { path: '/cases', priority: 0.8, freq: 'weekly' as const }, 
    { path: '/blog', priority: 0.8, freq: 'daily' as const },
  ];

  const staticUrls = staticPaths.map(route => 
    generateUrl(route.path, new Date(), route.priority, route.freq)
  );

  const doctorUrls = doctors.map((doctor: any) => {
    const date = doctor.updatedAt ? new Date(doctor.updatedAt) : new Date();
    const path = `/doctor/${doctor.slug || doctor.id}`; 
    return generateUrl(path, date, 0.8, 'weekly');
  });

  const articleUrls = articles.map((article: any) => {
    const date = article.updatedAt ? new Date(article.updatedAt) : new Date();
    const path = `/${article.slug}`;
    const priority = article.isSeo ? 0.9 : 0.7;
    
    return generateUrl(path, date, priority, 'monthly');
  });

  return [...staticUrls, ...doctorUrls, ...articleUrls];
}