import { useState } from 'react';
import { Link } from 'react-router-dom';
import agent from '../api/agent';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function ArticlePreview({ article: initialArticle }) {
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(initialArticle);
  const [submitting, setSubmitting] = useState(false);

  const toggleFavorite = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    try {
      const res = article.favorited
        ? await agent.Articles.unfavorite(article.slug)
        : await agent.Articles.favorite(article.slug);
      setArticle(res.article);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link to={`/@${article.author.username}`}>
            <img
              src={article.author.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + article.author.username}
              alt={article.author.username}
              className="w-9 h-9 rounded-full object-cover border"
            />
          </Link>
          <div>
            <Link
              to={`/@${article.author.username}`}
              className="font-medium text-primary hover:text-primary-dark block leading-tight"
            >
              {article.author.username}
            </Link>
            <span className="text-gray-400 text-xs">{formatDate(article.createdAt)}</span>
          </div>
        </div>

        <button
          onClick={toggleFavorite}
          disabled={submitting || !currentUser}
          className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition-colors ${
            article.favorited
              ? 'bg-primary text-white border-primary hover:bg-primary-dark'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
          } disabled:opacity-50`}
        >
          ♥ {article.favoritesCount}
        </button>
      </div>

      <Link to={`/article/${article.slug}`} className="block group">
        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary mb-1 transition-colors">
          {article.title}
        </h2>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{article.description}</p>
      </Link>

      <div className="flex items-center justify-between">
        <Link to={`/article/${article.slug}`} className="text-gray-400 text-xs hover:text-gray-600">
          Read more...
        </Link>
        <div className="flex flex-wrap gap-1">
          {article.tagList.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
