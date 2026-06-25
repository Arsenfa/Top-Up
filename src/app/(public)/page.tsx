import React, { Suspense } from "react";
import { HeroSection } from "@/features/home/components/hero-section";
import { StatsSection } from "@/features/home/components/stats-section";
import { CTABannerSection } from "@/features/home/components/cta-banner-section";
import { PaymentMethodsSection } from "@/features/home/components/payment-methods-section";

// ponytail: lazy-load heavy below-the-fold sections
const PromoCarousel = React.lazy(() =>
  import("@/features/home/components/promo-carousel").then((m) => ({ default: m.PromoCarousel }))
);
const GameSection = React.lazy(() =>
  import("@/features/home/components/game-section").then((m) => ({ default: m.GameSection }))
);
const WhyChooseUsSection = React.lazy(() =>
  import("@/features/home/components/why-choose-us-section").then((m) => ({ default: m.WhyChooseUsSection }))
);
const TestimonialsSection = React.lazy(() =>
  import("@/features/home/components/testimonials-section").then((m) => ({ default: m.TestimonialsSection }))
);
const FAQSection = React.lazy(() =>
  import("@/features/home/components/faq-section").then((m) => ({ default: m.FAQSection }))
);

// ponytail: lightweight skeleton placeholder with min-height to prevent CLS
function SectionSkeleton({ height = "h-64", minHeight }: { height?: string; minHeight?: string }) {
  return <div className={`w-full ${height} ${minHeight ? minHeight : "min-h-[256px]"} bg-bg-secondary animate-pulse`} />;
}

export const revalidate = 60; // ISR: cache 60 detik, rebuild di background

export default async function HomePage() {
  const { prisma } = await import("@/lib/prisma");

  // Banners + games in parallel
  const [banners, games] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.game.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
        },
      },
    }),
  ]);

  const searchGames = games.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    category: g.category,
  }));

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
      <HeroSection games={searchGames} />
      <StatsSection />

      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        {banners.length > 0 && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 lg:mt-14 mb-4">
            <PromoCarousel banners={banners} />
          </div>
        )}
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
        <GameSection games={gameItems} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhyChooseUsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>

      <CTABannerSection />
      <PaymentMethodsSection />
    </div>
  );
}
