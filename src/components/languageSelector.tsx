'use client';

import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'ES', name: 'Español' },
];

export default function LanguageSelector() {
  return (
    <div className="flex items-center gap-1">
      <GlobeAltIcon className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(255,255,255,0.5)] md:h-3.5 md:w-3.5" />
      <select className="bg-transparent text-[10px] text-gray-500 md:text-xs border-none outline-none cursor-pointer">
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-black text-gray-300">
            {lang.code}
          </option>
        ))}
      </select>
    </div>
  );
}
