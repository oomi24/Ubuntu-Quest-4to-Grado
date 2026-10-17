import { PreguntaEjercicio } from '../types/database';

export const EJERCICIOS_BANCO: Record<string, PreguntaEjercicio[]> = {
  lectura: [
    {
      id: 1,
      materia: 'lectura',
      texto_base: 'En el bosque nublado de Rancho Grande, un pequeño colibrí llevaba gotitas de agua en su pico para calmar la sed de los pichones de turpial. Aunque sus alas eran diminutas, no descansó hasta que todos estuvieron a salvo.',
      pregunta: '¿Por qué el pequeño colibrí volaba una y otra vez sin detenerse?',
      opciones: [
        'Para presumir la rapidez de sus alas',
        'Para ayudar a los pichones con agua y protegerlos',
        'Porque estaba buscando flores de colores',
        'Para escapar de una tormenta fuerte'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El colibrí demostró solidaridad: ningún esfuerzo es pequeño cuando se hace por el bienestar del grupo.',
      tipo: 'literal'
    },
    {
      id: 2,
      materia: 'lectura',
      texto_base: 'El árbol de Araguaney floreció de repente vistiendo la colina de un radiante amarillo oro. Los pájaros de distintas especies llegaron al mismo tiempo a compartir su sombra y sus néctares en armonía.',
      pregunta: '¿Qué simboliza que aves de distintas especies compartan el árbol?',
      opciones: [
        'Que están peleando por el mejor lugar',
        'Que la naturaleza florece cuando todos conviven en paz',
        'Que se acerca un invierno helado',
        'Que el árbol pronto perderá todas sus ramas'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La diversidad enriquece a la comunidad. Cuando compartimos los dones naturales, todos prosperamos.',
      tipo: 'inferencial'
    },
    {
      id: 3,
      materia: 'lectura',
      texto_base: 'Noticia escolar: "Los estudiantes de 4to grado organizaron una jornada de recolección de semillas criollas para reforestar el patio de la escuela. Cada niño trajo una semilla de su jardín familiar."',
      pregunta: '¿Cuál fue la iniciativa principal descrita en la noticia?',
      opciones: [
        'Vender plantas en el mercado municipal',
        'Sembrar juntos para darle vida y verde a su escuela',
        'Hacer una competencia del árbol más alto',
        'Pintar un mural en la pared del patio'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Cada granito o semilla suma. Cuando sumamos lo que tenemos en casa, creamos un bosque para todos.',
      tipo: 'literal'
    },
    {
      id: 4,
      materia: 'lectura',
      texto_base: 'El chigüire Tilo notó que las tortuguitas no podían cruzar la orilla fangosa del río Orinoco. Se agachó en el agua para que ellas caminaran sobre su lomo como si fuera un puente viviente.',
      pregunta: '¿Qué rasgo de carácter demuestra la acción de Tilo?',
      opciones: [
        'Egoísmo y pereza',
        'Empatía y generosidad hacia los más pequeños',
        'Distracción por estar nadando',
        'Miedo a la corriente del río'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Ubuntu es tender un puente con nuestras propias fuerzas para que los demás puedan cruzar seguros.',
      tipo: 'inferencial'
    },
    {
      id: 5,
      materia: 'lectura',
      texto_base: 'En la Gran Sabana, los abuelos pemones cuentan que los tepuyes son casas sagradas de la naturaleza. Antes de caminar por sus senderos, los viajeros piden permiso al viento y no dejan basura.',
      pregunta: 'De acuerdo con el texto, ¿cómo cuidan los senderos sagrados?',
      opciones: [
        'Encendiendo fogatas en la cumbre',
        'Pidiendo permiso al viento y llevándose sus residuos',
        'Arrancando las orquídeas del camino',
        'Haciendo ruidos fuertes para ahuyentar animales'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El respeto por la Madre Tierra es el primer compromiso de una comunidad consciente.',
      tipo: 'literal'
    },
    {
      id: 6,
      materia: 'lectura',
      texto_base: 'Simón Rodríguez decía: "O inventamos o erramos". Quería que las escuelas enseñaran a todos los niños sin distinción: a leer, a cultivar la tierra y a convivir como hermanos.',
      pregunta: '¿Qué buscaba Simón Rodríguez con su visión educativa?',
      opciones: [
        'Que solo los más ricos pudieran estudiar',
        'Una educación inclusiva que formara ciudadanos solidarios y creativos',
        'Cerrar las escuelas para trabajar en talleres',
        'Memorizar libros antiguos sin hacer preguntas'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La educación es el tesoro más grande cuando llega a cada rincón del pueblo.',
      tipo: 'inferencial'
    },
    {
      id: 7,
      materia: 'lectura',
      texto_base: 'El Relámpago del Catatumbo ilumina el cielo del Zulia sin hacer truenos ruidosos. Los navegantes de la noche usan su resplandor natural como un faro fiel que los guía de regreso a casa.',
      pregunta: '¿Para qué sirve el resplandor nocturno del Catatumbo a los pescadores?',
      opciones: [
        'Para asustar a los peces de la bahía',
        'Como guía y faro natural para navegar con seguridad',
        'Para cocinar en sus canoas',
        'Para recargar linternas eléctricas'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Como el faro del Catatumbo, un buen compañero siempre orienta a los demás con luz y paciencia.',
      tipo: 'literal'
    },
    {
      id: 8,
      materia: 'lectura',
      texto_base: 'Mateo tenía lápices de colores pero le faltaba la regla; Sofía tenía dos reglas pero ningún lápiz. Al conversar, unieron sus cartucheras en el centro de la mesa y ambos terminaron su mapa a tiempo.',
      pregunta: '¿Qué lección se deduce de lo que hicieron Mateo y Sofía?',
      opciones: [
        'Que es mejor trabajar solo para no prestar nada',
        'Que al compartir recursos, el éxito es de todos',
        'Que los mapas son muy difíciles de pintar',
        'Que debían comprar más materiales escolares'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La cooperación convierte la escasez individual en abundancia colectiva.',
      tipo: 'inferencial'
    },
    {
      id: 9,
      materia: 'lectura',
      texto_base: 'La orquídea Flor de Mayo no crece enterrada en el barro ni daña a los árboles donde se apoya. Vive sobre ellos buscando la brisa fresca, regalando su perfume a toda la selva.',
      pregunta: '¿Cómo convive la flor de mayo con los árboles del bosque?',
      opciones: [
        'Seca las ramas de los árboles con sus raíces',
        'Se posa con suavidad sin lastimarlos y comparte su belleza',
        'Come las hojas de los robles vecinos',
        'Cubre el sol para que nadie más crezca'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Convivir es estar juntos sin dañarnos, sumando belleza y armonía al entorno.',
      tipo: 'literal'
    },
    {
      id: 10,
      materia: 'lectura',
      texto_base: 'Durante el ensayo del baile de tambores, Ricardo tropezó con el ritmo. En vez de reírse, sus compañeros detuvieron la música, le aplaudieron despacio marcando el compás y bailaron de nuevo juntos.',
      pregunta: '¿Por qué los compañeros marcaron el compás con calma?',
      opciones: [
        'Para sacarlo del grupo de baile',
        'Para apoyarlo y ayudarlo a sentirse seguro con el ritmo',
        'Porque se cansaron de bailar tambor',
        'Para burlarse de su equivocación'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'En Ubuntu no dejamos a nadie atrás: si uno tropieza, el grupo acompasa el paso.',
      tipo: 'inferencial'
    },
    {
      id: 11,
      materia: 'lectura',
      texto_base: 'El cacao de Chuao se fermenta en grandes cajones de madera dulce y se seca al sol en el patio comunal de la iglesia. Todas las familias del pueblo vigilan que ninguna gota de lluvia moje los granos.',
      pregunta: '¿Quiénes cuidan los granos de cacao mientras se secan al sol?',
      opciones: [
        'Un solo vigilante con linterna',
        'Todas las familias de la comunidad unidas',
        'Los turistas que visitan la playa',
        'Las aves marinas que vuelan cerca'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El trabajo comunitario protege y enaltece el fruto del esfuerzo compartido.',
      tipo: 'literal'
    },
    {
      id: 12,
      materia: 'lectura',
      texto_base: 'La vieja tortuga Arrau nada miles de kilómetros para volver a poner sus huevos en el mismo banco de arena del río. Los niños guardianes protegen los nidos para que las crías lleguen al agua vivas.',
      pregunta: '¿Qué pasaría si los niños guardianes no cuidaran los nidos de tortuga?',
      opciones: [
        'Nacerían más tortuguitas que antes',
        'Las tortuguitas estarían en peligro y la especie podría desaparecer',
        'El río se secaría por completo',
        'Las tortugas cambiarían de caparazón'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Cuidar la vida vulnerable es una responsabilidad ética de toda la comunidad.',
      tipo: 'inferencial'
    },
    {
      id: 13,
      materia: 'lectura',
      texto_base: 'En la cordillera de Mérida, los agricultores construyen "poyos" o terrazas de piedra en las laderas. Así el agua de lluvia no arrastra la tierra fértil y pueden cultivar ricas papas y zanahorias.',
      pregunta: '¿Cuál es la función principal de las terrazas de piedra en la montaña?',
      opciones: [
        'Hacer murallas contra animales salvajes',
        'Evitar que la lluvia se lleve la tierra fértil de los cultivos',
        'Adornar las carreteras turísticas',
        'Servir de casas para los campesinos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La sabiduría ancestral cuida la tierra para que alimente a muchas generaciones.',
      tipo: 'literal'
    },
    {
      id: 14,
      materia: 'lectura',
      texto_base: 'Un viejo proverbio africano dice: "Si quieres ir rápido, camina solo; si quieres llegar lejos, camina acompañado". En el aula de 4to grado, decidieron hacer el gran proyecto de ciencias en grupos cooperativos.',
      pregunta: '¿Cuál es el significado profundo del proverbio en la vida diaria?',
      opciones: [
        'Caminar solo siempre es más veloz y mejor',
        'Juntos podemos superar dificultades mayores y alcanzar metas duraderas',
        'No debemos salir nunca de viaje en grupo',
        'Los proyectos de ciencias son aburridos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Caminar juntos nos da resistencia, apoyo mutuo y alegría compartida.',
      tipo: 'inferencial'
    },
    {
      id: 15,
      materia: 'lectura',
      texto_base: 'El oso frontino es el único oso que habita en Sudamérica. Es tímido, come frutos silvestres y dispersa semillas por los valles andinos ayudando a que nazcan nuevos árboles sin que nadie lo note.',
      pregunta: '¿De qué manera silenciosa ayuda el oso frontino al bosque?',
      opciones: [
        'Construyendo puentes de madera',
        'Dispersando semillas que dan origen a nuevos árboles',
        'Limpiando las hojas secas de los caminos',
        'Pidiendo comida a los excursionistas'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Cada ser vivo cumple un rol vital en el equilibrio del gran hogar común.',
      tipo: 'literal'
    },
    {
      id: 16,
      materia: 'lectura',
      texto_base: 'Cuando la abuela Elena cuenta cuentos en la noche, no solo habla de dragones o ríos: recuerda los nombres de los bisabuelos y las recetas de dulces de lechosa que unieron a la familia hace cincuenta años.',
      pregunta: '¿Por qué son valiosos los cuentos de la abuela Elena?',
      opciones: [
        'Porque hacen que todos se duerman muy temprano',
        'Porque transmiten la memoria histórica, el cariño y las tradiciones familiares',
        'Porque son cuentos que leyó en el periódico de ayer',
        'Porque habla en idiomas extranjeros desconocidos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Honrar la memoria de nuestros mayores mantiene vivas las raíces de nuestra identidad.',
      tipo: 'inferencial'
    },
    {
      id: 17,
      materia: 'lectura',
      texto_base: 'En el pueblo de Naiguatá, durante la fiesta de San Juan, los tamboreros se van turnando. Cuando a uno se le cansan las manos, otro compañero entra suavemente sin que la música se detenga ni un segundo.',
      pregunta: '¿Cómo logran que el repique del tambor nunca se apague?',
      opciones: [
        'Con una máquina eléctrica de sonido',
        'Relevándose en equipo con respeto y sincronía',
        'Obligando a un solo músico a tocar todo el día',
        'Tocando una sola vez por hora'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El relevo fraterno permite que la energía colectiva continúe floreciendo.',
      tipo: 'literal'
    },
    {
      id: 18,
      materia: 'lectura',
      texto_base: 'Una hormiga sola cargaba una hoja diez veces más grande que su cuerpo y no avanzaba. Al verla, tres compañeras se sumaron: una levantó la punta, otra equilibró el tallo y la tercera guió el rumbo hacia el hormiguero.',
      pregunta: '¿Qué mensaje nos transmite la escena de las hormigas?',
      opciones: [
        'Que las hojas grandes deben dejarse en el suelo',
        'Que cuando repartimos las cargas de trabajo, las tareas pesadas se vuelven fáciles',
        'Que las hormigas pelean por la comida',
        'Que el viento es peligroso para los insectos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Muchos granitos de arena levantan una montaña; muchas voluntades resuelven cualquier reto.',
      tipo: 'inferencial'
    },
    {
      id: 19,
      materia: 'lectura',
      texto_base: 'En las salinas de Araya, el agua marina se evapora bajo el ardiente sol caribeño, dejando montañas de sal blanca como la nieve. La sal no solo da sabor a la comida, sino que históricamente sirvió para conservar los alimentos de los pueblos.',
      pregunta: '¿Para qué servía históricamente la sal según el texto?',
      opciones: [
        'Para pintar las casas del pueblo',
        'Para conservar los alimentos frescos por mucho tiempo',
        'Para endulzar jugos naturales',
        'Para construir canoas resistentes'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Los recursos de la naturaleza, usados con sabiduría, alimentan y protegen la vida.',
      tipo: 'literal'
    },
    {
      id: 20,
      materia: 'lectura',
      texto_base: 'El árbol de samán extiende sus gigantescas ramas en los llanos como un paraguas verde. Al mediodía, caballos, garzas, vacas y caminantes reposan bajo su frescor sin molestarse unos a otros.',
      pregunta: '¿Qué representa el samán en este relato?',
      opciones: [
        'Un obstáculo para el sol',
        'Un espacio de acogida, refugio y descanso compartido para todos',
        'Un árbol peligroso en las tormentas',
        'Una fuente de madera para muebles'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La hospitalidad comunitaria: ser como el samán, abriendo espacio para que todos encuentren cobijo.',
      tipo: 'inferencial'
    }
  ],

  matematica: [
    {
      id: 21,
      materia: 'matematica',
      texto_base: 'Para el sancocho comunitario de la escuela, cada uno de los 4 grupos aportó 15 mazorcas de maíz tierno cosechadas en el huerto escolar.',
      pregunta: '¿Cuántas mazorcas recolectaron en total entre todos los grupos?',
      opciones: ['45 mazorcas', '60 mazorcas', '55 mazorcas', '70 mazorcas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Multiplicamos 4 grupos × 15 mazorcas = 60 mazorcas. ¡Abundancia gracias a la suma de todos!',
      tipo: 'problema'
    },
    {
      id: 22,
      materia: 'matematica',
      texto_base: 'Una gran torta de auyama fue horneada para celebrar el aniversario del grado. La maestra la dividió en 8 porciones exactamente iguales.',
      pregunta: 'Si el equipo repartió 6 de esas porciones a los invitados, ¿qué fracción representa lo repartido?',
      opciones: ['1/8', '6/8 (o 3/4)', '8/6', '2/8'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Tomamos 6 partes de un total de 8: la fracción es 6/8, que simplificada es 3/4.',
      tipo: 'concepto'
    },
    {
      id: 23,
      materia: 'matematica',
      texto_base: 'Los niños están calculando el perímetro del huerto escolar rectangular. Mide 12 metros de largo y 8 metros de ancho.',
      pregunta: '¿Cuántos metros de cerca de madera necesitan colocar alrededor del huerto?',
      opciones: ['20 metros', '40 metros', '96 metros', '24 metros'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El perímetro es la suma de los 4 lados: 12 + 8 + 12 + 8 = 40 metros.',
      tipo: 'problema'
    },
    {
      id: 24,
      materia: 'matematica',
      texto_base: 'Observa la serie de árboles sembrados por la brigada ecológica: 4, 8, 16, 32, ...',
      pregunta: '¿Cuál es el siguiente número en este patrón que va duplicando los árboles en cada jornada?',
      opciones: ['48 árboles', '64 árboles', '36 árboles', '54 árboles'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El patrón multiplica por 2 en cada paso: 32 × 2 = 64. ¡El bosque crece exponencialmente!',
      tipo: 'concepto'
    },
    {
      id: 25,
      materia: 'matematica',
      texto_base: 'La biblioteca comunitaria tiene 360 libros para repartir en partes iguales entre 6 estantes temáticos.',
      pregunta: '¿Cuántos libros ordenará el equipo en cada estante?',
      opciones: ['50 libros', '60 libros', '70 libros', '65 libros'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Dividimos 360 ÷ 6 = 60 libros por estante. La justicia distributiva en acción.',
      tipo: 'operacion'
    },
    {
      id: 26,
      materia: 'matematica',
      texto_base: 'Un jarro de jugo de guanábana contiene 1 litro (1.000 mililitros). Cuatro amigos quieren servirse vasos idénticos.',
      pregunta: '¿Cuántos mililitros de jugo recibirá cada amigo?',
      opciones: ['200 ml', '250 ml', '300 ml', '150 ml'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '1.000 ml dividido entre 4 amigos = 250 ml cada uno. Todos reciben la misma porción con alegría.',
      tipo: 'problema'
    },
    {
      id: 27,
      materia: 'matematica',
      texto_base: 'La cooperative escolar vendió 148 panes el lunes y 235 panes el martes para comprar balones de fútbol.',
      pregunta: '¿Cuántos panes vendieron en total durante los dos días?',
      opciones: ['373 panes', '383 panes', '393 panes', '363 panes'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Sumamos 148 + 235 = 383 panes. El ahorro colectivo acerca la meta de juego para todos.',
      tipo: 'operacion'
    },
    {
      id: 28,
      materia: 'matematica',
      texto_base: 'Un triángulo tiene tres lados iguales que miden 9 centímetros cada uno.',
      pregunta: '¿Qué tipo de triángulo es y cuánto mide su perímetro total?',
      opciones: [
        'Escaleno con perímetro de 18 cm',
        'Equilátero con perímetro de 27 cm',
        'Isósceles con perímetro de 24 cm',
        'Rectángulo con perímetro de 30 cm'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Tres lados iguales definen un triángulo equilátero, y su perímetro es 9 + 9 + 9 = 27 cm.',
      tipo: 'concepto'
    },
    {
      id: 29,
      materia: 'matematica',
      texto_base: 'Para hacer una bandera gigante de la paz, los estudiantes cortaron una cinta de 500 centímetros en trozos de 50 centímetros.',
      pregunta: '¿Cuántos trozos de cinta obtuvieron para repartir entre los comités?',
      opciones: ['5 trozos', '10 trozos', '15 trozos', '20 trozos'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Dividimos 500 ÷ 50 = 10 trozos iguales. Cada salón tiene su lazo fraterno.',
      tipo: 'operacion'
    },
    {
      id: 30,
      materia: 'matematica',
      texto_base: 'Si 3 cuadernos de dibujo cuestan 15 monedas solidarias en el trueque escolar...',
      pregunta: '¿Cuánto costarán 7 cuadernos de dibujo manteniendo el mismo precio solidario?',
      opciones: ['30 monedas', '35 monedas', '40 monedas', '28 monedas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Primero hallamos el costo de un cuaderno: 15 ÷ 3 = 5 monedas. Luego: 7 × 5 = 35 monedas.',
      tipo: 'problema'
    },
    {
      id: 31,
      materia: 'matematica',
      texto_base: 'En el almacén de semillas había 520 kilos de frijoles negros. Se distribuyeron 345 kilos para los comedores infantiles.',
      pregunta: '¿Cuántos kilos de frijoles quedaron guardados en reserva?',
      opciones: ['165 kg', '175 kg', '185 kg', '195 kg'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Restamos 520 - 345 = 175 kg. Una buena comunidad siempre guarda reservas para imprevistos.',
      tipo: 'operacion'
    },
    {
      id: 32,
      materia: 'matematica',
      texto_base: 'Un reloj de la plaza marca las 3:15 de la tarde. La asamblea estudiantil comenzará exactamente en 45 minutos.',
      pregunta: '¿A qué hora exacta iniciará la asamblea?',
      opciones: ['3:45 pm', '4:00 pm', '4:15 pm', '4:30 pm'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '15 minutos + 45 minutos = 60 minutos (1 hora completa). Pasamos de las 3:15 a las 4:00 en punto.',
      tipo: 'problema'
    },
    {
      id: 33,
      materia: 'matematica',
      texto_base: 'La brigada de limpieza recolectó 24 bolsas de plástico en la orilla del lago, cada una con un peso promedio de 3 kilogramos.',
      pregunta: '¿Cuántos kilogramos de plástico retiraron para proteger el agua y las aves?',
      opciones: ['64 kg', '72 kg', '82 kg', '68 kg'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Multiplicamos 24 bolsas × 3 kg = 72 kg de plástico retirados con amor y dedicación.',
      tipo: 'operacion'
    },
    {
      id: 34,
      materia: 'matematica',
      texto_base: '¿Cuál de las siguientes fracciones es mayor que 1/2?',
      pregunta: 'Selecciona la fracción que representa más de la mitad:',
      opciones: ['1/4', '3/4', '2/6', '1/3'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '3/4 equivale a 75%, mientras que 1/2 equivale a 50%. Por lo tanto, 3/4 es mayor.',
      tipo: 'concepto'
    },
    {
      id: 35,
      materia: 'matematica',
      texto_base: 'Un canasto tiene 7 docenas de naranjas dulces cosechadas en los valles de Aragua.',
      pregunta: 'Sabiendo que una docena tiene 12 unidades, ¿cuántas naranjas hay en total?',
      opciones: ['72 naranjas', '84 naranjas', '96 naranjas', '70 naranjas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Multiplicamos 7 × 12 = 84 naranjas dulces para refrescar a toda la clase.',
      tipo: 'operacion'
    },
    {
      id: 36,
      materia: 'matematica',
      texto_base: 'Un patio cuadrado tiene un lado que mide 7 metros.',
      pregunta: '¿Cuál es el área total de la superficie del patio para jugar rondas?',
      opciones: ['28 m²', '49 m²', '35 m²', '42 m²'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El área de un cuadrado es lado × lado: 7 m × 7 m = 49 metros cuadrados de espacio compartido.',
      tipo: 'problema'
    },
    {
      id: 37,
      materia: 'matematica',
      texto_base: 'En una rifa solidaria se vendieron números del 1 al 100. Los números pares ganaban una planta medicinal.',
      pregunta: '¿Cuántos números pares hay en total entre el 1 y el 100?',
      opciones: ['40 números', '50 números', '60 números', '45 números'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Exactamente la mitad de los primeros 100 números enteros son pares: 100 ÷ 2 = 50.',
      tipo: 'concepto'
    },
    {
      id: 38,
      materia: 'matematica',
      texto_base: 'Un autobús escolar recorre 65 kilómetros en la primera hora y 75 kilómetros en la segunda hora en su viaje al museo.',
      pregunta: '¿Cuántos kilómetros ha recorrido en total durante esas dos horas?',
      opciones: ['130 km', '140 km', '145 km', '150 km'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Sumamos 65 + 75 = 140 km de recorrido seguro hacia el aprendizaje.',
      tipo: 'operacion'
    },
    {
      id: 39,
      materia: 'matematica',
      texto_base: 'Para hacer un telar comunitario, 5 estudiantes aportaron 18 hebras de lana de colores cada uno.',
      pregunta: '¿Cuántas hebras de lana tiene ahora el gran telar colectivo?',
      opciones: ['80 hebras', '90 hebras', '95 hebras', '100 hebras'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Multiplicamos 5 compañeros × 18 hebras = 90 hebras entrelazadas.',
      tipo: 'problema'
    },
    {
      id: 40,
      materia: 'matematica',
      texto_base: 'Observa la serie de ahorro colectivo semanal: 5, 10, 20, 40, 80...',
      pregunta: '¿Qué cantidad lograrán reunir en la siguiente semana si mantienen la misma duplicación?',
      opciones: ['120 monedas', '160 monedas', '140 monedas', '180 monedas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Duplicamos el valor anterior: 80 × 2 = 160 monedas. ¡El fondo solidario se fortalece!',
      tipo: 'concepto'
    }
  ],

  ciencia: [
    {
      id: 41,
      materia: 'ciencia',
      texto_base: 'Las plantas verdes capturan la energía de la luz solar, absorben agua por sus raíces y dióxido de carbono del aire para producir su propio alimento y liberar oxígeno.',
      pregunta: '¿Cómo se llama este proceso vital que sostiene la vida en el planeta?',
      opciones: ['Respiración pulmonar', 'Fotosíntesis', 'Evaporación', 'Polinización'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La fotosíntesis es el pacto ecológico por excelencia: las plantas nos dan aire puro y nosotros cuidamos de ellas.',
      tipo: 'concepto'
    },
    {
      id: 42,
      materia: 'ciencia',
      texto_base: 'El chigüire o capibara es el roedor más grande del mundo. Vive en manadas pacíficas en los llanos cerca de lagunas y ríos.',
      pregunta: '¿Cuál es el hábitat natural del chigüire y su tipo de alimentación?',
      opciones: [
        'Desierto árido y se alimenta de carne',
        'Humedales y sabanas, y es un animal herbívoro',
        'Montañas nevadas y come peces',
        'Cuevas oscuras y come insectos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Los humedales son cunas de biodiversidad. El chigüire vive en manada, símbolo de protección mutua.',
      tipo: 'concepto'
    },
    {
      id: 43,
      materia: 'ciencia',
      texto_base: 'El corazón humano late unas 80 veces por minuto en reposo, impulsando la sangre cargada de oxígeno hacia todos los órganos del cuerpo.',
      pregunta: '¿A qué sistema del cuerpo humano pertenece el corazón?',
      opciones: ['Sistema digestivo', 'Sistema circulatorio', 'Sistema óseo', 'Sistema respiratorio'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El sistema circulatorio conecta y nutre a todas las células, igual que los lazos de amistad en el aula.',
      tipo: 'concepto'
    },
    {
      id: 44,
      materia: 'ciencia',
      texto_base: 'Cuando el agua líquida de un río se calienta mucho por el calor del sol tropical, sube al cielo convertida en vapor invisible formando nubes.',
      pregunta: '¿Cómo se llama el cambio de estado de líquido a gas?',
      opciones: ['Condensación', 'Evaporación', 'Solidificación', 'Fusión'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El ciclo del agua nunca se detiene: lo que el sol evapora vuelve como lluvia bendita para los campos.',
      tipo: 'concepto'
    },
    {
      id: 45,
      materia: 'ciencia',
      texto_base: 'Nuestro planeta Tierra es el tercer planeta desde el Sol y el único conocido en albergar agua líquida y vida.',
      pregunta: '¿Cuánto tiempo tarda la Tierra en dar una vuelta completa alrededor del Sol (movimiento de traslación)?',
      opciones: ['24 horas', '365 días y 6 horas (un año)', '30 días (un mes)', '12 horas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La traslación marca las estaciones y los ciclos de siembra de los pueblos originarios.',
      tipo: 'concepto'
    },
    {
      id: 46,
      materia: 'ciencia',
      texto_base: 'Las abejas y los colibríes visitan las flores en busca de néctar dulce, transportando granos de polen pegados a su cuerpo de una flor a otra.',
      pregunta: '¿Qué beneficio fundamental produce la polinización?',
      opciones: [
        'Seca los pétalos de las plantas',
        'Permite la formación de frutos y nuevas semillas que alimentan al mundo',
        'Espanta a las aves del bosque',
        'Cambia el color de la tierra'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Las abejas nos enseñan la interdependencia: sin su trabajo silencioso, no habría cosechas.',
      tipo: 'concepto'
    },
    {
      id: 47,
      materia: 'ciencia',
      texto_base: 'Los manglares crecen en las costas venezolanas donde se mezcla el agua dulce de los ríos con el agua salada del mar. Sus raíces sumergidas son la guardería de peces, camarones y cangrejos.',
      pregunta: '¿Por qué los manglares son considerados ecosistemas protectores?',
      opciones: [
        'Porque calientan el agua del mar',
        'Porque protegen la costa del oleaje fuerte y sirven de refugio a las crías marinas',
        'Porque impiden que llueva',
        'Porque no dejan entrar a los barcos de vela'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Los manglares abrazan y cuidan a los más jóvenes de la vida marina, como una escuela acogedora.',
      tipo: 'concepto'
    },
    {
      id: 48,
      materia: 'ciencia',
      texto_base: 'El esqueleto humano en un adulto está compuesto por 206 huesos unidos por articulaciones.',
      pregunta: '¿Cuáles son las funciones primordiales del sistema óseo?',
      opciones: [
        'Bombear sangre y respirar aire',
        'Sostener el cuerpo, permitir el movimiento y proteger órganos vitales',
        'Digerir los alimentos en el estómago',
        'Sentir los sabores de la comida'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La columna y las costillas cuidan nuestro corazón y pulmones con firmeza y flexibilidad.',
      tipo: 'concepto'
    },
    {
      id: 49,
      materia: 'ciencia',
      texto_base: 'Si ponemos un cubo de hielo en un plato a temperatura ambiente, pronto se transforma en agua líquida.',
      pregunta: '¿Cómo se llama este paso de estado sólido a líquido?',
      opciones: ['Ebullición', 'Fusión', 'Sublimación', 'Solidificación'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La fusión ocurre cuando el hielo absorbe calor del ambiente, adaptándose a su entorno.',
      tipo: 'concepto'
    },
    {
      id: 50,
      materia: 'ciencia',
      texto_base: 'La Luna es el satélite natural de la Tierra. No tiene luz propia, sino que refleja la luz que recibe del Sol.',
      pregunta: '¿Cuánto dura aproximadamente el ciclo completo de las fases lunares?',
      opciones: ['7 días', '28 días (cerca de un mes)', '365 días', '24 horas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Las fases lunares guían la pesca artesanal y la siembra desde tiempos ancestrales.',
      tipo: 'concepto'
    },
    {
      id: 51,
      materia: 'ciencia',
      texto_base: 'Los pulmones toman el aire cuando inhalamos y absorben el gas que nuestras células necesitan para vivir.',
      pregunta: '¿Cuál es el gas indispensable que capturan los pulmones del aire?',
      opciones: ['Dióxido de carbono', 'Oxígeno', 'Helio', 'Metano'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El oxígeno nos conecta con cada árbol y bosque del planeta.',
      tipo: 'concepto'
    },
    {
      id: 52,
      materia: 'ciencia',
      texto_base: 'Los animales vertebrados se dividen en cinco grandes grupos: mamíferos, aves, reptiles, anfibios y peces.',
      pregunta: '¿Qué característica define a las ranas y sapos como anfibios?',
      opciones: [
        'Tienen plumas y vuelan alto',
        'Tienen piel desnuda y húmeda, y sufren metamorfosis desde renacuajos',
        'Nacen con pelo y maman leche de su madre',
        'Viven únicamente bajo la tierra seca'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La capacidad de transformarse y adaptarse nos enseña la belleza de aprender cosas nuevas.',
      tipo: 'concepto'
    },
    {
      id: 53,
      materia: 'ciencia',
      texto_base: 'En un bosque, las hojas caídas y las ramas secas son transformadas en abono fértil por hongos, bacterias y lombrices.',
      pregunta: '¿Cómo se llama a estos organismos esenciales en la cadena alimenticia?',
      opciones: ['Depredadores carnívoros', 'Descomponedores o recicladores naturales', 'Herbívoros gigantes', 'Productores de luz'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Nada se desperdicia en la naturaleza: los descomponedores cierran el círculo de la vida convirtiendo lo viejo en vida nueva.',
      tipo: 'concepto'
    },
    {
      id: 54,
      materia: 'ciencia',
      texto_base: 'El estómago y los intestinos trabajan juntos para transformar la arepa y las frutas en nutrientes que pasan a la sangre.',
      pregunta: '¿Qué aparato del cuerpo humano realiza este trabajo de digestión y asimilación?',
      opciones: ['Aparato respiratorio', 'Aparato digestivo', 'Aparato locomotor', 'Sistema nervioso'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Nutrir bien nuestro cuerpo con alimentos frescos nos da energía para jugar y estudiar con ánimo.',
      tipo: 'concepto'
    },
    {
      id: 55,
      materia: 'ciencia',
      texto_base: 'El oso hormiguero gigante tiene una lengua muy larga y pegajosa con la que come termitas sin romper por completo los nidos.',
      pregunta: '¿Por qué esta característica es una adaptación evolutiva?',
      opciones: [
        'Porque le permite cantar como las aves',
        'Porque le permite alimentarse eficazmente sin destruir por completo su fuente de alimento',
        'Para nadar en ríos profundos',
        'Para volar de árbol en árbol'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Alimentarse con moderación respeta el equilibrio ecológico para que siga habiendo sustento.',
      tipo: 'concepto'
    },
    {
      id: 56,
      materia: 'ciencia',
      texto_base: 'El Sol es una gigantesca estrella compuesta principalmente de gases calientes como hidrógeno y helio.',
      pregunta: '¿Qué dos elementos vitales nos proporciona el Sol a todos los seres vivos de la Tierra?',
      opciones: ['Lluvia y viento', 'Luz y calor', 'Piedras y agua', 'Electricidad y metales'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El Sol ilumina a todos por igual, un ejemplo cósmico de generosidad incondicional.',
      tipo: 'concepto'
    },
    {
      id: 57,
      materia: 'ciencia',
      texto_base: 'Para separar los residuos en la escuela, colocamos contenedores identificados: azul para papel, verde para vidrio y amarillo para plástico.',
      pregunta: '¿Cuál de las "Tres R" estamos practicando al separar los materiales para crear nuevos objetos?',
      opciones: ['Romper', 'Reciclar', 'Rendir', 'Resistir'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Reciclar es un acto de amor hacia las futuras generaciones y hacia nuestro planeta.',
      tipo: 'concepto'
    },
    {
      id: 58,
      materia: 'ciencia',
      texto_base: 'Los tepuyes de Canaima son mesetas milenarias con paredes verticales y cumbres planas donde viven plantas carnívoras únicas que no existen en ningún otro lugar.',
      pregunta: '¿Cómo se llama a las especies animales o vegetales que solo habitan en una región específica?',
      opciones: ['Especies invasoras', 'Especies endémicas', 'Especies domésticas', 'Especies migratorias'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Las especies endémicas son tesoros de nuestra patria que debemos custodiar con orgullo.',
      tipo: 'concepto'
    },
    {
      id: 59,
      materia: 'ciencia',
      texto_base: 'El cerebro humano recibe mensajes de los ojos, los oídos, la piel, la lengua y la nariz para saber qué ocurre a su alrededor.',
      pregunta: '¿Qué órgano es el centro de control del sistema nervioso y de nuestros pensamientos y emociones?',
      opciones: ['El hígado', 'El cerebro', 'El fémur', 'El páncreas'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El cerebro coordina cada latido y nos permite empatizar con la alegría o la tristeza de nuestros amigos.',
      tipo: 'concepto'
    },
    {
      id: 60,
      materia: 'ciencia',
      texto_base: 'El agua pura hierve a nivel del mar cuando alcanza los 100 grados centígrados de temperatura.',
      pregunta: '¿Qué observamos en el agua cuando entra en su punto de ebullición?',
      opciones: [
        'Se congela formando cristales',
        'Burbujea vigorosamente y emite vapor de agua',
        'Se vuelve de color rojo',
        'Aumenta su peso diez veces'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La ciencia nos ayuda a comprender los fenómenos cotidianos con curiosidad y método.',
      tipo: 'concepto'
    }
  ],

  logica: [
    {
      id: 61,
      materia: 'logica',
      texto_base: 'Acertijo comunitario: "Tengo hojas pero no soy árbol, tengo lomo pero no soy animal, te hablo con silencio y si me abres te enseño mil mundos".',
      pregunta: '¿Quién soy?',
      opciones: ['Una puerta de madera', 'Un libro', 'Una nube del cielo', 'Un espejo mágico'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡Un libro! Abrir un libro en grupo es sembrar semillas de conocimiento compartido.',
      tipo: 'acertijo'
    },
    {
      id: 62,
      materia: 'logica',
      texto_base: 'Analogía: Semilla es a Árbol como Niño es a...',
      pregunta: 'Completa la relación lógica:',
      opciones: ['Juguete', 'Adulto', 'Zapato', 'Escuela'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La semilla germina y crece hasta ser árbol; el niño crece con cariño y valores hasta ser un adulto noble.',
      tipo: 'concepto'
    },
    {
      id: 63,
      materia: 'logica',
      texto_base: 'Observa la serie de figuras y colores: Círculo Azul, Cuadrado Rojo, Triángulo Verde, Círculo Azul, Cuadrado Rojo, ...',
      pregunta: '¿Qué figura y color continúa la secuencia?',
      opciones: ['Círculo Verde', 'Triángulo Verde', 'Cuadrado Azul', 'Triángulo Rojo'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El patrón repite tres elementos: Azul, Rojo, Verde. Luego de Rojo corresponde Triángulo Verde.',
      tipo: 'concepto'
    },
    {
      id: 64,
      materia: 'logica',
      texto_base: 'Cuatro amigos están en una fila de la biblioteca. Lucía está delante de Tomás. Valentina está detrás de Tomás. Andrés está en el primer lugar.',
      pregunta: '¿Quién se encuentra en el último lugar de la fila?',
      opciones: ['Lucía', 'Valentina', 'Tomás', 'Andrés'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El orden de adelante hacia atrás es: Andrés → Lucía → Tomás → Valentina. Valentina está en el último lugar.',
      tipo: 'problema'
    },
    {
      id: 65,
      materia: 'logica',
      texto_base: 'Acertijo del agua: "Nazco en la montaña, corro sin tener pies, canto sin tener boca y jamás puedo retroceder".',
      pregunta: '¿Quién soy?',
      opciones: ['El viento', 'El río', 'Una piedra', 'El sol'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡El río! El río avanza siempre hacia el mar, llevando vida a los pueblos que baña en su trayecto.',
      tipo: 'acertijo'
    },
    {
      id: 66,
      materia: 'logica',
      texto_base: 'Analogía de oficios: Pincel es a Pintor como Azadón es a...',
      pregunta: '¿Qué persona utiliza el azadón como su herramienta principal de trabajo?',
      opciones: ['Carpintero', 'Agricultor o campesino', 'Piloto de avión', 'Músico'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El campesino labra la tierra con su azadón para regalarnos los frutos de la tierra.',
      tipo: 'concepto'
    },
    {
      id: 67,
      materia: 'logica',
      texto_base: 'En un salón de clases, todos los que tocan el cuatro son amantes de la música folclórica. Daniel toca el cuatro venezolano.',
      pregunta: '¿Qué conclusión lógica se deduce con certeza?',
      opciones: [
        'Daniel no sabe cantar',
        'Daniel es amante de la música folclórica',
        'Daniel es el maestro del salón',
        'Daniel no tiene instrumento'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Deducción directa: si todos los que tocan el cuatro aman el folclor y Daniel lo toca, Daniel ama el folclor.',
      tipo: 'problema'
    },
    {
      id: 68,
      materia: 'logica',
      texto_base: 'Observa la secuencia de números pares multiplicados: 3, 6, 12, 24, 48, ...',
      pregunta: '¿Qué número sigue en la secuencia lógica?',
      opciones: ['72', '96', '84', '100'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Cada número es el doble del anterior: 48 × 2 = 96.',
      tipo: 'operacion'
    },
    {
      id: 69,
      materia: 'logica',
      texto_base: 'Acertijo de la convivencia: "Cuanto más la compartes con los demás, más grande se hace; nunca disminuye al darla".',
      pregunta: '¿Qué es?',
      opciones: ['Una rebanada de pan', 'La alegría y el amor', 'Una moneda de oro', 'Un vaso con agua'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡La alegría! El espíritu Ubuntu nos enseña que compartir el bienestar multiplica la felicidad.',
      tipo: 'acertijo'
    },
    {
      id: 70,
      materia: 'logica',
      texto_base: 'En una canasta hay 3 manzanas verdes, 4 manzanas rojas y 2 peras amarillas. Sin mirar, sacas una fruta.',
      pregunta: '¿De qué color es más probable que sea la fruta que tomes al azar?',
      opciones: ['Verde', 'Roja', 'Amarilla', 'Azul'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Hay 4 manzanas rojas frente a 3 verdes y 2 amarillas. El rojo tiene la mayor probabilidad.',
      tipo: 'problema'
    },
    {
      id: 71,
      materia: 'logica',
      texto_base: 'Analogía: Noche es a Luna como Día es a...',
      pregunta: 'Completa la pareja correspondiente:',
      opciones: ['Estrella', 'Sol', 'Lluvia', 'Relámpago'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La Luna alumbra la noche y el Sol alumbra el día en perfecta alternancia cósmica.',
      tipo: 'concepto'
    },
    {
      id: 72,
      materia: 'logica',
      texto_base: 'Si hoy es jueves y faltan 3 días para la feria escolar de ciencias...',
      pregunta: '¿Qué día de la semana será la feria escolar?',
      opciones: ['Viernes', 'Domingo', 'Sábado', 'Lunes'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Jueves + 1 (viernes) + 2 (sábado) + 3 (domingo). La feria será el domingo familiar.',
      tipo: 'problema'
    },
    {
      id: 73,
      materia: 'logica',
      texto_base: 'Acertijo: "Vuelo sin alas, lloro sin ojos, dondequiera que voy la oscuridad me sigue y apago el fuego si me enojo".',
      pregunta: '¿Qué fenómeno de la naturaleza soy?',
      opciones: ['El arcoíris', 'La nube de tormenta', 'Un pajarito', 'Un papalote o cometa'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡La nube de lluvia y tormenta! Vuela con el viento y regala el agua que fecunda los campos.',
      tipo: 'acertijo'
    },
    {
      id: 74,
      materia: 'logica',
      texto_base: 'Un granjero tiene que cruzar un río con un bote pequeño donde solo caben él y una cosa a la vez. No puede dejar solos a la cabra y al repollo.',
      pregunta: '¿Por qué no debe dejarlos solos sin su supervisión?',
      opciones: [
        'Porque la cabra se aburre',
        'Porque la cabra se comería el repollo',
        'Porque el repollo se escapa nadando',
        'Porque el bote se hunde con ambos'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La lógica nos ayuda a anticipar consecuencias para proteger el sustento del grupo.',
      tipo: 'problema'
    },
    {
      id: 75,
      materia: 'logica',
      texto_base: 'Secuencia de letras del abecedario saltando una letra: A, C, E, G, ...',
      pregunta: '¿Cuál es la siguiente letra que continúa la serie?',
      opciones: ['H', 'I', 'J', 'K'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'Se salta una letra en cada paso: A (b) C (d) E (f) G (h) -> I.',
      tipo: 'concepto'
    },
    {
      id: 76,
      materia: 'logica',
      texto_base: 'Tres cajas de cartón están cerradas: una tiene pelotas de fútbol, otra tiene libros de cuentos, y la tercera tiene instrumentos musicales. Las etiquetas están mezcladas.',
      pregunta: 'Si abres la caja con etiqueta errónea "Pelotas" y encuentras un tambor, ¿qué sabes de inmediato?',
      opciones: [
        'Que esa caja en realidad tiene instrumentos musicales',
        'Que la caja está vacía',
        'Que dentro hay pelotas escondidas',
        'Que no se puede saber nada'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La observación directa revela la verdad y desvanece cualquier etiqueta falsa.',
      tipo: 'problema'
    },
    {
      id: 77,
      materia: 'logica',
      texto_base: 'Analogía: Pájaro es a Nido como Ser Humano es a...',
      pregunta: 'Completa la relación de cobijo y hogar:',
      opciones: ['Calle', 'Hogar o Casa', 'Árbol', 'Parque'],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'El nido protege a los pichones como el hogar protege a la familia.',
      tipo: 'concepto'
    },
    {
      id: 78,
      materia: 'logica',
      texto_base: 'Acertijo: "Sube llena y baja vacía, y si no se apura la sopa se enfría".',
      pregunta: '¿Qué utensilio de la mesa soy?',
      opciones: ['El tenedor', 'La cuchara', 'El vaso', 'La servilleta'],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡La cuchara! El utensilio con el que compartimos la sopa caliente alrededor del fogón familiar.',
      tipo: 'acertijo'
    },
    {
      id: 79,
      materia: 'logica',
      texto_base: 'Cinco amigos hicieron una carrera amistosa donde la meta era llegar tomados de la mano. Si corrieron juntos al mismo paso...',
      pregunta: '¿Quién ganó la carrera?',
      opciones: [
        'El más alto del salón',
        'Todos ganaron juntos como un solo equipo',
        'El que corrió por la izquierda',
        'Nadie ganó porque no compitieron'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: '¡Todos ganaron! En la filosofía Ubuntu, el triunfo más hermoso es cruzar la meta unidos.',
      tipo: 'concepto'
    },
    {
      id: 80,
      materia: 'logica',
      texto_base: 'Si todas las abejas de una colmena colaboran para fabricar miel y cuidar a las larvas, y Maya es una abeja de esa colmena...',
      pregunta: '¿Qué hace Maya cada día con sus compañeras?',
      opciones: [
        'Duerme todo el día en una flor',
        'Aporta su granito de trabajo en equipo para el bien de la colmena',
        'Pelea con las otras abejas',
        'Vive sola en un rincón apartado'
      ],
      respuesta_correcta: 1,
      explicacion_ubuntu: 'La armonía del panal es fruto del aporte solidario de cada integrante.',
      tipo: 'problema'
    }
  ]
};

export const MATERIAS_CONFIG: Record<string, { titulo: string; icono: string; color: string; descripcion: string }> = {
  lectura: {
    titulo: 'Lectura Comprensiva',
    icono: '📖',
    color: 'from-amber-500 to-orange-600',
    descripcion: 'Textos cortos, fábulas y relatos venezolanos con preguntas literales e inferenciales.'
  },
  matematica: {
    titulo: 'Matemática Solidaria',
    icono: '📐',
    color: 'from-teal-500 to-emerald-600',
    descripcion: 'Operaciones básicas, fracciones, áreas y desafíos de recursos comunitarios.'
  },
  ciencia: {
    titulo: 'Ciencias de la Tierra',
    icono: '🌿',
    color: 'from-emerald-500 to-teal-700',
    descripcion: 'Ecosistemas venezolanos, seres vivos, cuerpo humano y astronomía.'
  },
  logica: {
    titulo: 'Razonamiento Lógico',
    icono: '🧩',
    color: 'from-indigo-500 to-violet-600',
    descripcion: 'Acertijos, secuencias, analogías y deducción para resolver en equipo.'
  }
};
