export const dynamic = "force-dynamic";

import React from "react";
import { HeroSection } from "@/features/home/components/hero-section";
import { PromoCarousel } from "@/features/home/components/promo-carousel";
import { GameSection } from "@/features/home/components/game-section";
import { StatsSection } from "@/features/home/components/stats-section";
import { WhyChooseUsSection } from "@/features/home/components/why-choose-us-section";
import { PaymentMethodsSection } from "@/features/home/components/payment-methods-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { FAQSection } from "@/features/home/components/faq-section";
import { CTABannerSection } from "@/features/home/components/cta-banner-section";

export default async function HomePage() {
  const { prisma } = await import("@/lib/prisma");

  // Banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // Games with their cheapest product price
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { price: "asc" },
        take: 1,
      },
    },
  });

  // Shape data for search
  const searchGames = games.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    category: g.category,
  }));

  // Shape data for game grid (include minPrice)
  const gameItems = games.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    imageUrl: g.imageUrl,
    publisher: g.publisher,
    category: g.category,
    isPopular: g.isPopular,
    minPrice: g.products[0]?.price ?? undefined,
  }));

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero: split layout with search */}
      <HeroSection games={searchGames} />

      {/* 2. Stats counters */}
      <StatsSection />

      {/* 3. Promo carousel: only if banners exist */}
      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 lg:mt-14 mb-4">
          <PromoCarousel banners={banners} />
        </div>
      )}

      {/* 4. Game list with filters */}
      <GameSection games={gameItems} />

      {/* 5. Why Choose Us */}
      <WhyChooseUsSection />

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. FAQ */}
      <FAQSection />

      {/* 8. Bottom CTA Banner */}
      <CTABannerSection />

      {/* 9. Payment Methods */}
      <PaymentMethodsSection />
    </div>
  );
}
