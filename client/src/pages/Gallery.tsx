import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { GalleryImage } from "../types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    api
      .get("/gallery")
      .then((r) => setImages(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const selectedIndex = selected
    ? images.findIndex((img) => img._id === selected._id)
    : -1;

  const showPrevious = () => {
    if (selectedIndex <= 0) return;
    setSelected(images[selectedIndex - 1]);
  };

  const showNext = () => {
    if (selectedIndex === -1 || selectedIndex >= images.length - 1) return;
    setSelected(images[selectedIndex + 1]);
  };

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute right-[-140px] top-[-170px] h-[430px] w-[430px] rounded-full border border-brand-gold/[0.08]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-130px] h-[380px] w-[380px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academy Moments
                </span>

              </div>

              <div className="mt-7 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/30">
                  <Camera className="h-5 w-5 text-brand-gold" />
                </div>

                <p className="max-w-xs text-sm leading-7 text-slate-400">
                  A visual collection of learning, achievement, events and
                  memorable moments at REMON ACADEMY.
                </p>

              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >

              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Moments
                <br />
                <span className="text-brand-gold">
                  worth remembering.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Explore moments from our academic environment, events,
                celebrations and student activities.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ============================================================
          INFO STRIP
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid md:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">

              <Camera className="h-5 w-5 text-brand-gold" />

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Gallery
              </p>

              <p className="mt-1 text-sm font-semibold">
                Academy moments
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">

              <span className="font-display text-lg font-bold text-brand-gold">
                {images.length}
              </span>

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Collection
              </p>

              <p className="mt-1 text-sm font-semibold">
                {images.length === 1 ? "Photo" : "Photos"} available
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">

              <ArrowUpRight className="h-5 w-5 text-brand-gold" />

            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Explore
              </p>

              <p className="mt-1 text-sm font-semibold">
                Click any photo to view
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          GALLERY
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Visual Archive
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Inside REMON ACADEMY.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Every image tells a small part of our academic story.
              </p>

            </div>

            {images.length > 0 && (
              <div className="text-xs font-semibold text-slate-400">
                {images.length}{" "}
                {images.length === 1 ? "image" : "images"}
              </div>
            )}

          </div>

          <div className="mt-10 h-px bg-slate-200 dark:bg-slate-800" />

          {loading ? (
            <div className="py-16">
              <Loader label="Loading gallery..." />
            </div>
          ) : error ? (
            <div className="py-12">
              <ErrorState message={error} />
            </div>
          ) : images.length === 0 ? (
            <div className="py-12">
              <EmptyState message="No gallery images uploaded yet." />
            </div>
          ) : (
            <div className="mt-10">

              {/* Desktop / Mobile Gallery Grid */}

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

                {images.map((img, index) => (

                  <motion.button
                    key={img._id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.04, 0.25),
                    }}
                    onClick={() => setSelected(img)}
                    className={`group relative overflow-hidden bg-slate-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 dark:bg-slate-800 ${
                      index % 7 === 0
                        ? "col-span-2 row-span-2 aspect-square lg:col-span-2 lg:row-span-2"
                        : "aspect-square"
                    }`}
                  >

                    <img
                      src={img.image}
                      alt={img.title}
                      loading={index < 4 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Number */}

                    <div className="absolute left-4 top-4">

                      <span className="border border-white/30 bg-black/20 px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] text-white backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    {/* Hover icon */}

                    <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-[-5px] items-center justify-center border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                      <ArrowUpRight className="h-4 w-4" />

                    </div>

                    {/* Title */}

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">

                      <p className="translate-y-2 text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
                        {img.title}
                      </p>

                    </div>

                  </motion.button>

                ))}

              </div>

            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Beyond The Classroom
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Education is more
                <br />
                than a classroom.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Learning happens through experiences, relationships,
                challenges, celebrations and the moments students remember.
              </p>

            </div>

            <div className="border-t border-white/10">

              <div className="grid sm:grid-cols-3">

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold">
                    01
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Learn
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Building strong academic foundations through consistent
                    learning.
                  </p>

                </div>

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold">
                    02
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Experience
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Creating meaningful experiences that support student
                    growth.
                  </p>

                </div>

                <div className="py-8 sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold">
                    03
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Remember
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Turning everyday academic moments into lasting memories.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          LIGHTBOX
      ============================================================ */}

      <AnimatePresence>

        {selected && (

          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070b]/95 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >

            {/* Close */}

            <button
              type="button"
              aria-label="Close image"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors hover:border-brand-gold hover:text-brand-gold sm:right-7 sm:top-7"
              onClick={() => setSelected(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Previous */}

            {selectedIndex > 0 && (

              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white transition-colors hover:border-brand-gold hover:text-brand-gold sm:left-7"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

            )}

            {/* Next */}

            {selectedIndex !== -1 &&
              selectedIndex < images.length - 1 && (

                <button
                  type="button"
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white transition-colors hover:border-brand-gold hover:text-brand-gold sm:right-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

              )}

            {/* Image */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[88vh] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >

              <img
                src={selected.image}
                alt={selected.title}
                className="max-h-[78vh] max-w-[92vw] object-contain shadow-2xl sm:max-h-[82vh]"
              />

              {/* Caption */}

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-white">
                    {selected.title}
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    REMON ACADEMY
                  </p>

                </div>

                <span className="shrink-0 text-xs text-slate-500">
                  {selectedIndex + 1} / {images.length}
                </span>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}


