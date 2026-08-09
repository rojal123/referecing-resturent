import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api.js';
import { useAdminList } from '../helpers.js';

const emptyMenuForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  isAvailable: true,
  imageUrl: ''
};

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function AddEditDish() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Reuses the same list the menu table loads from, so no new backend
  // route is needed just to fetch one item to edit.
  const { items, error: listError } = useAdminList('/admin/menu');

  const [form, setForm] = useState(emptyMenuForm);
  const [loaded, setLoaded] = useState(!isEditing); // true immediately when adding
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!isEditing || !items) return;
    const item = items.find((i) => String(i.id) === id);
    if (!item) {
      setNotFound(true);
    } else {
      setForm({
        name: item.name,
        description: item.description || '',
        category: item.category,
        price: item.price,
        isAvailable: !!item.is_available,
        imageUrl: item.image_url || ''
      });
    }
    setLoaded(true);
  }, [isEditing, items, id]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please choose a JPG, PNG, WEBP, or GIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be 5MB or smaller');
      return;
    }

    setUploadError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api.post('/admin/menu/upload', body);
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        isAvailable: form.isAvailable,
        imageUrl: form.imageUrl
      };
      if (isEditing) {
        await api.put(`/admin/menu/${id}`, payload);
      } else {
        await api.post('/admin/menu', payload);
      }
      navigate('/admin/menu');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this item');
    } finally {
      setSaving(false);
    }
  }

  if (isEditing && listError) {
    return (
      <div className="admin-panel">
        <div className="form-msg error">{listError}</div>
      </div>
    );
  }

  if (isEditing && !loaded) {
    return (
      <div className="admin-panel">
        <p className="admin-empty">Loading...</p>
      </div>
    );
  }

  if (isEditing && notFound) {
    return (
      <div className="admin-panel">
        <p className="admin-empty">That menu item doesn't exist (maybe it was already deleted).</p>
        <Link className="btn btn-outline" to="/admin/menu">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>{isEditing ? 'Edit Dish' : 'Add a Dish'}</h3>
      </div>

      {formError && <div className="form-msg error">{formError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="field">
            <label htmlFor="menu-name">Name</label>
            <input
              id="menu-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="menu-category">Category</label>
            <select
              id="menu-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="menu-price">Price (Rs)</label>
            <input
              id="menu-price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="menu-available">Availability</label>
            <select
              id="menu-available"
              value={form.isAvailable ? 'available' : 'unavailable'}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.value === 'available' })}
            >
              <option value="available">Available</option>
              <option value="unavailable">Not Available</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="menu-image-upload">Photo</label>
          <input
            id="menu-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <p className="upload-status">Uploading...</p>}
          {uploadError && <div className="form-msg error">{uploadError}</div>}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Dish preview" className="image-preview" />
          )}
        </div>

        <div className="field">
          <label htmlFor="menu-description">Description</label>
          <textarea
            id="menu-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Dish'}
          </button>
          <Link className="btn btn-outline" to="/admin/menu">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`
        #menu-price::-webkit-outer-spin-button,
        #menu-price::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        #menu-price {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}