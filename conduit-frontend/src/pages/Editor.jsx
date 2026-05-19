import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../api/agent';
import ErrorList from '../components/ErrorList';

export default function Editor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', body: '', tagList: [] });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      agent.Articles.get(slug).then(({ article }) => {
        setForm({
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        });
      });
    }
  }, [slug]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!form.tagList.includes(tag)) {
        setForm({ ...form, tagList: [...form.tagList, tag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tagList: form.tagList.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = slug
        ? await agent.Articles.update(slug, form)
        : await agent.Articles.create(form);
      navigate(`/article/${res.article.slug}`);
    } catch (err) {
      setErrors(err.response?.data?.errors || { '': ['Could not save article.'] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ErrorList errors={errors} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Article Title"
          value={form.title}
          onChange={handleChange}
          required
          className="input-field text-xl"
        />
        <input
          name="description"
          type="text"
          placeholder="What's this article about?"
          value={form.description}
          onChange={handleChange}
          required
          className="input-field"
        />
        <textarea
          name="body"
          placeholder="Write your article (Markdown supported)"
          value={form.body}
          onChange={handleChange}
          required
          rows={12}
          className="input-field resize-none font-mono text-sm"
        />

        {/* Tags */}
        <div>
          <input
            type="text"
            placeholder="Enter tags (press Enter or comma to add)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="input-field"
          />
          {form.tagList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.tagList.map((tag) => (
                <span key={tag} className="tag-pill-primary flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-white hover:text-red-200 font-bold leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 text-base">
            {submitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
