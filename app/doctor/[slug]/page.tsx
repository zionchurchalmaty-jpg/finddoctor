import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getContentById } from "@/lib/firestore/client-content";
import { DoctorProfile } from "@/lib/firestore/types";
import Hero from "@/components/Hero";
import { DoctorInfo } from "@/components/doctors/DoctorInfo";
import { DoctorExperience } from "@/components/doctors/DoctorExperience";
import { DoctorShowcase } from "@/components/doctors/DoctorShowcase";
import { DoctorPricesFaq } from "@/components/doctors/DoctorPricesFaq";
import { DoctorFooter } from "@/components/doctors/DoctorFooter";
import { ViewTracker } from "@/components/doctors/ViewTracker";

interface DoctorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { slug } = await params;

  let doc = await getContentBySlug(slug, "doctors");
  if (!doc) {
    doc = await getContentById(slug, "doctors");
  }
  
  if (!doc) return {};

  const doctor = doc as unknown as DoctorProfile;
  const name = doctor.name?.ru || "Врач";
  const seo = doctor.seo;

  const ogImageUrl = seo?.ogImage || doctor.photo;

  return {
    title: seo?.metaTitle || `${name} — Запись на прием`,
    description: seo?.metaDescription || `Запишитесь на прием к врачу: ${name}. Специализация: ${doctor.specialty?.ru || ""}`,
    
    alternates: seo?.canonicalUrl ? {
      canonical: seo.canonicalUrl,
    } : {},

    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },

    openGraph: {
      title: seo?.metaTitle || `${name} — Запись на прием`,
      description: seo?.metaDescription || `Запишитесь на прием к врачу: ${name}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: "profile",
    }
  };
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { slug } = await params;
  
  let content = await getContentBySlug(slug, "doctors");
  if (!content) {
    content = await getContentById(slug, "doctors");
  }
  if (!content || content.status !== "published") {
    notFound();
  }
  const doctor = content as unknown as DoctorProfile;

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {doctor.seo?.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: doctor.seo.schemaMarkup }}
        />
      )}

      <ViewTracker doctorId={doctor.id} />
      <Hero variant="doctor" doctor={doctor} />
      <DoctorInfo doctor={doctor} />
      <DoctorExperience doctor={doctor} />
      <DoctorShowcase doctor={doctor} />
      <DoctorPricesFaq doctor={doctor} />
      <DoctorFooter doctor={doctor} />
    </main>
  );
}