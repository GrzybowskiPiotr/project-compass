### **Podsumowanie Wzorców i Sugestii UI (`SUGESTIE_UI.md`)**

Zapamiętuję te ustalenia. Oto plik, który zbiera w jednym miejscu dobre praktyki, o których rozmawialiśmy:

# **Sugestie i Dobre Praktyki UI/UX w Projekcie "Kompas Projektowy"**

Ten dokument zbiera wzorce i techniki, które zidentyfikowaliśmy jako kluczowe dla budowy nowoczesnego i dostępnego interfejsu użytkownika.

### **1. Obsługa Formularzy**

- **`onSubmit` na `<form>`, a nie `onClick` na `<button>`:** Zapewnia lepszą dostępność (obsługa klawisza Enter) i jest bardziej poprawne semantycznie.
- **Użycie Komponentu `<Form>` z React Router:** W naszej architekturze SSR, używamy komponentu `<Form>` z `react-router` zamiast natywnego tagu `<form>`, aby uniknąć domyślnego przeładowania strony.
- **`event.preventDefault()`:** Mimo użycia `<Form>`, w naszych handlerach na razie jawnie wywołujemy `preventDefault()`, aby mieć pełną kontrolę nad zdarzeniem.

### **2. Dostępność (a11y)**

- **Etykiety (`<label>`) zamiast `placeholder`:** Pola input powinny mieć powiązany `<label>`, nawet jeśli jest on wizualnie ukryty za pomocą klasy `sr-only` z Tailwind CSS. Zapewnia to, że screen readery poprawnie anonsują przeznaczenie pola.
- **Zarządzanie Fokusem:** Używamy atrybutu `autoFocus` na polach input, które pojawiają się dynamicznie (np. w trybie edycji lub w formularzu dodawania podzadania), aby ułatwić użytkownikom korzystającym z klawiatury natychmiastowe wprowadzanie danych.
- **Obsługa Klawiatury:** W formularzach implementujemy obsługę klawiszy `Enter` (wysłanie) i `Escape` (anulowanie), co jest standardem oczekiwanym przez użytkowników.

### **3. Wzorce UI**

- **"Input Group":** Stosujemy wzorzec, w którym przyciski akcji (np. "Zapisz", "Anuluj") są wizualnie "przyklejone" do pola input, tworząc spójną grupę. Osiągamy to za pomocą kontenera `flex`.
- **"Strażnicy" Stanu Ładowania (Guard Clauses):** Komponenty, które zależą od danych asynchronicznych, implementują na początku logikę warunkową (np. `if (isLoading) return ...`), aby obsłużyć stan ładowania i błędu, zanim spróbują renderować właściwy UI.
