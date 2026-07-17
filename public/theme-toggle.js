// Función para establecer el tema según la preferencia del usuario
			function setTheme() {
				// Verificar si hay un tema guardado en localStorage
				const savedTheme = localStorage.getItem('theme');
				
				// Si hay un tema guardado, usarlo
				if (savedTheme) {
					document.documentElement.classList.toggle('dark', savedTheme === 'dark');
				} else {
					// Si no hay tema guardado, usar la preferencia del sistema
					const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					document.documentElement.classList.toggle('dark', prefersDark);
					localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
				}
			}

			// Ejecutar al cargar la página
			setTheme();

			// Función para cambiar el tema
			window.toggleTheme = function() {
				const isDark = document.documentElement.classList.toggle('dark');
				localStorage.setItem('theme', isDark ? 'dark' : 'light');
				return isDark;
			}