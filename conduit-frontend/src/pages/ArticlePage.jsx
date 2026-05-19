import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import agent from '../api/agent';
import { useAuth } from '../context/AuthContext';
import ErrorList from '../components/ErrorList';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function renderMarkdown(text) {
  // simple markdown: bold, italic, code, line breaks
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    .replace(/\n/g, '<br />');
}

function ArticleMeta({ article, currentUser, onDelete, onToggleFavorite, favoriting }) {
  const isAuthor = currentUser?.username === article.author.username;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link to={`/@${article.author.username}`}>
        <img
          src={article.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.username}`}
          alt={article.author.username}
          className="w-9 h-9 rounded-full object-cover border"
        />
      </Link>
      <div>
        <Link to={`/@${article.author.username}`} className="font-medium text-primary block leading-tight">
          {article.author.username}
        </Link>
        <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
      </div>

      {isAuthor ? (
        <div className="flex gap-2 ml-2">
          <Link to={`/editor/${article.slug}`} className="btn-outline-secondary text-sm py-1 px-3">
            ✏️ Edit
          </Link>
          <button onClick={onDelete} className="btn-outline-danger text-sm py-1 px-3">
            🗑 Delete
          </button>
        </div>
      ) : currentUser ? (
        <div className="flex gap-2 ml-2">
          <button
            onClick={onToggleFavorite}
            disabled={favoriting}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition-colors ${
              article.favorited
                ? 'bg-primary text-white border-primary'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            } disabled:opacity-50`}
          >
            ♥ {article.favorited ? 'Unfavorite' : 'Favorite'} ({article.favoritesCount})
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CommentSection({ slug, currentUser }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    agent.Comments.forArticle(slug).then(({ comments }) => setComments(comments));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const { comment } = await agent.Comments.create(slug, { body });
      setComments([comment, ...comments]);
      setBody('');
    } catch (err) {
      setErrors(err.response?.data?.errors || { '': ['Could not post comment.'] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await agent.Comments.delete(slug, id);
    setComments(comments.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {currentUser ? (
        <div className="border rounded-lg mb-6 overflow-hidden">
          <ErrorList errors={errors} />
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Write a comment..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 text-sm resize-none focus:outline-none"
            />
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t">
              <img
                src={currentUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
              <button type="submit" disabled={submitting} className="btn-primary text-sm py-1 px-4">
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-6">
          <Link to="/login" className="text-primary hover:underline">Sign in</Link> or{' '}
          <Link to="/register" className="text-primary hover:underline">sign up</Link> to add comments.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 text-sm text-gray-700">{comment.body}</div>
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t">
              <div className="flex items-center gap-2">
                <Link to={`/@${comment.author.username}`}>
                  <img
                    src={comment.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </Link>
                <Link to={`/@${comment.author.username}`} className="text-primary text-xs font-medium">
                  {comment.author.username}
                </Link>
                <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
              </div>
              {currentUser?.username === comment.author.username && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    agent.Articles.get(slug)
      .then(({ article }) => setArticle(article))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this article?')) return;
    await agent.Articles.del(slug);
    navigate('/');
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) return;
    setFavoriting(true);
    try {
      const res = article.favorited
        ? await agent.Articles.unfavorite(article.slug)
        : await agent.Articles.favorite(article.slug);
      setArticle(res.article);
    } finally {
      setFavoriting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!article) return <div className="text-center py-20 text-red-500">Article not found.</div>;

  return (
    <div>
      {/* Article header */}
      <div className="bg-gray-800 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
          <ArticleMeta
            article={article}
            currentUser={currentUser}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            favoriting={favoriting}
          />
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="prose max-w-none text-gray-700 leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
        />

        <div className="flex flex-wrap gap-1 mb-8">
          {article.tagList.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>

        <hr />

        {/* Meta again below body */}
        <div className="flex justify-center py-6">
          <ArticleMeta
            article={article}
            currentUser={currentUser}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            favoriting={favoriting}
          />
        </div>

        <hr />

        <CommentSection slug={slug} currentUser={currentUser} />
      </div>
    </div>
  );
}
