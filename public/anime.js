import { animate } from 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/modules/index.js';

console.log("Procesando animacion");
			
// 1. El objetivo ('#img-perfil') va como PRIMER argumento.

// 2. Las opciones van en un objeto como SEGUNDO argumento.
			animate('#img-perfil', {
					x: '10cqw',
					duration: 1300,
					ease: 'inOutElastic(1.7)'
					});