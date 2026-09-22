import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { GalleryImage } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Events");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/gallery").then((r) => setImages(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleUpload() {
    if (!file) { show("Please select an image", "error"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category);
      await api.post("/gallery", formData, { headers: { "Content-Type": "multipart/form-data" } });
      show("Image uploaded", "success");
      setModalOpen(false);
      setTitle(""); setFile(null);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/gallery/${deleteTarget._id}`); show("Image deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Gallery</h2>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Upload Image</Button>
      </div>

      {loading ? <Loader /> : images.length === 0 ? <EmptyState message="No images uploaded yet." /> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img) => (
            <div key={img._id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <img src={img.image} alt={img.title} className="h-full w-full object-cover" />
              <button
                onClick={() => setDeleteTarget(img)}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white">{img.title}</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title="Upload Gallery Image" onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <div>
            <label className="label-field">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-field" />
          </div>
          <Button onClick={handleUpload} loading={saving}>Upload</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Image" message="Delete this image?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
