Plan Działania UI/UX - Krok 1: Wstępna Implementacja Ciemnego Motywu i Brandingu (na podstawie Image 1)
Cel: Przeprojektowanie interfejsu aplikacji, aby przyjął ciemny motyw i estetykę zbliżoną do "Image 1", koncentrując się na globalnym stylu, kontenerach i podstawowych komponentach.

Kluczowe obszary do modyfikacji:

Globalny Styl (Tło, Tekst, Fonty): Ustanowienie ciemnego tła i jasnego tekstu jako domyślnego.

Nagłówek (Header): Przebudowa górnego paska nawigacji na ciemny i minimalistyczny.

Główne Kontenery/Karty: Zastosowanie zaokrąglonych, lekko uniesionych kontenerów dla sekcji (np. lista projektów, szczegóły projektu, zadania).

Komponenty Formularzy: Dostosowanie Input, TextArea, Button do nowego motywu.

Nawigacja Boczna: Przygotowanie miejsca lub wstępna implementacja struktury nawigacji bocznej.

Szczegóły Implementacji Krok 1:

1. Globalny Styl (apps/frontend/src/index.css lub apps/frontend/src/App.css / pliki Tailwind CSS):

Cel: Zmiana domyślnego tła aplikacji na ciemnoszare i domyślnego koloru tekstu na jasny. Wprowadzenie globalnego fontu, jeśli wymagane.

Akcja:

W pliku CSS używanym globalnie (np. index.css lub główny plik Tailwind CSS), zdefiniuj niestandardowe właściwości CSS (CSS variables) dla kolorów, lub bezpośrednio użyj klas Tailwind CSS na elemencie body lub głównym kontenerze.

Dostosowanie tailwind.config.js:

Zdefiniuj niestandardowe kolory, które będą używane w aplikacji. Inspirując się "Image 1", potrzebujemy ciemnego tła, jaśniejszego tła dla kontenerów i akcentu.

JavaScript

// apps/frontend/tailwind.config.js
module.exports = {
content: [
'./index.html',
'./src/**/*.{js,ts,jsx,tsx}',
'../../libs/**/*.{js,ts,jsx,tsx}', // Ważne dla komponentów z shared-ui
],
theme: {
extend: {
colors: {
// Kolory tła
'dark-bg': '#1e1e2d', // Bardzo ciemne tło (główne)
'dark-card': '#27293d', // Tło dla kart/kontenerów (nieco jaśniejsze niż dark-bg)
'dark-accent': '#007bff', // Kolor akcentu (np. dla przycisków, progress barów)
'dark-border': '#3a3d54', // Kolor dla delikatnych linii, separatorów

        // Kolory tekstu
        'light-text': '#e0e0e0',    // Jasny tekst dla ciemnego tła
        'muted-text': '#a0a0a0',    // Przytłumiony tekst
        'white-text': '#ffffff',    // Czysto biały tekst
      },
      boxShadow: {
        'custom-light': '0px 4px 10px rgba(0, 0, 0, 0.25)', // Subtelny cień dla kart
      },
      borderRadius: {
        'lg-md': '10px', // Niestandardowy promień zaokrąglenia
      }
    },

},
plugins: [],
};
Zastosowanie globalnych stylów:

W pliku App.tsx lub głównym komponencie, otocz całą aplikację div-em z klasami Tailwind:

TypeScript

// apps/frontend/src/App.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header'; // Zostanie zmodyfikowany
import { SideNavigation } from './components/SideNavigation'; // Nowy komponent

function App() {
return (
<div className="min-h-screen bg-dark-bg text-light-text font-sans">
<Header />
<div className="flex">
<SideNavigation /> {/_ Tu będzie nowa nawigacja _/}
<main className="flex-1 p-6"> {/_ Główna zawartość _/}
<Outlet />
</main>
</div>
</div>
);
}
export default App;
Upewnij się, że masz zaimportowane index.css lub App.css zawierające @tailwind base; @tailwind components; @tailwind utilities;.

2. Nagłówek (Header) (apps/frontend/src/components/Header.tsx):

Cel: Przebudowanie nagłówka, aby pasował do minimalistycznego, ciemnego stylu "Image 1".

Akcja:

Struktura: Zmień obecny nagłówek na ciemny pasek. Usuń przycisk "Projekty", jeśli będziesz miał nawigację boczną. Zachowaj sekcję "Witaj, [Nazwa Użytkownika]" i "Wyloguj".

Styl: Zastosuj bg-dark-card (lub podobny), text-white-text, shadow-lg, p-4 (padding), flex, justify-between, items-center. Dodaj logo "Project Compass" (na razie tekstowe).

Przykładowy kod:

TypeScript

// apps/frontend/src/components/Header.tsx
import { Link } from 'react-router-dom';
import { Button } from '@project-compass/shared-ui'; // Twój Button z shared-ui

export function Header() {
// Tutaj logika dla użytkownika, wylogowania itp.
const userName = 'Jan Test Kowalski'; // Tymczasowe

return (
<header className="bg-dark-card text-white-text p-4 shadow-custom-light flex justify-between items-center z-10">
<div className="flex items-center">
{/_ Logo/Nazwa aplikacji _/}
<Link to="/" className="text-2xl font-bold text-white-text mr-6">
Project Compass
</Link>
{/_ Tutaj potencjalnie ikona do otwierania/zamykania sidebaru na mobile _/}
</div>
<div className="flex items-center space-x-4">
<span className="text-sm">Witaj, {userName}</span>
<Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white-text px-4 py-2 rounded-lg-md">
Wyloguj
</Button>
</div>
</header>
);
} 3. Główne Kontenery/Karty (np. dla listy projektów, szczegółów projektu, zadań):

Cel: Zastosowanie spójnego, zaokrąglonego stylu "karty" dla głównych sekcji UI.

Akcja:

Komponent ProjectCard.tsx (dla listy projektów):

Zmodyfikuj ProjectCard.tsx (lub ProjectItem jeśli tak się nazywa) w features/Projects/ProjectsList/ aby używał bg-dark-card, rounded-lg-md, shadow-custom-light, p-6 i text-light-text.

Dostosuj przyciski wewnątrz do nowego stylu (np. Button z variant="primary").

TypeScript

// apps/frontend/src/features/Projects/ProjectsList/ProjectCard.tsx (Przykładowa modyfikacja)
import { Button } from '@project-compass/shared-ui';
import { Link } from 'react-router-dom';

// ... props dla ProjectCard
export function ProjectCard({ project, onOpenProject }) { // Założenie, że masz takie propsy
return (
<div className="bg-dark-card rounded-lg-md shadow-custom-light p-6 text-light-text flex flex-col justify-between h-full">
<div>
<h3 className="text-xl font-semibold mb-2">{project.name}</h3>
<p className="text-muted-text text-sm mb-4">{project.description || 'Brak opisu projektu.'}</p>
<p className="text-xs text-muted-text">Utworzono: {new Date(project.createdAt).toLocaleDateString()}</p>
</div>
<div className="mt-4">
<Button
onClick={() => onOpenProject(project.id)} // Przykład użycia onClick
className="w-full bg-dark-accent hover:bg-blue-700 text-white-text px-4 py-2 rounded-lg-md" >
Otwórz projekt
</Button>
</div>
</div>
);
}
Główny kontener ProjectDetailsPage.tsx:

Zastosuj te same klasy (bg-dark-card, rounded-lg-md, shadow-custom-light, p-6) do głównego kontenera na stronie szczegółów projektu. To samo dla sekcji zadań.

4. Komponenty Formularzy (shared-ui/Button.tsx, shared-ui/Input.tsx, shared-ui/TextArea.tsx):

Cel: Globalne dostosowanie stylów komponentów shared-ui tak, aby pasowały do ciemnego motywu.

Akcja:

shared-ui/Button.tsx:

Zmodyfikuj domyślne style przycisków. Wprowadź primary i secondary warianty kolorystyczne zgodne z paletą "Image 1" (np. primary: bg-dark-accent, secondary: bg-dark-border lub bg-gray-600).

Dodaj rounded-lg-md dla zaokrąglonych rogów.

TypeScript

// libs/shared-ui/src/lib/Button/Button.tsx (Przykładowa modyfikacja)
import React from 'react';
import clsx from 'clsx'; // Możesz użyć clsx do łączenia klas

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
variant?: 'primary' | 'secondary' | 'danger';
size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
children,
className,
variant = 'primary',
size = 'md',
...props
}) => {
const baseStyles = 'font-semibold rounded-lg-md transition duration-200 ease-in-out';

const variantStyles = {
primary: 'bg-dark-accent text-white-text hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
secondary: 'bg-dark-border text-light-text hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50',
danger: 'bg-red-600 text-white-text hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
};

const sizeStyles = {
sm: 'px-3 py-1 text-sm',
md: 'px-4 py-2 text-base',
lg: 'px-6 py-3 text-lg',
};

return (
<button
className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
{...props} >
{children}
</button>
);
};
shared-ui/Input.tsx i shared-ui/TextArea.tsx:

Ustaw ich tło na jasne (bg-white), tekst na ciemny (text-dark-bg lub text-gray-800), dodaj delikatną ramkę (border border-dark-border) i zaokrąglij rogi (rounded-lg-md).

TypeScript

// libs/shared-ui/src/lib/Input/Input.tsx (Przykładowa modyfikacja)
import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
return (
<input
className={clsx(
'block w-full px-4 py-2 bg-white text-gray-800 border border-dark-border rounded-lg-md focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent',
className
)}
{...props}
/>
);
};
Podobnie dla TextArea.tsx.

5. Nawigacja Boczna (apps/frontend/src/components/SideNavigation.tsx - Nowy Komponent):

Cel: Wstępne stworzenie struktury dla nawigacji bocznej. Na razie będzie to tylko statyczny pasek.

Akcja:

Utwórz nowy plik: apps/frontend/src/components/SideNavigation.tsx.

Struktura:

Boczny pasek (nav) z ciemnym tłem (bg-dark-card), podobny do nagłówka.

Lista linków nawigacyjnych (np. "Projects", "Tasks") z ikonami (możesz użyć prostych SVG lub tekstowych symboli na początek).

Styl linków tak, aby po najechaniu lub byciu aktywnym zmieniały tło (hover:bg-dark-border, font-semibold).

Przykładowy kod:

TypeScript

// apps/frontend/src/components/SideNavigation.tsx
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
to: string;
icon: React.ReactNode;
label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
const location = useLocation();
const isActive = location.pathname === to;

return (
<Link
to={to}
className={clsx(
'flex items-center space-x-3 p-3 rounded-lg-md transition-colors duration-200',
isActive ? 'bg-dark-accent text-white-text' : 'text-light-text hover:bg-dark-border'
)} >
{icon}
<span className="font-medium">{label}</span>
</Link>
);
};

export function SideNavigation() {
return (
<nav className="w-64 bg-dark-card p-4 h-[calc(100vh-64px)] shadow-custom-light"> {/_ wysokość na 100vh minus wysokość headera _/}
<ul className="space-y-2">
<li>
<NavItem to="/projects" icon={<span className="text-xl">📊</span>} label="Projekty" />
</li>
<li>
<NavItem to="/tasks" icon={<span className="text-xl">✅</span>} label="Zadania" />
</li>
{/_ Dodaj więcej linków w przyszłości _/}
</ul>
</nav>
);
}
Zintegruj SideNavigation w App.tsx (jak pokazano w punkcie 1).

Podczas implementacji:

Regularnie kompiluj i sprawdzaj wygląd.

Skup się na używaniu klas Tailwind CSS.

Pamiętaj o clsx do łączenia klas warunkowych.

Możesz na bieżąco dostosowywać wartości kolorów i cieni w tailwind.config.js, aby najlepiej oddać estetykę "Image 1".

Zacznijmy od tych kroków. Po ich wykonaniu aplikacja powinna już wyglądać znacznie bliżej zamierzonego ciemnego motywu. Daj znać, jak posuwają się prace, a potem przejdziemy do Theme Switch.
