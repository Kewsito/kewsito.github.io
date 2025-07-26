// Script para manejar el cambio de tema
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Función para actualizar los iconos según el tema actual
  function updateIcons(isDark) {
    if (isDark) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  }

  // Establecer el icono correcto al cargar la página
  const isDarkMode = document.documentElement.classList.contains('dark');
  updateIcons(isDarkMode);

  // Manejar el clic en el botón de cambio de tema
  themeToggle.addEventListener('click', () => {
    // Llamar a la función global toggleTheme definida en Layout.astro
    const isDark = window.toggleTheme();
    updateIcons(isDark);
  });
});