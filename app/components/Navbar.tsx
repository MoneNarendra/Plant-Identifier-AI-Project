const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="font-bold text-xl text-green-800">PlantID</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              About
            </a>
            <a
              href="/features"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Features
            </a>
            <a
              href="/blog"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
