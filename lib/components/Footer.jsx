export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-300 bg-gray-50 py-4">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          Built by{" "}
          <a
            href="https://github.com/HarshDev1809"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:underline"
          >
            Harsh Dev
          </a>
          {" "} • {" "}
          <a
          
            href="https://www.linkedin.com/in/harshdev1809/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
          {" "} • {" "}
          <a
            href="https://github.com/HarshDev1809/Pastebin-Lite"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Source Code
          </a>
        </p>
      </div>
    </footer>
  );
}