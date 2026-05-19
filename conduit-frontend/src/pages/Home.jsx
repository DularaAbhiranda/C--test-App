import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import agent from '../api/agent';
import { useAuth } from '../context/AuthContext';
import ArticlePreview from '../components/ArticlePreview';
import Pagination from '../components/Pagination';

export default function Home() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(currentUser ? 'feed' : 'global');
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Tags.getAll().then(({ tags }) => setTags(tags));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch =
      tab === 'feed'
        ? agent.Articles.feed(page)
        : agent.Articles.all(page, 10, selectedTag || undefined);

    fetch
      .then(({ articles, articlesCount }) => {
        setArticles(articles);
        setArticlesCount(articlesCount);
      })
      .finally(() => setLoading(false));
  }, [tab, page, selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setTab('tag');
    setPage(0);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSelectedTag(null);
    setPage(0);
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-primary text-white text-center py-12 shadow-inner">
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          conduit
        </h1>
        <p className="text-xl opacity-90">A place to share your knowledge.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {currentUser && (
              <button
                onClick={() => handleTabChange('feed')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === 'feed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Your Feed
              </button>
            )}
            <button
              onClick={() => handleTabChange('global')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === 'global'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Global Feed
            </button>
            {selectedTag && (
              <button
                className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary -mb-px"
              >
                # {selectedTag}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-gray-400 py-8 text-center">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="text-gray-400 py-8 text-center">
              {tab === 'feed'
                ? 'No articles yet. Follow some authors!'
                : 'No articles found.'}
            </div>
          ) : (
            <>
              {articles.map((article) => (
                <ArticlePreview key={article.slug} article={article} />
              ))}
              <Pagination
                page={page}
                count={articlesCount}
                onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Popular Tags</h4>
            {tags.length === 0 ? (
              <p className="text-gray-400 text-xs">Loading tags...</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 20).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`tag-pill cursor-pointer hover:bg-gray-400 hover:text-white transition-colors ${
                      selectedTag === tag ? 'bg-primary text-white' : ''
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
