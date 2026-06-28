import { getTranslations } from "next-intl/server";
import { searchDoctors } from "@/lib/actions/search";
import DoctorCard from "@/components/cards/DoctorCard";
import SearchWidget from "@/components/SearchWidget";

interface SearchPageProps {
  searchParams: Promise<{ city?: string; specialty?: string }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { city, specialty } = await searchParams;
  const lang = "ru";

  const t = await getTranslations("SearchPage");
  
  const doctors = await searchDoctors(lang, city, specialty);

  return (
    <main className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title") || "Результаты поиска"}
          </h1>
          <p className="text-gray-500 mb-8 max-w-2xl">
            {city || specialty
              ? `${t("subtitle")}: ${specialty || t("allSpecialties")} ${city ? `${t("inCity")} ${city}` : ""}`
              : t("noParams")}
          </p>

          <div className="w-full flex justify-center">
            <SearchWidget />
          </div>
        </div>

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doc) => {
              const reviewsCount = doc.reviews?.length || 0;
              const rating =
                reviewsCount > 0
                  ? doc.reviews.reduce((acc, r) => acc + r.rating, 0) /
                    reviewsCount
                  : 0;

              const minPrice =
                doc.prices?.length > 0
                  ? Math.min(...doc.prices.map((p) => p.price))
                  : 0;

              return (
                <DoctorCard
                  key={doc.id}
                  id={doc.slug || doc.id}
                  image={doc.photo}
                  name={doc.name?.ru || ""}
                  specialty={doc.specialty?.ru || ""}
                  rating={rating}
                  reviewsCount={reviewsCount}
                  experienceYears={doc.experienceYears}
                  location={
                    doc.location?.address?.ru?.split(",")[0] || "Алматы"
                  }
                  views={doc.views}
                  shortDescription={
                    doc.shortDescription?.ru || doc.reasons?.[0]?.ru
                  }
                  price={minPrice}
                  lang="ru"
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ничего не найдено
            </h3>
            <p className="text-gray-500">
              Попробуйте изменить параметры поиска или выбрать другой город.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}