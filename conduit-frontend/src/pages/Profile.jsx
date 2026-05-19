import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import agent from '../api/agent';
import { useAuth } from '../context/AuthContext';
import ArticlePreview from '../components/ArticlePreview';
import Pagination from '../components/Pagination';

export default function Profile() {
  const { username } = useParams();
  const profileUsername = username.startsWith('@') ? username.slice(1) : username;
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [tab, setTab] = useState('authored');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    agent.Profile.get(profileUsername).then(({ profile }) => {
      setProfile(profile);
    });
  }, [profileUsername]);

  useEffect(() => {
    setLoading(true);
    const params =
      tab === 'authored'
        ? { author: profileUsername }
        : { favorited: profileUsername };
    agent.Articles.all(page, 10, undefined, params.author, params.favorited)
      .then(({ articles, articlesCount }) => {
        setArticles(articles);
        setArticlesCount(articlesCount);
      })
      .finally(() => setLoading(false));
  }, [profileUsername, tab, page]);

  const handleFollow = async () => {
    if (!currentUser) return;
    setFollowing(true);
    try {
      const res = profile.following
        ? await agent.Profile.unfollow(profileUsername)
        : await agent.Profile.follow(profileUsername);
      setProfile(res.profile);
    } finally {
      setFollowing(false);
    }
  };

  const isCurrentUser = currentUser?.username === profileUsername;

  if (!profile) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      {/* Profile header */}
      <div className="bg-gray-100 py-10 text-center border-b">
        <img
          src={profile.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
          alt={profile.username}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow"
        />
        <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>
        {profile.bio && <p className="text-gray-500 mt-2 max-w-md mx-auto">{profile.bio}</p>}

        <div className="mt-4">
          {isCurrentUser ? (
            <Link to="/settings" className="btn-outline-secondary text-sm">
              ⚙️ Edit Profile Settings
            </Link>
          ) : currentUser ? (
            <button
              onClick={handleFollow}
              disabled={following}
              className={`text-sm px-4 py-2 rounded border transition-colors ${
                profile.following
                  ? 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600'
                  : 'border-gray-400 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {profile.following ? '✓ Unfollow' : '+ Follow'} {profile.username}
            </button>
          ) : null}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => { setTab('authored'); setPage(0); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'authored'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Articles
          </button>
          <button
            onClick={() => { setTab('favorited'); setPage(0); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'favorited'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Favorited Articles
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No articles here yet.</div>
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
    </div>
  );
}
