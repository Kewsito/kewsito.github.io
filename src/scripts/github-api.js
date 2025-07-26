// github-api.js
// Funciones para interactuar con la API de GitHub

// Cache simple para evitar múltiples llamadas
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Token de GitHub opcional (configurable desde variables de entorno)
let GITHUB_TOKEN;
if (typeof window !== 'undefined' && window?.import?.meta?.env?.PUBLIC_GITHUB_TOKEN) {
  GITHUB_TOKEN = import.meta.env.PUBLIC_GITHUB_TOKEN;
}

/**
 * Obtiene los headers para las peticiones a GitHub API
 */
function getGitHubHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App'
  };
  
  // Agregar token si está disponible para aumentar rate limits
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  return headers;
}

/**
 * Verifica si los datos en caché son válidos
 */
function isCacheValid(cacheEntry) {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
}

/**
 * Obtiene los repositorios públicos de un usuario de GitHub
 * @param {string} username - Nombre de usuario de GitHub
 * @param {number} perPage - Número de repositorios por página (máximo 100)
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getGitHubRepositories(username, perPage = 30) {
  // Verificar caché primero
  const cacheKey = `repos_${username}_${perPage}`;
  const cachedData = cache.get(cacheKey);
  
  if (isCacheValid(cachedData)) {
    return {
      success: true,
      data: cachedData.data
    };
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=${perPage}`,
      {
        headers: getGitHubHeaders()
      }
    );

    if (!response.ok) {
      // Manejo específico para rate limiting
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
        const waitTime = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60) : 'desconocido';
        
        throw new Error(`Rate limit excedido. Intenta nuevamente en ${waitTime} minutos. Considera agregar un token de GitHub para aumentar los límites.`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repositories = await response.json();
    
    // Filtrar solo repositorios públicos y mapear a formato consistente
    const publicRepos = repositories
      .filter(repo => !repo.private && !repo.fork) // Solo repos públicos y no forks
      .map(repo => ({
        id: repo.id,
        title: repo.name,
        description: repo.description || 'Sin descripción disponible',
        short_description: repo.description ? 
          (repo.description.length > 100 ? 
            repo.description.substring(0, 100) + '...' : 
            repo.description
          ) : 'Sin descripción disponible',
        github_url: repo.html_url,
        demo_url: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || []
      }));

    // Guardar en caché
    cache.set(cacheKey, {
      data: publicRepos,
      timestamp: Date.now()
    });

    return {
      success: true,
      data: publicRepos
    };
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtiene información detallada de un repositorio específico
 * @param {string} username - Nombre de usuario de GitHub
 * @param {string} repoName - Nombre del repositorio
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function getGitHubRepository(username, repoName) {
  // Verificar caché primero
  const cacheKey = `repo_${username}_${repoName}`;
  const cachedData = cache.get(cacheKey);
  
  if (isCacheValid(cachedData)) {
    return {
      success: true,
      data: cachedData.data
    };
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}`,
      {
        headers: getGitHubHeaders()
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
        const waitTime = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60) : 'desconocido';
        
        throw new Error(`Rate limit excedido. Intenta nuevamente en ${waitTime} minutos.`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repo = await response.json();
    
    const repoData = {
      id: repo.id,
      title: repo.name,
      description: repo.description || 'Sin descripción disponible',
      short_description: repo.description ? 
        (repo.description.length > 100 ? 
          repo.description.substring(0, 100) + '...' : 
          repo.description
        ) : 'Sin descripción disponible',
      github_url: repo.html_url,
      demo_url: repo.homepage || null,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics || []
    };

    // Guardar en caché
    cache.set(cacheKey, {
      data: repoData,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      data: repoData
    };
  } catch (error) {
    console.error('Error fetching GitHub repository:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtiene los lenguajes utilizados en un repositorio
 * @param {string} username - Nombre de usuario de GitHub
 * @param {string} repoName - Nombre del repositorio
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function getRepositoryLanguages(username, repoName) {
  // Verificar caché primero
  const cacheKey = `languages_${username}_${repoName}`;
  const cachedData = cache.get(cacheKey);
  
  if (isCacheValid(cachedData)) {
    return {
      success: true,
      data: cachedData.data
    };
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      {
        headers: getGitHubHeaders()
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
        const waitTime = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60) : 'desconocido';
        
        throw new Error(`Rate limit excedido. Intenta nuevamente en ${waitTime} minutos.`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const languages = await response.json();
    
    // Guardar en caché
    cache.set(cacheKey, {
      data: languages,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      data: languages
    };
  } catch (error) {
    console.error('Error fetching repository languages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}