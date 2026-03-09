import { useState } from 'react';

export default function LightDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
                isDarkMode
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
            }`}
        >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
    );
}