import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">Gallery</h1>
        <p className="mt-2 text-slate-500">Moments from our classes, events, and celebrations.</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} />
      ) : images.length === 0 ? (
        <EmptyState message="No gallery images uploaded yet." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img, i) => (
            <motion.button
              key={img._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelected(img)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <img src={img.image} alt={img.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-semibold text-white">{img.title}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <button className="absolute right-6 top-6 text-white" onClick={() => setSelected(null)}>
              <X className="h-8 w-8" />
            </button>
            <motion.img
              src={selected.image}
              alt={selected.title}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-h-[80vh] max-w-full rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
