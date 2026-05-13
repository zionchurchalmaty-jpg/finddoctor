"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DoctorSeoTab() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#202124]">SEO Настройки для поисковиков</h2>
        <p className="text-sm text-gray-500">
          Заполните эти поля, чтобы профиль врача лучше индексировался в Google и Yandex.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo.metaTitle">Meta Title (Заголовок страницы)</Label>
        <Input
          id="seo.metaTitle"
          placeholder="Например: Врач-стоматолог Иван Иванов | Запись на прием в Алматы"
          {...register("seo.metaTitle")}
        />
        <p className="text-xs text-gray-400">Рекомендуемая длина: 50-60 символов.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo.metaDescription">Meta Description (Описание)</Label>
        <Textarea
          id="seo.metaDescription"
          placeholder="Например: Квалифицированный стоматолог с опытом 10 лет. Лечение кариеса, имплантация, отбеливание..."
          {...register("seo.metaDescription")}
          className="min-h-[100px]"
        />
        <p className="text-xs text-gray-400">Рекомендуемая длина: 150-160 символов.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo.canonicalUrl">Canonical URL (Необязательно)</Label>
        <Input
          id="seo.canonicalUrl"
          placeholder="https://yoursite.kz/doctors/ivan-ivanov"
          {...register("seo.canonicalUrl")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo.schemaMarkup">Schema Markup (JSON-LD микроразметка)</Label>
        <Textarea
          id="seo.schemaMarkup"
          placeholder='{"@context": "https://schema.org", "@type": "Physician", "name": "Иван Иванов"...}'
          {...register("seo.schemaMarkup")}
          className="min-h-[150px] font-mono text-sm"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="seo.noIndex"
          {...register("seo.noIndex")}
          className="h-4 w-4 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8]"
        />
        <Label htmlFor="seo.noIndex" className="font-normal cursor-pointer">
          Скрыть эту страницу от поисковых систем (noindex)
        </Label>
      </div>
    </div>
  );
}