import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center gap-2 text-sm">
        <Link to="/" className="text-primary font-bold">
          conduit
        </Link>
        <span className="text-gray-400">An interactive learning project from</span>
        <a href="https://thinkster.io" className="text-primary hover:underline">
          Thinkster
        </a>
        <span className="text-gray-400">. Code licensed under MIT.</span>
      </div>
    </footer>
  );
}
