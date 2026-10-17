import { EtapaHistorica, ZonaHistorica } from '../types/database';

export interface InfoEtapa {
  id: EtapaHistorica;
  titulo: string;
  rango_anos: string;
  lema: string;
  icono: string;
  color: string;
  resumen: string;
  hito_principal: string;
  zonas: ZonaHistorica[];
}

export const ETAPAS_HISTORIA: InfoEtapa[] = [
  {
    id: 'precolombina',
    titulo: 'Época Precolombina',
    rango_anos: 'Antes de 1498',
    lema: 'Raíces sagradas, convivencia con la Madre Tierra y propiedad comunitaria',
    icono: '🏺',
    color: 'from-amber-600 to-yellow-700',
    resumen: 'Miles de años antes de la llegada de los europeos, pueblos originarios habitaban con sabiduría los ríos, costas, montañas y selvas de nuestro territorio. Vivían en reciprocidad y respeto por los ciclos naturales.',
    hito_principal: 'Construcción de aldeas autosuficientes, desarrollo del cultivo en terrazas y sistemas de trueque.',
    zonas: [
      {
        id: 'andes_timoto',
        nombre: 'Cordillera de los Andes',
        etapa: 'precolombina',
        region: 'Andes',
        pueblos_o_personajes: 'Naciones Timoto-cuicas (Mucuchíes, Mirripuyes)',
        descripcion_historica: 'Pobladores sedentarios y grandes constructores de terrazas de piedra y andenes agrícolas para sembrar en las laderas empinadas de las montañas.',
        mision_colaborativa: 'Construir una aldea andina autosuficiente en armonía con los páramos y las fuentes de agua dulce.',
        pregunta_reflexion: '¿Cómo ayudó el trabajo comunitario en terrazas a evitar que la lluvia dañara los cultivos?',
        elementos: [
          {
            id: 'viv_andes',
            categoria: 'vivienda',
            titulo: 'Casas de piedra y barro (pircas)',
            descripcion: 'Muros gruesos de piedra caliza con techos de paja frailejón para abrigarse del frío páramo.',
            icono: '🛖',
            impacto_ubuntu: 'Construidas en minga colectiva: las familias se ayudaban a transportar las grandes rocas.'
          },
          {
            id: 'alim_andes',
            categoria: 'alimentacion',
            titulo: 'Cultivo de papa, maíz y miche andino',
            descripcion: 'Riego por acequias de deshielo y terrazas que producen alimentos en diferentes alturas.',
            icono: '🥔',
            impacto_ubuntu: 'Las cosechas se depositaban en silos comunitarios para asegurar el alimento en temporadas frías.'
          },
          {
            id: 'trab_andes',
            categoria: 'trabajo',
            titulo: 'Alfarería y tejido de mantas de algodón',
            descripcion: 'Vasijas decoradas con figuras geométricas y mantas tejidas con fibras vegetales para proteger del viento.',
            icono: '🧶',
            impacto_ubuntu: 'Los artesanos enseñaban sus técnicas a los niños en talleres comunitarios.'
          },
          {
            id: 'org_andes',
            categoria: 'organizacion',
            titulo: 'Consejo de Sabios y Caciques de Paz',
            descripcion: 'Las decisiones de siembra y resolución de conflictos se tomaban en círculos de ancianos bajo la luna.',
            icono: '🤝',
            impacto_ubuntu: 'Toda opinión era escuchada con respeto; no existían cárceles ni desamparados.'
          },
          {
            id: 'cre_andes',
            categoria: 'creencias_tecnologia',
            titulo: 'Veneración a la Laguna Sagrada de Mucubají y Ches',
            descripcion: 'Ches era la deidad protectora de los cultivos y la lluvia benevolente en los páramos.',
            icono: '✨',
            impacto_ubuntu: 'Pedían permiso antes de recolectar frutos silvestres y respetaban a los animales sagrados.'
          }
        ]
      },
      {
        id: 'guayana_pemon',
        nombre: 'Guayana y Gran Sabana',
        etapa: 'precolombina',
        region: 'Guayana',
        pueblos_o_personajes: 'Pueblos Pemón y Ye’kuana',
        descripcion_historica: 'Navegantes expertos de ríos caudalosos como el Caroní y el Caura. Creadores de la churuata, casa cósmica circular que representa el universo.',
        mision_colaborativa: 'Erigir una churuata comunitaria en la sabana junto al río para acoger a toda la familia extendida.',
        pregunta_reflexion: '¿Por qué la churuata representa que todos somos parte de un mismo círculo de vida?',
        elementos: [
          {
            id: 'viv_guayana',
            categoria: 'vivienda',
            titulo: 'La Gran Churuata circular',
            descripcion: 'Vivienda comunal de postes de madera dura, techada con palma de moriche tejida.',
            icono: '⛺',
            impacto_ubuntu: 'En ella conviven hasta 60 personas en armonía, compartiendo el fuego central.'
          },
          {
            id: 'alim_guayana',
            categoria: 'alimentacion',
            titulo: 'Yuca amarga, casabe y kachiri',
            descripcion: 'Procesamiento de la yuca con el sebucán para extraer el cianuro y hacer tortas de casabe duraderas.',
            icono: '🫓',
            impacto_ubuntu: 'Toda la aldea participa en el rallado y secado del casabe para alimentar a los viajeros.'
          },
          {
            id: 'trab_guayana',
            categoria: 'trabajo',
            titulo: 'Talla de curiaras y cestería de waja',
            descripcion: 'Troncos vaciados a fuego para hacer canoas rápidas y cestas tejidas con historias míticas.',
            icono: '🛶',
            impacto_ubuntu: 'Una curiara pertenecía a la aldea para el transporte de alimentos y niños.'
          },
          {
            id: 'org_guayana',
            categoria: 'organizacion',
            titulo: 'Mural de sueños y asamblea del amanecer',
            descripcion: 'Al amanecer, la comunidad se reúne a tomar mate caliente y relatar sus sueños para prevenir peligros.',
            icono: '🌅',
            impacto_ubuntu: 'La empatía colectiva comienza escuchando cómo amaneció el corazón de cada vecino.'
          },
          {
            id: 'cre_guayana',
            categoria: 'creencias_tecnologia',
            titulo: 'Mito del Árbol de la Vida (Amalivaca)',
            descripcion: 'Creencia en que todos los frutos y seres nacieron de un gran árbol compartido por todas las tribus.',
            icono: '🌳',
            impacto_ubuntu: 'Enseña que la codicia seca las fuentes, mientras que el compartir hace brotar la selva.'
          }
        ]
      },
      {
        id: 'costa_caribe',
        nombre: 'Costa Oriental y del Caribe',
        etapa: 'precolombina',
        region: 'Costa/Caribe',
        pueblos_o_personajes: 'Naciones Caribe y Cumanagoto',
        descripcion_historica: 'Audaces marineros y buceadores de las islas y costas, expertos en pesquería con redes de fibra vegetal y canoas de alta mar.',
        mision_colaborativa: 'Organizar una flotilla pesquera solidaria para proveer de pescado seco y sal a las aldeas del interior.',
        pregunta_reflexion: '¿Cómo el trueque entre pescadores de la costa y agricultores de la montaña beneficiaba a todos?',
        elementos: [
          {
            id: 'viv_costa',
            categoria: 'vivienda',
            titulo: 'Rancherías costeras de caña brava',
            descripcion: 'Estructuras ventiladas con techos de palmeras cocoteras frente a la brisa marina.',
            icono: '🏖️',
            impacto_ubuntu: 'Diseñadas para compartir el espacio de reparación de redes de pesca.'
          },
          {
            id: 'alim_costa',
            categoria: 'alimentacion',
            titulo: 'Pescado asado, mariscos y maíz salado',
            descripcion: 'Salazón y ahumado de carite y jurel para preservar la proteína por meses.',
            icono: '🐟',
            impacto_ubuntu: 'Lo pescado se repartía en partes iguales entre las familias de los buzos y ancianos.'
          },
          {
            id: 'trab_costa',
            categoria: 'trabajo',
            titulo: 'Recolección de sal en Araya y buceo de perlas',
            descripcion: 'Comercio e intercambio de sal marina y conchas ornamentales con los pueblos del interior.',
            icono: '🐚',
            impacto_ubuntu: 'La sal era el bien común que permitía el trueque pacífico con tribus lejanas.'
          },
          {
            id: 'org_costa',
            categoria: 'organizacion',
            titulo: 'Fraternidad de los Navegantes',
            descripcion: 'Capitanes de canoa que se guiaban por la estrella polar y el vuelo de los pelícanos.',
            icono: '⭐',
            impacto_ubuntu: 'Nadie se hacía a la mar solo; siempre navegaban en parejas de embarcaciones para cuidarse.'
          },
          {
            id: 'cre_costa',
            categoria: 'creencias_tecnologia',
            titulo: 'Canto a las olas y gratitud marina',
            descripcion: 'Rituales de agradecimiento al mar antes de echar las redes para no agotar los bancos de peces.',
            icono: '🌊',
            impacto_ubuntu: 'Pesca sostenible: jamás atrapaban crías ni peces en época de desove.'
          }
        ]
      },
      {
        id: 'llanos_arawak',
        nombre: 'Llanos y Sabanas Centrales',
        etapa: 'precolombina',
        region: 'Llanos',
        pueblos_o_personajes: 'Naciones Arawak y Guahibo',
        descripcion_historica: 'Habitantes de las inmensas llanuras donde se alternan meses de sequía ardiente y meses de grandes inundaciones.',
        mision_colaborativa: 'Crear camellones o campos elevados para cultivar aun cuando las sabanas se conviertan en lagunas.',
        pregunta_reflexion: '¿Cómo la resiliencia comunitaria transformó las inundaciones en una ventaja para la siembra?',
        elementos: [
          {
            id: 'viv_llanos',
            categoria: 'vivienda',
            titulo: 'Viviendas sobre montículos elevados',
            descripcion: 'Construcciones sobre colinas artificiales de tierra apisonada para mantenerse a salvo de crecidas.',
            icono: '🏕️',
            impacto_ubuntu: 'Todo el poblado ayudaba a acarrear arcilla para subir el nivel del terreno comunal.'
          },
          {
            id: 'alim_llanos',
            categoria: 'alimentacion',
            titulo: 'Caza de venado, chigüire y raíces silvestres',
            descripcion: 'Recolección de frutos de la palma llanera y pesca en esteros con nasas de mimbre.',
            icono: '🦌',
            impacto_ubuntu: 'La carne de caza se asaba en fogones colectivos para alimentar a toda la comunidad.'
          },
          {
            id: 'trab_llanos',
            categoria: 'trabajo',
            titulo: 'Canales de drenaje y camellones agrícolas',
            descripcion: 'Técnica de ingeniería hidráulica ancestral que acumulaba agua para los meses secos.',
            icono: '🌾',
            impacto_ubuntu: 'Un sistema hidráulico colectivo que ningún individuo podría cavar en soledad.'
          },
          {
            id: 'org_llanos',
            categoria: 'organizacion',
            titulo: 'Alianzas intertribales para el paso estacional',
            descripcion: 'Pactos de libre tránsito entre tribus nómadas y sedentarias para compartir los pastos.',
            icono: '🕊️',
            impacto_ubuntu: 'La hospitalidad llanera: acoger al caminante que cruza la inmensidad de la sabana.'
          },
          {
            id: 'cre_llanos',
            categoria: 'creencias_tecnologia',
            titulo: 'Respeto al espíritu del Viento y del Jaguar',
            descripcion: 'Pinturas rupestres que honraban la fuerza y la velocidad de los guardianes de la llanura.',
            icono: '🐆',
            impacto_ubuntu: 'Aprender de los animales la paciencia y el sigilo para convivir en paz.'
          }
        ]
      },
      {
        id: 'occidente_palafito',
        nombre: 'Occidente y Lago de Maracaibo',
        etapa: 'precolombina',
        region: 'Occidente',
        pueblos_o_personajes: 'Pueblos Añú (Paraujanos) y Caquetíos',
        descripcion_historica: 'Constructores de casas de madera sobre pilotes en el agua dulce del lago, origen del nombre "Venezuela" (Pequeña Venecia).',
        mision_colaborativa: 'Construir una aldea lacustre de palafitos comunicados por puentes de madera de mangle.',
        pregunta_reflexion: '¿Por qué la vida sobre el agua requería una confianza absoluta entre todos los vecinos?',
        elementos: [
          {
            id: 'viv_palafito',
            categoria: 'vivienda',
            titulo: 'Los Palafitos sobre estacas de mangle',
            descripcion: 'Casas sostenidas sobre estacas clavadas en el lecho del lago, con pisos de caña y techos de enea.',
            icono: '🏡',
            impacto_ubuntu: 'Conectadas por pasarelas de madera: los niños corrían de casa en casa sintiéndose en familia.'
          },
          {
            id: 'alim_palafito',
            categoria: 'alimentacion',
            titulo: 'Pesca lacustre, curvinas y cangrejo azul',
            descripcion: 'Atarrayas tejidas a mano y corrales de caña sumergidos para mantener los peces frescos.',
            icono: '🦀',
            impacto_ubuntu: 'El primer lance de red del día se destinaba a las familias de los enfermos o ancianos.'
          },
          {
            id: 'trab_palafito',
            categoria: 'trabajo',
            titulo: 'Tejido de esteras de enea y canoas rápidas',
            descripcion: 'Transformación de las plantas acuáticas en colchonetas frescas para dormir y cestas flotantes.',
            icono: '🛶',
            impacto_ubuntu: 'Las mujeres artesanas cantaban tonadas tradicionales mientras trenzaban la fibra.'
          },
          {
            id: 'org_palafito',
            categoria: 'organizacion',
            titulo: 'Consejo del Pueblo de Agua (Añú)',
            descripcion: 'Gobierno asambleario donde la palabra de la mujer tenía gran peso en la decisión de mudar las casas.',
            icono: '💧',
            impacto_ubuntu: 'Maternidad comunitaria: todas las madres cuidaban a todos los niños de la laguna.'
          },
          {
            id: 'cre_palafito',
            categoria: 'creencias_tecnologia',
            titulo: 'El relámpago nocturno como guía celestial',
            descripcion: 'Conexión con los ciclos eléctricos naturales que purifican la atmósfera sobre la laguna.',
            icono: '⚡',
            impacto_ubuntu: 'Agradecían la luz que disipaba la oscuridad en las noches sin luna.'
          }
        ]
      }
    ]
  },

  {
    id: 'colonial',
    titulo: 'Época Colonial',
    rango_anos: '1498 – 1810',
    lema: 'Tensiones del mestizaje, injusticias del sistema y anhelos de libertad',
    icono: '📜',
    color: 'from-amber-700 to-stone-800',
    resumen: 'Durante tres siglos, Venezuela fue parte del Imperio Español. Se crearon ciudades, haciendas cacaoteras y puertos mercantiles bajo una sociedad dividida en castas desiguales. Fue también la época donde germinó la fuerza del mestizaje y el anhelo de justicia.',
    hito_principal: 'Fundación de Caracas (1567), auge de las haciendas de cacao y surgimiento de las primeras rebeliones por la igualdad (José Leonardo Chirino).',
    zonas: [
      {
        id: 'caracas_colonial',
        nombre: 'Valle de Caracas y Barlovento',
        etapa: 'colonial',
        region: 'Centro',
        pueblos_o_personajes: 'Mantuanos, pardos libres, afrodescendientes esclavizados e indígenas encomendados',
        descripcion_historica: 'Sede de la Capitanía General. Las grandes haciendas de "Gran Cacao" sostenían la economía colonial exportando a México y España.',
        mision_colaborativa: 'Examinar la vida en una hacienda de cacao y proponer cómo transformar las relaciones de opresión en una verdadera convivencia justa.',
        pregunta_reflexion: 'Ubuntu: Si una sociedad excluye o esclaviza a parte de sus integrantes, ¿puede considerarse próspera y humana?',
        elementos: [
          {
            id: 'viv_caracas_col',
            categoria: 'vivienda',
            titulo: 'Casonas de tejas rojas y barracas de peones',
            descripcion: 'Casas coloniales con patios internos para los dueños frente a barracas humildes de los trabajadores.',
            icono: '🏛️',
            impacto_ubuntu: 'Reflexión crítica: La riqueza acumulada contrastaba con la falta de libertad de quienes la producían.'
          },
          {
            id: 'alim_caracas_col',
            categoria: 'alimentacion',
            titulo: 'Cacao fino de aroma, papelón con limón y arepas',
            descripcion: 'El cacao era tan valorado que las semillas se usaban como moneda menuda para el intercambio.',
            icono: '🍫',
            impacto_ubuntu: 'Los afrodescendientes crearon la magia del chocolate caliente y postres compartidos en fiestas clandestinas.'
          },
          {
            id: 'trab_caracas_col',
            categoria: 'trabajo',
            titulo: 'Cosecha, fermentación y secado de cacao',
            descripcion: 'Jornadas de sol a sol en las plantaciones bajo el látigo de los capataces.',
            icono: '🌿',
            impacto_ubuntu: 'Pese al sufrimiento, los trabajadores inventaron cantos de faena colectiva (tonadas) para darse aliento mutuo.'
          },
          {
            id: 'org_caracas_col',
            categoria: 'organizacion',
            titulo: 'El Cabildo colonial y las cofradías de pardos',
            descripcion: 'Los mantuanos gobernaban en el Cabildo; los pardos y negros se organizaban en cofradías religiosas para apoyarse.',
            icono: '👥',
            impacto_ubuntu: 'Las cofradías funcionaban como cajas de ahorro mutuo para comprar la libertad de compañeros esclavizados.'
          },
          {
            id: 'cre_caracas_col',
            categoria: 'creencias_tecnologia',
            titulo: 'Sincretismo: San Juan Bautista y tambores mina',
            descripcion: 'Unión de la fe católica impuesta con la memoria de los dioses africanos y las fuerzas de la naturaleza.',
            icono: '🥁',
            impacto_ubuntu: 'El repique del tambor era un lenguaje secreto de dignidad, resistencia y afirmación humana.'
          }
        ]
      },
      {
        id: 'cumana_colonial',
        nombre: 'Cumaná y Cubagua (Oriente)',
        etapa: 'colonial',
        region: 'Oriente',
        pueblos_o_personajes: 'Primeros frailes dominicos (Bartolomé de las Casas), buceadores guaiqueríes y pescadores',
        descripcion_historica: 'Cumaná, la primogénita del continente americano (1515). La isla de Cubagua fue el epicentro del violento auge de las perlas.',
        mision_colaborativa: 'Apoyar el proyecto pacífico de Fray Bartolomé de las Casas para promover una relación de hermandad y no de conquista.',
        pregunta_reflexion: '¿Por qué la codicia por las perlas destruyó a Cubagua, mientras la amistad fraterna floreció en Cumaná?',
        elementos: [
          {
            id: 'viv_cumana_col',
            categoria: 'vivienda',
            titulo: 'Castillo San Antonio de la Eminencia',
            descripcion: 'Fortalezas de piedra coralina para defender la bahía de los piratas ingleses y franceses.',
            icono: '🏰',
            impacto_ubuntu: 'Muestra la necesidad que tenían los conquistadores de muros por vivir temiendo a los demás.'
          },
          {
            id: 'alim_cumana_col',
            categoria: 'alimentacion',
            titulo: 'Empanadas de cazón, corozo y guarapo de piña',
            descripcion: 'Fusión de la cocina indígena con el trigo traído de España y el ají dulce oriental.',
            icono: '🥟',
            impacto_ubuntu: 'La cocina oriental nació del intercambio generoso de sabores entre tres continentes.'
          },
          {
            id: 'trab_cumana_col',
            categoria: 'trabajo',
            titulo: 'Pesca artesanal con chinchorro playero',
            descripcion: 'Tender la red desde la playa jalada por veinte personas al unísono al grito de ¡hala, hala!',
            icono: '🎣',
            impacto_ubuntu: 'El chinchorro requiere fuerza coordinada: si uno suelta la cuerda, se escapan los peces de todos.'
          },
          {
            id: 'org_cumana_col',
            categoria: 'organizacion',
            titulo: 'Comunidades de pescadores guaiqueríes',
            descripcion: 'Reconocidos como pueblo leal y libre por su conocimiento insustituible de las corrientes marinas.',
            icono: '🧭',
            impacto_ubuntu: 'Defendieron su autonomía comunitaria mediante la negociación y la sabiduría de sus aguas.'
          },
          {
            id: 'cre_cumana_col',
            categoria: 'creencias_tecnologia',
            titulo: 'La Virgen del Valle y la bendición del mar',
            descripcion: 'Protectora de los marineros y símbolo de amparo materno para todos los pueblos del oriente.',
            icono: '⛵',
            impacto_ubuntu: 'En la fiesta patronal, los barcos comparten sus frutos con los más desfavorecidos.'
          }
        ]
      },
      {
        id: 'llanos_colonial',
        nombre: 'Los Hatos de los Llanos',
        etapa: 'colonial',
        region: 'Llanos',
        pueblos_o_personajes: 'Llaneros a caballo, capuchinos misioneros y vaqueros mestizos',
        descripcion_historica: 'Introducción del ganado vacuno y caballar español que se reprodujo en millones por las sabanas abiertas.',
        mision_colaborativa: 'Organizar una recogida comunitaria de ganado (rodeo) respetando los pastos comunales.',
        pregunta_reflexion: '¿Cómo la vida llanera enseñó que la igualdad ante el peligro del río forja lazos más fuertes que cualquier casta?',
        elementos: [
          {
            id: 'viv_llanos_col',
            categoria: 'vivienda',
            titulo: 'Casas de hato con corredores de horcones',
            descripcion: 'Paredes de bahareque fresco y techos de palma con amplios corredores donde colgar los chinchorros.',
            icono: '🛖',
            impacto_ubuntu: 'Cualquier viajero cansado tenía derecho a colgar su hamaca sin pagar nada: ley del llano.'
          },
          {
            id: 'alim_llanos_col',
            categoria: 'alimentacion',
            titulo: 'Carne en vara, queso llanero y casabe',
            descripcion: 'La carne asada a la leña alrededor del fogón donde peones y capataces comían juntos.',
            icono: '🥩',
            impacto_ubuntu: 'Frente al fuego nocturno caían las distinciones: todos cantaban el mismo pasaje con el cuatro.'
          },
          {
            id: 'trab_llanos_col',
            categoria: 'trabajo',
            titulo: 'Lidia a caballo, ordeño y doma de potros',
            descripcion: 'Dominio del caballo y el lazo en terrenos anegados y ríos con caimanes.',
            icono: '🐎',
            impacto_ubuntu: 'Cruzar un río con mil reses requiere sincronía de vida o muerte: un llanero cuida la espalda del otro.'
          },
          {
            id: 'org_llanos_col',
            categoria: 'organizacion',
            titulo: 'La hermandad del rodeo llanero',
            descripcion: 'Compañías de jinetes que elegían a su "cabrestero" no por dinero sino por valentía y justicia.',
            icono: '🤠',
            impacto_ubuntu: 'Surgimiento de un espíritu de libertad e igualdad que luego sería decisivo en la Independencia.'
          },
          {
            id: 'cre_llanos_col',
            categoria: 'creencias_tecnologia',
            titulo: 'Leyendas de espantos y tonadas de ordeño',
            descripcion: 'Cantarle a la vaca por su nombre ("Mariposa", "Nube Blanca") para que dé leche con mansedumbre.',
            icono: '🎶',
            impacto_ubuntu: 'Cuidar al animal con ternura y no con violencia demuestra el alma de un buen cuidador.'
          }
        ]
      }
    ]
  },

  {
    id: 'independencia',
    titulo: 'Gesta de Independencia',
    rango_anos: '1810 – 1823',
    lema: 'Unión, sacrificio heroico y nacimiento de la República libre',
    icono: '⚔️',
    color: 'from-blue-700 to-indigo-900',
    resumen: 'El pueblo venezolano se levantó para romper las cadenas del dominio extranjero. Fueron años de inmensos sacrificios, donde la unión de todas las clases populares (indígenas, pardos, blancos y afrodescendientes) junto a próceres como Bolívar, Sucre y Páez logró la libertad.',
    hito_principal: 'Firma del Acta de Independencia (5 de julio de 1811) y la victoria decisiva en la Batalla de Carabobo (24 de junio de 1821).',
    zonas: [
      {
        id: 'caracas_indep',
        nombre: 'Caracas y la Junta Suprema (1810-1811)',
        etapa: 'independencia',
        region: 'Centro',
        pueblos_o_personajes: 'Simón Bolívar, Francisco de Miranda, Juan Germán Roscio y el pueblo caraqueño',
        descripcion_historica: 'El 19 de abril de 1810 el pueblo dijo ¡No! al Capitán General Emparan. El 5 de julio de 1811 se firmó el Acta que declaró a Venezuela libre y soberana.',
        mision_colaborativa: 'Como diputados patriotas, redactar los artículos que declaran la igualdad de todos los nacidos en esta tierra.',
        pregunta_reflexion: '¿Por qué la libertad verdadera exige abolir los privilegios y tratar a cada persona con igual dignidad?',
        elementos: [
          {
            id: 'viv_indep_caracas',
            categoria: 'vivienda',
            titulo: 'La Sociedad Patriótica y la Plaza Mayor',
            descripcion: 'Lugares de encendidos debates donde jóvenes como Bolívar pedían dar el paso definitivo a la libertad.',
            icono: '🏛️',
            impacto_ubuntu: 'Por primera vez, mujeres patriotas y jóvenes participaban activamente en las asambleas políticas.'
          },
          {
            id: 'alim_indep_caracas',
            categoria: 'alimentacion',
            titulo: 'Raciones solidarias en tiempos de asedio',
            descripcion: 'El pueblo compartía las reservas de harina, granos y papelón durante los bloqueos marítimos.',
            icono: '🥖',
            impacto_ubuntu: 'Las familias abrieron sus despensas para alimentar a los heridos y soldados que defendían la ciudad.'
          },
          {
            id: 'trab_indep_caracas',
            categoria: 'trabajo',
            titulo: 'Imprenta de la Libertad y fundición de cañones',
            descripcion: 'Publicación de "El Correo del Orinoco" y "La Gaceta de Caracas" para difundir las ideas de emancipación.',
            icono: '📰',
            impacto_ubuntu: 'La pluma y las ideas fueron tan poderosas como las espadas para unir a la población.'
          },
          {
            id: 'org_indep_caracas',
            categoria: 'organizacion',
            titulo: 'El Congreso Constituyente de 1811',
            descripcion: 'Primer parlamento de América Latina en proclamar la independencia absoluta de España.',
            icono: '📜',
            impacto_ubuntu: 'Sentó el principio de que el poder emana del pueblo soberano y no de una corona lejana.'
          },
          {
            id: 'cre_indep_caracas',
            categoria: 'creencias_tecnologia',
            titulo: 'La fe en la Justicia y el juramento cívico',
            descripcion: 'Bolívar proclamó: "Si la naturaleza se opone, lucharemos contra ella y haremos que nos obedezca".',
            icono: '🔥',
            impacto_ubuntu: 'La convicción moral colectiva de que la causa de la libertad era justa ante la historia humana.'
          }
        ]
      },
      {
        id: 'llanos_paez',
        nombre: 'Los Llanos y los Bravos de Apure',
        etapa: 'independencia',
        region: 'Llanos',
        pueblos_o_personajes: 'General José Antonio Páez, lanceros de Apure, Pedro Camejo (Negro Primero)',
        descripcion_historica: 'La legendaria caballería llanera armada con lanzas de chuzo. Vencieron en Las Queseras del Medio con el grito de "¡Vuelvan caras!".',
        mision_colaborativa: 'Organizar la logística del ejército patriota: proveer caballos, alimentos y cuidar a las familias que marchan detrás.',
        pregunta_reflexion: 'Pedro Camejo dijo a Páez: "Mi general, vengo a decirle adiós porque estoy muerto". ¿Qué significa dar la vida por los hermanos?',
        elementos: [
          {
            id: 'viv_llanos_indep',
            categoria: 'vivienda',
            titulo: 'Campamentos móviles bajo el cielo estrellado',
            descripcion: 'Vivir a la intemperie cruzando ríos infestados de caribes y atravesando sabanas ardientes.',
            icono: '⛺',
            impacto_ubuntu: 'El general y el soldado raso dormían en el mismo suelo cubiertos por la misma manta.'
          },
          {
            id: 'alim_llanos_indep',
            categoria: 'alimentacion',
            titulo: 'Tasajo seco, agua de tinaja y raíces dulces',
            descripcion: 'Carne deshidratada al sol que los jinetes llevaban debajo de la montura del caballo.',
            icono: '🥩',
            impacto_ubuntu: 'Si escaseaba la comida, el último pedazo de carne seca se partía entre los más jóvenes y heridos.'
          },
          {
            id: 'trab_llanos_indep',
            categoria: 'trabajo',
            titulo: 'Fabricación artesanal de lanzas y monturas',
            descripcion: 'Cortar madera de mora o guayabo y afilar puntas de hierro de viejas rejas para armar al batallón.',
            icono: '🗡️',
            impacto_ubuntu: 'Los herreros y talabarteros del pueblo trabajaban día y noche sin cobrar para equipar al ejército.'
          },
          {
            id: 'org_llanos_indep',
            categoria: 'organizacion',
            titulo: 'La táctica de ¡Vuelvan Caras!',
            descripcion: 'Maniobra de engaño y retirada simulada que requería absoluta confianza colectiva en la orden del líder.',
            icono: '🏇',
            impacto_ubuntu: 'La confianza ciega en los compañeros salvó a 153 jinetes frente a más de 1.000 enemigos.'
          },
          {
            id: 'cre_llanos_indep',
            categoria: 'creencias_tecnologia',
            titulo: 'Lealtad inquebrantable de Pedro Camejo',
            descripcion: 'Esclavizado que se ganó el apodo de "Negro Primero" por ser siempre el primero en la vanguardia defensiva.',
            icono: '🛡️',
            impacto_ubuntu: 'Símbolo del pueblo afrodescendiente que entregó su valor supremo para forjar una patria libre.'
          }
        ]
      },
      {
        id: 'andes_paso',
        nombre: 'Campaña Admirable y el Paso de los Andes',
        etapa: 'independencia',
        region: 'Andes',
        pueblos_o_personajes: 'Simón Bolívar, campesinos andinos, Atanasio Girardot, mujeres patriotas merideñas',
        descripcion_historica: 'La hazaña de cruzar los páramos helados a más de 4.000 metros de altura para liberar a Caracas y luego a la Nueva Granada.',
        mision_colaborativa: 'Coordinar con las comunidades de Mérida y Trujillo el abrigo y rescate de los soldados congelados en el Páramo de Pisba.',
        pregunta_reflexion: '¿Cómo el calor humano y la solidaridad de las familias campesinas salvaron al ejército de morir de frío en las cumbres?',
        elementos: [
          {
            id: 'viv_andes_indep',
            categoria: 'vivienda',
            titulo: 'Refugios de piedra frailejón en el páramo',
            descripcion: 'Cuevas naturales y pequeñas capillas donde amontonarse para compartir el calor corporal.',
            icono: '🏔️',
            impacto_ubuntu: 'Los soldados se abrazaban en filas estrechas para no sucumbir a la hipotermia nocturna.'
          },
          {
            id: 'alim_andes_indep',
            categoria: 'alimentacion',
            titulo: 'Panela caliente con jengibre y papas sancochadas',
            descripcion: 'Bebidas calientes que reanimaban los pulmones y el corazón de los combatientes extenuados.',
            icono: '☕',
            impacto_ubuntu: 'Las mujeres andinas subieron a lomo de mula calderos hirvientes para esperar a la tropa.'
          },
          {
            id: 'trab_andes_indep',
            categoria: 'trabajo',
            titulo: 'Tejido urgente de ruanas de lana y rescate de cañones',
            descripcion: 'Acarrear piezas de artillería sobre barrancos empinados mediante cuerdas trenzadas por doce hombres.',
            icono: '🧶',
            impacto_ubuntu: 'Cada cañón que subía a la cumbre era empujado por brazos campesinos unidos a los soldados.'
          },
          {
            id: 'org_andes_indep',
            categoria: 'organizacion',
            titulo: 'Proclama de "Libertador" en Mérida',
            descripcion: 'El cabildo de Mérida fue el primero en otorgar a Simón Bolívar el glorioso título de Libertador.',
            icono: '🎖️',
            impacto_ubuntu: 'Un reconocimiento otorgado por la admiración popular antes de las grandes victorias.'
          },
          {
            id: 'cre_andes_indep',
            categoria: 'creencias_tecnologia',
            titulo: 'La solidaridad internacional con Haití',
            descripcion: 'El presidente haitiano Alexandre Pétion prestó barcos, armas y dinero a cambio de una sola promesa: libertar a los esclavizados.',
            icono: '🤝',
            impacto_ubuntu: 'Ubuntu planetario: Haití ayudó a Venezuela sin pedir territorio ni dinero, solo libertad para los oprimidos.'
          }
        ]
      }
    ]
  },

  {
    id: 'federacion',
    titulo: 'Época de la Federación y Modernización',
    rango_anos: '1830 – 1899',
    lema: 'Lucha por la tierra justa, abolición de la esclavitud y educación pública popular',
    icono: '🚂',
    color: 'from-emerald-700 to-teal-900',
    resumen: 'Tras la separación de la Gran Colombia, Venezuela vivió una intensa búsqueda de equilibrio entre regiones y centro. Se abolió definitivamente la esclavitud en 1854, estalló la Guerra Federal al grito de "¡Hombres libres, tierras y hombres libres!" y Guzmán Blanco impulsó el ferrocarril y la educación primaria pública y obligatoria.',
    hito_principal: 'Decreto de Abolición de la Esclavitud (1854), Guerra Federal (1859-1863) y Decreto de Instrucción Pública Gratuita de 1870.',
    zonas: [
      {
        id: 'coro_guerra_federal',
        nombre: 'Coro y los Llanos de Zamora',
        etapa: 'federacion',
        region: 'Occidente',
        pueblos_o_personajes: 'Ezequiel Zamora, campesinos sin tierra, Juan Crisóstomo Falcón',
        descripcion_historica: 'El 20 de febrero de 1859 estalló en Coro la Revolución Federal. El General del Pueblo Soberano, Ezequiel Zamora, encabezó la demanda de tierras para quienes las trabajan.',
        mision_colaborativa: 'Redactar un acuerdo de reconciliación entre campesinos y terratenientes para garantizar justicia agraria y paz.',
        pregunta_reflexion: 'Zamora decía: "Tierras y hombres libres, elección popular y horror a la oligarquía". ¿Cómo sembramos justicia sin odio?',
        elementos: [
          {
            id: 'viv_fed_zamora',
            categoria: 'vivienda',
            titulo: 'Caseríos campesinos y hatos comunales',
            descripcion: 'Viviendas sencillas rodeadas de huertos donde las familias cultivaban su propio sustento.',
            icono: '🏡',
            impacto_ubuntu: 'El valor de la tierra no era el lucro personal, sino alimentar a la comunidad.'
          },
          {
            id: 'alim_fed_zamora',
            categoria: 'alimentacion',
            titulo: 'Caraotas con queso duro, topocho y plátano maduro',
            descripcion: 'La comida popular que alimentó las columnas federales a lo largo de cinco años de contienda.',
            icono: '🍲',
            impacto_ubuntu: 'Compartir la olla comunitaria fortalecía el sentido de hermandad campesina.'
          },
          {
            id: 'trab_fed_zamora',
            categoria: 'trabajo',
            titulo: 'Abolición de la esclavitud (1854)',
            descripcion: 'El presidente José Gregorio Monagas decreta el fin legal de la esclavitud en Venezuela.',
            icono: '⛓️',
            impacto_ubuntu: 'Paso histórico indispensable: ningún ser humano puede ser propiedad de otro.'
          },
          {
            id: 'org_fed_zamora',
            categoria: 'organizacion',
            titulo: 'El Tratado de Coche (1863)',
            descripcion: 'Pacto de paz que puso fin a la Guerra Federal mediante el diálogo entre las partes en pugna.',
            icono: '🤝',
            impacto_ubuntu: 'Demostró que el diálogo sincero es el único camino para detener el dolor de una guerra.'
          },
          {
            id: 'cre_fed_zamora',
            categoria: 'creencias_tecnologia',
            titulo: 'Canciones populares: "Oligarcas temblad"',
            descripcion: 'Coplas llaneras que cantaban la esperanza de un país donde nadie fuera humillado por su origen humilde.',
            icono: '🪕',
            impacto_ubuntu: 'La música como expresión de la dignidad de los más humildes.'
          }
        ]
      },
      {
        id: 'caracas_guzman',
        nombre: 'Caracas y la Modernización Guzmán',
        etapa: 'federacion',
        region: 'Centro',
        pueblos_o_personajes: 'Antonio Guzmán Blanco, maestros de escuela, ingenieros de ferrocarriles',
        descripcion_historica: 'Transformación urbana de Caracas inspirada en París (Teatro Municipal, Capitolio Federal, Panteón Nacional) y la llegada del telégrafo y los trenes.',
        mision_colaborativa: 'Diseñar la primera red de escuelas primarias públicas para que todos los niños de Venezuela aprendan a leer gratis.',
        pregunta_reflexion: '¿Por qué el Decreto de Instrucción Pública Gratuita de 1870 es considerado el regalo más valioso para la infancia venezolana?',
        elementos: [
          {
            id: 'viv_fed_caracas',
            categoria: 'vivienda',
            titulo: 'Escuelas Federales y bulevares iluminados',
            descripcion: 'Primeras escuelas públicas con pupitres de madera, pizarrones de tiza y mapas de la república.',
            icono: '🏫',
            impacto_ubuntu: 'El saber dejó de ser un privilegio de pocos para convertirse en derecho de todos.'
          },
          {
            id: 'alim_fed_caracas',
            categoria: 'alimentacion',
            titulo: 'El auge del café con leche y pan dulce',
            descripcion: 'Las haciendas andinas y centrales exportaban el mejor café del mundo por el puerto de La Guaira.',
            icono: '☕',
            impacto_ubuntu: 'El café unió a las familias en tertulias matutinas donde se discutían las noticias.'
          },
          {
            id: 'trab_fed_caracas',
            categoria: 'trabajo',
            titulo: 'El Gran Ferrocarril de Venezuela y el telégrafo',
            descripcion: 'Vías férreas que atravesaban montañas uniendo Caracas con Valencia y los valles agrícolas.',
            icono: '🚂',
            impacto_ubuntu: 'Las regiones aisladas se conectaron en pocas horas: el país empezó a sentirse un solo cuerpo.'
          },
          {
            id: 'org_fed_caracas',
            categoria: 'organizacion',
            titulo: 'Decreto de Instrucción Pública de 1870',
            descripcion: 'Ley que obligó al Estado a financiar la educación primaria para varones y hembras por igual.',
            icono: '📚',
            impacto_ubuntu: 'La ignorancia retrocedió y miles de niños campesinos e hijos de artesanos aprendieron a escribir.'
          },
          {
            id: 'cre_fed_caracas',
            categoria: 'creencias_tecnologia',
            titulo: 'El Panteón Nacional y el culto a los libertadores',
            descripcion: 'Consagración de la memoria de Bolívar y los héroes como brújula cívica para las nuevas generaciones.',
            icono: '🏛️',
            impacto_ubuntu: 'Recordar los sacrificios colectivos del pasado inspira a cuidar la nación presente.'
          }
        ]
      }
    ]
  },

  {
    id: 'actualidad',
    titulo: 'Actualidad y Construcción del Futuro',
    rango_anos: 'Siglos XX – XXI',
    lema: 'Democracia, ciencia, riqueza natural, desafíos y sueños compartidos',
    icono: '🌱',
    color: 'from-teal-600 to-cyan-800',
    resumen: 'Con la aparición del petróleo en el pozo Zumaque I (1914), Venezuela pasó de ser rural a urbana. Superó dictaduras para conquistar la democracia en 1958, construyó la represa hidroeléctrica del Guri y universidades. Hoy enfrenta retos económicos y ecológicos donde la solidaridad, la ciencia y la unión de 4to grado diseñan un futuro brillante.',
    hito_principal: 'Nacionalización del petróleo (1976), energía limpia del Guri y la nueva conciencia ecológica comunitaria.',
    zonas: [
      {
        id: 'zulia_energia',
        nombre: 'Zulia: El Lago, la Energía y la Reconciliación Ambiental',
        etapa: 'actualidad',
        region: 'Zulia',
        pueblos_o_personajes: 'Pobladores ribereños, científicos ambientales, niños guardianes del Lago',
        descripcion_historica: 'Cuna del petróleo venezolano bajo el Puente sobre el Lago. Enfrenta hoy el desafío de sanar el Lago de Maracaibo de derrames y microalgas (lemna).',
        mision_colaborativa: 'Diseñar un plan ecológico comunitario para descontaminar las orillas del lago y promover energía solar.',
        pregunta_reflexion: '¿Cómo podemos cuidar nuestras fuentes de agua dulce mientras usamos la tecnología para dar energía limpia a las escuelas?',
        elementos: [
          {
            id: 'viv_act_zulia',
            categoria: 'vivienda',
            titulo: 'Casas bioclimáticas con paneles solares',
            descripcion: 'Viviendas frescas que aprovechan el sol brillante del Zulia para generar electricidad limpia sin contaminar.',
            icono: '☀️',
            impacto_ubuntu: 'Las familias comparten la energía del tejado con el dispensario médico vecino.'
          },
          {
            id: 'alim_act_zulia',
            categoria: 'alimentacion',
            titulo: 'Plátano verde en patacón, mandocas y cacao porcelana',
            descripcion: 'Riqueza gastronómica zuliana combinada con huertos urbanos escolares.',
            icono: '🍌',
            impacto_ubuntu: 'Los huertos en las escuelas enseñan a producir alimentos sanos sin pesticidas químicos.'
          },
          {
            id: 'trab_act_zulia',
            categoria: 'trabajo',
            titulo: 'Científicos del Lago y recicladores de polímeros',
            descripcion: 'Brigadas juveniles que limpian las playas y usan bacterias beneficiosas para disolver residuos de hidrocarburos.',
            icono: '🔬',
            impacto_ubuntu: 'Ciencia con vocación social: la inteligencia de la universidad al servicio de la salud de las comunidades.'
          },
          {
            id: 'org_act_zulia',
            categoria: 'organizacion',
            titulo: 'Comités de Cuenca y Asambleas de Vecinos',
            descripcion: 'Reuniones donde pescadores artesanales y jóvenes planifican la veda pesquera para recuperar las corvinas.',
            icono: '🗣️',
            impacto_ubuntu: 'Cuando el pueblo decide en consenso, las soluciones perduran en el tiempo.'
          },
          {
            id: 'cre_act_zulia',
            categoria: 'creencias_tecnologia',
            titulo: 'La Gaita como crónica social y alegría compartida',
            descripcion: 'Cantos de furro y tambora que reclaman justicia social y celebran el amor por la tierra zuliana.',
            icono: '🪘',
            impacto_ubuntu: 'Cantar juntos une los corazones y disuelve las diferencias.'
          }
        ]
      },
      {
        id: 'guayana_ecologia',
        nombre: 'Guayana: Represa del Guri y Protección del Macizo Guayanés',
        etapa: 'actualidad',
        region: 'Guayana',
        pueblos_o_personajes: 'Ingenieros hidroeléctricos, guardaparques, comunidades Pemón de Canaima',
        descripcion_historica: 'El río Caroní genera más del 70% de la electricidad de todo el país a través de la central Simón Bolívar (Guri). Es hogar del Salto Ángel (Kerepakupai Vená) y una de las reservas de agua dulce más grandes del mundo.',
        mision_colaborativa: 'Crear un pacto de protección de la selva y el agua que asegure luz para las ciudades sin destruir la biodiversidad.',
        pregunta_reflexion: 'Los Pemón dicen: "La selva no nos pertenece, nosotros pertenecemos a la selva". ¿Cómo aplicamos esto en nuestra vida diaria?',
        elementos: [
          {
            id: 'viv_act_guayana',
            categoria: 'vivienda',
            titulo: 'Eco-aldeas turísticas sostenibles',
            descripcion: 'Posadas construidas con materiales reciclados que no alteran el curso de las cascadas naturales.',
            icono: '🏕️',
            impacto_ubuntu: 'Los ingresos del turismo se reparten para mejorar las escuelas y ambulatorios indígenas.'
          },
          {
            id: 'alim_act_guayana',
            categoria: 'alimentacion',
            titulo: 'Copoazú, arazá, casabe y agua pura de manantial',
            descripcion: 'Frutos amazónicos supernutritivos que se cosechan sin talar ni un solo árbol de la selva.',
            icono: '🥭',
            impacto_ubuntu: 'Bioeconomía: cuidar el bosque vivo genera más salud y bienestar que destruirlo.'
          },
          {
            id: 'trab_act_guayana',
            categoria: 'trabajo',
            titulo: 'Ingeniería verde y Guardianes de Parques Nacionales',
            descripcion: 'Monitoreo satelital de la deforestación y reforestación con drones de semillas nativas.',
            icono: '🛰️',
            impacto_ubuntu: 'Jóvenes de 4to grado apadrinan hectáreas del bosque para vigilar su crecimiento.'
          },
          {
            id: 'org_act_guayana',
            categoria: 'organizacion',
            titulo: 'Círculo de Sabiduría Ancestral y Científica',
            descripcion: 'Diálogo permanente entre botánicos de laboratorios y ancianos chamanes pemones.',
            icono: '🌿',
            impacto_ubuntu: 'La verdadera sabiduría nace cuando la ciencia moderna escucha con humildad a los abuelos originarios.'
          },
          {
            id: 'cre_act_guayana',
            categoria: 'creencias_tecnologia',
            titulo: 'Paz ambiental y defensa del Kerepakupai Vená',
            descripcion: 'Compromiso ético de mantener el Salto Ángel libre de contaminación y minería ilegal.',
            icono: '🏞️',
            impacto_ubuntu: 'Custodiar la belleza sagrada de Venezuela para los niños del siglo XXII.'
          }
        ]
      },
      {
        id: 'caracas_futuro',
        nombre: 'Caracas Metropolitana y Ciudades Inteligentes Solidarias',
        etapa: 'actualidad',
        region: 'Centro',
        pueblos_o_personajes: 'Estudiantes de 4to grado, maestras innovadoras, brigadas de salud comunitaria',
        descripcion_historica: 'El gran valle custodiado por el Parque Nacional Waraira Repano (El Ávila). Un espacio de encuentro de venezolanos de todas las regiones.',
        mision_colaborativa: 'Construir una escuela del futuro con techos verdes, robótica educativa y banco de solidaridad estudiantil.',
        pregunta_reflexion: '¿Cómo el espíritu Ubuntu "Soy porque somos" puede transformar a nuestra escuela en el lugar más feliz del barrio?',
        elementos: [
          {
            id: 'viv_act_caracas',
            categoria: 'vivienda',
            titulo: 'Aulas abiertas y techos verdes en los techos',
            descripcion: 'Espacios iluminados con sol donde se estudia rodeados de plantas aromáticas y huertos verticales.',
            icono: '🏫',
            impacto_ubuntu: 'Los niños cosechan lechugas y tomates para compartir con el comedor escolar.'
          },
          {
            id: 'alim_act_caracas',
            categoria: 'alimentacion',
            titulo: 'Desayunos escolares balanceados y frutas locales',
            descripcion: 'Mango de hilacha, guayaba, cambur titiaro y arepas de maíz tierno para crecer fuertes.',
            icono: '🍎',
            impacto_ubuntu: 'Nadie se queda sin desayunar: si a un amigo se le olvidó la merienda, tres amigos le convidan.'
          },
          {
            id: 'trab_act_caracas',
            categoria: 'trabajo',
            titulo: 'Laboratorios de Creatividad, Programación y Arte',
            descripcion: 'Aprender ciencias de la computación creando juegos colaborativos como Ubuntu Quest.',
            icono: '💻',
            impacto_ubuntu: 'Usar la tecnología para conectar a las personas y nunca para aislarnos de los demás.'
          },
          {
            id: 'org_act_caracas',
            categoria: 'organizacion',
            titulo: 'Asambleas de Niños y Mediadores de Paz',
            descripcion: 'Comités de alumnos que resuelven los desacuerdos del recreo mediante el diálogo y el abrazo.',
            icono: '🕊️',
            impacto_ubuntu: 'Aprender a escuchar antes de juzgar: el corazón de la convivencia pacífica.'
          },
          {
            id: 'cre_act_caracas',
            categoria: 'creencias_tecnologia',
            titulo: 'El Abrazo del Ávila y la Esperanza en Venezuela',
            descripcion: 'Mirar la montaña verde cada mañana recordando que somos herederos de un país hermoso y lleno de gente buena.',
            icono: '⛰️',
            impacto_ubuntu: 'Tener fe en nuestro país y en nuestras propias capacidades para construir un mundo más solidario.'
          }
        ]
      }
    ]
  }
];
