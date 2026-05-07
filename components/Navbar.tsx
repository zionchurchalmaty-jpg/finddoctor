"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="relative flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white shadow-sm font-sans z-50">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3"
          onClick={closeMenu}
        >
          <Image
            src="/logo.svg"
            alt="FindDoctor Logo"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />

          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold leading-none">
              FindDoctor
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wide">
              {t("logoSubtitle")}
            </span>
          </div>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {t("home")}
        </Link>
        <Link href="/cases" className="hover:text-blue-600 transition-colors">
          {t("cases")}
        </Link>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          {t("blog")}
        </Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">
          {t("about")}
        </Link>
      </nav>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden lg:flex items-center gap-6">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5"
          >
            <Link href="/for-doctors">{t("forDoctors")}</Link>
          </Button>

          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <div className="flex flex-col">
              <a
                href="tel:+77052793078"
                className="font-bold text-sm hover:text-[#2563EB] transition-colors cursor-pointer inline-block"
              >
                +7 (705) 279-30-78
              </a>{" "}
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                {t("phoneSub")}
              </span>
            </div>
          </div>
        </div>

        <button
          className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg lg:hidden flex flex-col px-4 py-6 gap-6 z-50">
          <nav className="flex flex-col gap-4 text-base font-medium text-gray-800">
            <Link href="/" onClick={closeMenu} className="hover:text-blue-600">
              {t("home")}
            </Link>
            <Link
              href="/cases"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              {t("cases")}
            </Link>
            <Link
              href="/blog"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              {t("blog")}
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="hover:text-blue-600"
            >
              {t("about")}
            </Link>
          </nav>

          <div className="w-full h-px bg-gray-100" />

          <div className="flex flex-col gap-4">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full"
            >
              <Link href="/for-doctors" onClick={closeMenu}>
                {t("forDoctors")}
              </Link>
            </Button>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <a
                  href="tel:+77052793078"
                  className="font-bold text-sm text-gray-900 hover:text-[#2563EB] transition-colors cursor-pointer inline-block"
                >
                  +7 (705) 279-30-78
                </a>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {t("phoneSub")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
