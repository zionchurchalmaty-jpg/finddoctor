"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Save, Loader2, User, ListChecks, Info, Award,
  Image as ImageIcon, MessageSquare, DollarSign, CircleQuestionMark,
  Globe
} from "lucide-react";

import { useAuth } from "./auth-provider";
import { createContent, updateContent, syncDoctorCases, generateSlug } from "@/lib/firestore/client-content";

import { DoctorBasicTab } from "./doctor-tabs/basic-tab";
import { DoctorBenefitsTab } from "./doctor-tabs/benefits-tab";
import { DoctorInfoTab } from "./doctor-tabs/info-tab";
import { DoctorCertificatesTab } from "./doctor-tabs/certificates-tab";
import { DoctorCasesTab } from "./doctor-tabs/cases-tab";
import { DoctorReviewsTab } from "./doctor-tabs/reviews-tab";
import { DoctorPricesTab } from "./doctor-tabs/prices-tab";
import { DoctorFAQTab } from "./doctor-tabs/faq-tab";
import { DoctorSeoTab } from "./doctor-tabs/seo-tab";

export function DoctorForm({ initialData, isEditing = false }: any) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const methods = useForm({
    defaultValues: initialData || {
      contentType: "doctors",
      status: "published",
      photo: "",
      name: { ru: "", kz: "" },
      specialty: { ru: "", kz: "" },
      experienceYears: 0,
      videoUrl: "",
      education: { ru: "", kz: "" },
      equipment: { ru: "", kz: "" },
      location: { ru: "", kz: "" },
      reasons: [],
      services: [],
      certificates: [],
      cases: [],
      reviews: [],
      prices: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        noIndex: false,
        schemaMarkup: "",
        ogImage: "",
      }
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) {
      alert("Ошибка: Вы не авторизованы. Пожалуйста, войдите в систему.");
      return; 
    }

    setSaving(true);
    try {
      const { cases, ...doctorData } = data;
      let doctorId = initialData?.id;

      if (!doctorData.seo?.ogImage && doctorData.photo) {
        doctorData.seo = {
          ...doctorData.seo,
          ogImage: doctorData.photo
        };
      }

      if (isEditing && doctorId) {
        await updateContent(doctorId, doctorData);
      } else {
        doctorId = await createContent(doctorData, user.uid, user.email || "Admin");
      }

      if (doctorId) {
        const doctorSlug = doctorData.slug || generateSlug(doctorData.name?.ru || "doctor");
        await syncDoctorCases(doctorId, doctorSlug, doctorData.name, cases || []);
      }
      
      router.push("/admin/doctors");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Не удалось сохранить профиль. Проверьте консоль.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 max-w-6xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-[#DADCE0] gap-4 mb-6">
          <h1 className="text-xl font-bold text-[#202124]">
            {isEditing
              ? "Редактирование профиля врача"
              : "Создание профиля врача"}
          </h1>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Сохранить изменения" : "Опубликовать профиль"}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full space-y-6">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="flex flex-row w-full justify-start bg-transparent p-0 border-b border-[#DADCE0] rounded-none h-auto">
              <TabsTrigger
                value="basic"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <User className="w-[18px] h-[18px] mr-2 shrink-0" /> Данные врача
              </TabsTrigger>

              <TabsTrigger
                value="benefits"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <ListChecks className="w-[18px] h-[18px] mr-2 shrink-0" /> Услуги
              </TabsTrigger>

              <TabsTrigger
                value="info"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <Info className="w-[18px] h-[18px] mr-2 shrink-0" /> Инфо
              </TabsTrigger>

              <TabsTrigger
                value="certs"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <Award className="w-[18px] h-[18px] mr-2 shrink-0" /> Сертификаты
              </TabsTrigger>

              <TabsTrigger
                value="cases"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <ImageIcon className="w-[18px] h-[18px] mr-2 shrink-0" /> Кейсы
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <MessageSquare className="w-[18px] h-[18px] mr-2 shrink-0" /> Отзывы
              </TabsTrigger>

              <TabsTrigger
                value="prices"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <DollarSign className="w-[18px] h-[18px] mr-2 shrink-0" /> Прайс-лист
              </TabsTrigger>

              <TabsTrigger
                value="faq"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <CircleQuestionMark className="w-[18px] h-[18px] mr-2 shrink-0" /> Вопросы
              </TabsTrigger>

              <TabsTrigger
                value="seo"
                className="flex items-center px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A73E8] data-[state=active]:text-[#1A73E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#5F6368] hover:text-[#202124] whitespace-nowrap transition-colors"
              >
                <Globe className="w-[18px] h-[18px] mr-2 shrink-0" /> SEO
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#DADCE0] min-h-[600px]">
            <TabsContent value="basic" className="mt-0">
              <DoctorBasicTab />
            </TabsContent>

            <TabsContent value="benefits" className="mt-0">
              <DoctorBenefitsTab />
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <DoctorInfoTab />
            </TabsContent>

            <TabsContent value="certs" className="mt-0">
              <DoctorCertificatesTab />
            </TabsContent>

            <TabsContent value="cases" className="mt-0">
              <DoctorCasesTab />
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <DoctorReviewsTab />
            </TabsContent>

            <TabsContent value="prices" className="mt-0">
              <DoctorPricesTab />
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <DoctorFAQTab />
            </TabsContent>

            <TabsContent value="seo" className="mt-0">
              <DoctorSeoTab />
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  );
}