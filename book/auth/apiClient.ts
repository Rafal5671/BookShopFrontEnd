// fetchWithAuth.ts
export async function fetchWithAuth(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    // 1) Pobieramy accessToken z localStorage
    let accessToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
    // 2) Jeśli nie ma obiektu init, tworzymy pusty
    if (!init) {
      init = {};
    }
    if (!init.headers) {
      init.headers = {};
    }
  
    // 3) Ustawiamy nagłówek Authorization (o ile mamy accessToken)
    if (accessToken) {
      (init.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  
    // 4) Wykonujemy zapytanie
    let response = await fetch(input, init);
  
    // 5) Jeśli dostaliśmy 401, próbujemy odświeżyć token
    if (response.status === 401) {
      // Proba odświeżenia (szczegóły w kolejnej sekcji)
      const refreshed = await attemptRefreshToken();
  
      if (refreshed) {
        // Jeśli się udało, pobieramy nowy accessToken i ponawiamy zapytanie
        accessToken = localStorage.getItem('authToken');
        if (accessToken) {
          (init.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
        }
        response = await fetch(input, init);
      } else {
        // Jeśli nie udało się odświeżyć – np. wyrzucamy użytkownika do /login
        // lub czyścimy localStorage z tokenami.
        // e.g.:
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // window.location.href = '/login';
      }
    }
  
    return response;
  }
// attemptRefreshToken.ts
export async function attemptRefreshToken(): Promise<boolean> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/refresh/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        // Jeśli mamy 401, 403 albo inny błąd, odświeżenie się nie powiodło
        return false;
      }
  
      // Załóżmy, że serwer zwraca newAccessToken (lub newAccessToken + newRefreshToken)
      const data = await response.json();
      // Przykład: { "accessToken": "...", "refreshToken": "..." }
  
      // Zapisujemy nowy accessToken w localStorage
      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
      }
      // Jeśli serwer zwróci też nowy refreshToken, można go zaktualizować:
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
  
      return true;
    } catch (error) {
      console.error('Błąd podczas odświeżania tokenu:', error);
      return false;
    }
  }
    