import axios from 'axios';

const API_ROOT = 'http://localhost:5000';

const instance = axios.create({ baseURL: API_ROOT });

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt');
  if (token) config.headers['Authorization'] = `Token ${token}`;
  return config;
});

const responseBody = (res) => res.data;

const requests = {
  get: (url, params) => instance.get(url, { params }).then(responseBody),
  post: (url, body) => instance.post(url, body).then(responseBody),
  put: (url, body) => instance.put(url, body).then(responseBody),
  del: (url) => instance.delete(url).then(responseBody),
};

const Auth = {
  current: () => requests.get('/user'),
  login: (email, password) => requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: (user) => requests.put('/user', { user }),
};

const Articles = {
  all: (page = 0, limit = 10, tag, author, favorited) =>
    requests.get('/articles', { limit, offset: page * limit, tag, author, favorited }),
  feed: (page = 0, limit = 10) =>
    requests.get('/articles/feed', { limit, offset: page * limit }),
  get: (slug) => requests.get(`/articles/${slug}`),
  create: (article) => requests.post('/articles', { article }),
  update: (slug, article) => requests.put(`/articles/${slug}`, { article }),
  del: (slug) => requests.del(`/articles/${slug}`),
  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
  unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),
};

const Comments = {
  forArticle: (slug) => requests.get(`/articles/${slug}/comments`),
  create: (slug, comment) => requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, id) => requests.del(`/articles/${slug}/comments/${id}`),
};

const Profile = {
  get: (username) => requests.get(`/profiles/${username}`),
  follow: (username) => requests.post(`/profiles/${username}/follow`),
  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

const Tags = {
  getAll: () => requests.get('/tags'),
};

export default { Auth, Articles, Comments, Profile, Tags };
