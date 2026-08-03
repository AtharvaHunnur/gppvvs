import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../api/client';
import { getImageUrl } from '../utils/url';

interface HeroSlide {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position: number;
}

const fallbackSlides: HeroSlide[] = [
  { id: 'f1', title: 'Moulding the Rural Youth for the Modern World', subtitle: 'Est. 1972 • 50+ Years of Excellence', imageUrl: '/images/about_college.jpg', position: 0 },
  { id: 'f2', title: 'G.P. Porwal Arts, Commerce & V.V. Salimath Science College', subtitle: 'NAAC \'B++\' Accredited Institution', imageUrl: '/images/about_drama1.jpg', position: 1 },
  { id: 'f3', title: 'Empowering Students Through Quality Education', subtitle: 'Affiliated to Rani Channamma University, Belagavi', imageUrl: '/images/about_drama2.jpg', position: 2 },
  { id: 'f4', title: 'A Legacy of Academic Excellence', subtitle: 'Sri Padmaraj Vidya Vardhaka Samstha, Sarangamath, Sindagi', imageUrl: '/images/about_drama3.jpg', position: 3 },
];

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await apiClient.get('/hero-slides');
        const data = res.data.data || [];
        setSlides(data.length > 0 ? data : fallbackSlides);
      } catch {
        setSlides(fallbackSlides);
      }
    };
    fetchSlides();
  }, []);

  const goToNext = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [slides.length, goToNext]);

  if (slides.length === 0) return null;

  const slide = slides[currentIndex];
  const imageUrl = getImageUrl(slide.imageUrl) || slide.imageUrl;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden border-b-8 border-secondary">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id + '-' + currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? 'w-8 h-3 bg-secondary shadow-lg'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
