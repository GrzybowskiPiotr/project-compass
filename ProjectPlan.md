# **Plan Rozwoju Aplikacji "Kompas Projektowy"**

## **Główne Kamienie Milowe**

### **Kamień Milowy 1: Interaktywne UI (Frontend Core)**

- **Status:** ✅ **Ukończony**
- **Wynik:** W pełni interaktywny prototyp frontendu, działający na danych trzymanych w stanie (mock data), zbudowany w oparciu o custom hook `useProjectManager` i strukturę feature-based.

### **Kamień Milowy 2: Pełna Integracja z Bazą Danych (Full-Stack Core)**

- **Status:** ⏳ **W Trakcie**
- **Cel:** Dokończenie pełnej pętli CRUD z bazą danych SQLite, aby aplikacja trwale zapisywała dane.
- **Kluczowe Zadania:**
  1.  Naprawić błąd importu komponentu `<Form>` z React Router.
  2.  Zaimplementować w API endpointy `POST`, `PATCH`, `DELETE` dla zadań.
  3.  Podłączyć do nich funkcje `handle...` w hooku `useProjectManager`.
  4.  Zaimplementować UI do dodawania podzadań (z prawdziwym formularzem).

### **Kamień Milowy 3: Refaktoryzacja i Wspólne UI (Scalable Frontend)**

- **Status:** 📋 **Do Zrobienia**
- **Cel:** Uporządkowanie kodu i stworzenie fundamentu pod szybką rozbudowę UI.
- **Kluczowe Zadania:**
  - Stworzenie współdzielonej biblioteki UI w NX: `libs/shared-ui`.
  - Przeniesienie do niej generycznych komponentów (`Button`, `Input`, `Modal` etc.).
  - Zrefaktoryzowanie istniejących widoków, aby używały komponentów z `shared-ui`.

### **Kamień Milowy 4: Autentykacja i Użytkownicy (Multi-User)**

- **Status:** 📋 **Do Zrobienia**
- **Cel:** Zabezpieczenie aplikacji i wprowadzenie logiki wielu użytkowników.
- **Kluczowe Zadania:**
  - Stworzenie nowego _feature-slice_: `features/Auth` (logowanie, rejestracja).
  - Dodanie nowych tras w `routes.tsx`.
  - Rozbudowa API o endpointy do autentykacji.
  - Powiązanie wszystkich danych (projektów, zadań) z `userId`.

### **Kamień Milowy 5: Testowanie Aplikacji (Quality Assurance)**

- **Status:** 📋 **Do Zrobienia**
- **Cel:** Zapewnienie jakości i stabilności aplikacji.
- **Kluczowe Zadania:**
  - Napisanie testów komponentów (React Testing Library) dla kluczowych części UI.
  - Napisanie testów End-to-End (Playwright) dla krytycznych ścieżek użytkownika (np. logowanie, dodanie zadania).

---

A teraz, z odświeżonym i jasnym planem, wróćmy do naszego pierwszego zadania z **Kamienia Milowego 2**: naprawy błędu z importem `<Form>` z React Routera.
