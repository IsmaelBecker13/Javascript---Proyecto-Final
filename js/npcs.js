import { sprites } from "./sprites.js";
import { maps } from "./maps.js";
export const npcs = {
  npcMama: {
    id: 1,
    name: "Mama",
    spritesSet: {
      stand: sprites.spriteMamaStand,
    },
  },

  npcPlayerWarning: {
    id: 2,
    name: "Advertencia",
    spritesSet: {},
  },

  npcProfesorOak: {
    id: 3,
    name: "Profesor Oak",
    spritesSet: {
      stand: sprites.spriteProfesorOakStand,
    },
  },

  npcVendedor: {
    id: 4,
    name: "Vendedor",
    spritesSet: {
      stand: sprites.spriteVendedorStand,
    },
  },

  npcEntrenadorJavier: {
    id: 5,
    name: "Entrenador Javier",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadorJavierStand,
    },
    battle: {
      pokemonOptions: [
        { pokemon: "abra", level: 5, maxhp: 100, physicalAtk: 50, physicalDef: 50, specialAtk: 50, specialDef: 50, hp: 100, accuracy: 80, priority: 50 },
      ],
      winMoney: 100,
      loseMoney: 0,
    },
  },

  npcEntrenadoraFanny: {
    id: 6,
    name: "Entrenadora Fanny",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadoraFannyStand,
    },
    battle: {
      pokemonOptions: ["cubone"],
    },
  },

  npcEntrenadorIsmael: {
    id: 7,
    name: "Entrenador Ismael",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadorIsmaelStand,
    },
    battle: {
      pokemonOptions: ["machop"],
    },
  },

  npcEntrenadoraEma: {
    id: 8,
    name: "Entrenadora Ema",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadoraEmaStand,
    },
    battle: {
      pokemonOptions: ["ponyta"],
    },
  },

  npcEntrenadorJoaquin: {
    id: 9,
    name: "Entrenador Joaquin",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadorJoaquinStand,
    },
    battle: {
      pokemonOptions: ["geodude", "bellsprout", "magenmite", "seel"],
    },
  },

  npcEntrenadoraSofia: {
    id: 10,
    name: "Entrenadora Sofia",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadoraSofiaStand,
    },
    battle: {
      pokemonOptions: ["gastly", "abra", "bellsprout", "ponyta"],
    },
  },

  npcEntrenadoraJenny: {
    id: 11,
    name: "Entrenadora Jenny",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadoraJennyStand,
    },
    battle: {
      pokemonOptions: ["abra", "cubone", "nidoran"],
    },
  },

  npcEntrenadorJose: {
    id: 12,
    name: "Entrenador Jose",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteEntrenadorJoseStand,
    },
    battle: {
      pokemonOptions: ["abra", "jynx", "bellsprout"],
    },
  },

  npcLiderDelGimnasioJuan: {
    id: 13,
    name: "Lider del Gimnasio Juan",
    type: "battle",
    spritesSet: {
      stand: sprites.spriteLiderDelGimnasioJuanStand,
    },
    battle: {
      pokemonOptions: ["geodude", "gastly", "ponyta"],
    },
  },
};
export const attacks = {
  tackle: {
    name: "Placaje",
    damage: 5,
    uses: 15,
    accuracy: 95,
    description: "Golpe físico básico.",
    strongAgainst: [],
    effect: null,
  },

  scratch: {
    name: "Arañazo",
    damage: 6,
    uses: 15,
    accuracy: 100,
    description: "Golpe físico de daño moderado.",
    strongAgainst: [],
    effect: null,
  },

  quickAttack: {
    name: "Ataque rápido",
    damage: 5,
    uses: 15,
    accuracy: 100,
    description: "Tiene prioridad adicional y suele atacar primero.",
    strongAgainst: [],
    effect: "first",
  },

  growl: {
    name: "Gruñido",
    damage: 0,
    uses: 15,
    accuracy: 100,
    description: "No causa daño; reduce en 10 el ataque físico rival.",
    strongAgainst: [],
    effect: "weaken",
  },

  ember: {
    name: "Ascuas",
    damage: 6,
    uses: 12,
    accuracy: 100,
    description: "Añade 2 de daño y es fuerte contra Planta y Bicho.",
    strongAgainst: ["Planta", "Bicho"],
    effect: "burn",
  },

  waterGun: {
    name: "Pistola agua",
    damage: 6,
    uses: 12,
    accuracy: 100,
    description: "Es fuerte contra Fuego, Tierra y Roca.",
    strongAgainst: ["Fuego", "Tierra", "Roca"],
    effect: null,
  },

  vineWhip: {
    name: "Látigo cepa",
    damage: 6,
    uses: 10,
    accuracy: 100,
    description: "Es fuerte contra Agua, Tierra y Roca.",
    strongAgainst: ["Agua", "Tierra", "Roca"],
    effect: null,
  },

  razorLeaf: {
    name: "Hoja afilada",
    damage: 8,
    uses: 10,
    accuracy: 95,
    description: "Duplica el daño y es fuerte contra Agua, Tierra y Roca.",
    strongAgainst: ["Agua", "Tierra", "Roca"],
    effect: "critical",
  },

  thunderShock: {
    name: "Impactrueno",
    damage: 6,
    uses: 12,
    accuracy: 100,
    description: "Paraliza al rival y es fuerte contra Agua y Volador.",
    strongAgainst: ["Agua", "Volador"],
    effect: "paralyze",
  },

  confusion: {
    name: "Confusión",
    damage: 7,
    uses: 12,
    accuracy: 100,
    description: "Es fuerte contra Lucha y Veneno.",
    strongAgainst: ["Lucha", "Veneno"],
    effect: null,
  },

  bite: {
    name: "Mordisco",
    damage: 7,
    uses: 12,
    accuracy: 100,
    description: "Hace retroceder al rival, que pierde su próxima acción.",
    strongAgainst: ["Psíquico", "Fantasma"],
    effect: "stagger",
  },

  tailWhip: {
    name: "Látigo",
    damage: 0,
    uses: 15,
    accuracy: 100,
    description: "No causa daño; reduce en 10 la defensa física rival.",
    strongAgainst: [],
    effect: "weakenDefense",
  },
};
export const npcsDialogues = {
  dialogue1: {
    npc: npcs.npcMama,
    sprite: npcs.npcMama.spritesSet.stand,
    stages: [1, 1],
    strings: [
      {
        mode: "lecture",
        string: "En fin... los hijos en algún momento deben partir.",
      },
      { mode: "lecture", string: "¡Te extrañaré tanto!" },
      { mode: "lecture", string: "Ten mucho cuidado, hijo mío..." },
    ],
    map: maps.playerHouseLow,
    x: 1,
    y: 4,
    endAction: "increase",
    trigger: "auto",
  },

  dialogue2: {
    npc: npcs.npcMama,
    sprite: npcs.npcMama.spritesSet.stand,
    stages: [2, 2],
    strings: [
      {
        mode: "lecture",
        string:
          "El Laboratorio del Profesor Oak está a la vuelta de la esquina!",
      },
    ],
    map: maps.playerHouseLow,
    x: 1,
    y: 4,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue3: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 2],
    strings: [
      { mode: "lecture", string: "Antes debo visitar al Profesor Oak!" },
    ],
    map: maps.palletTown,
    x: 12,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue4: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 2],
    strings: [
      { mode: "lecture", string: "Antes debo visitar al Profesor Oak!" },
    ],
    map: maps.palletTown,
    x: 13,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue5: {
    npc: npcs.npcProfesorOak,
    sprite: npcs.npcProfesorOak.spritesSet.stand,
    stages: [1, 2],
    strings: [
      { mode: "lecture", string: "Hola, Bienvenido a mi Laboratorio" },
      {
        mode: "lecture",
        string: "Soy el Profesor Oak... y  he dedicado mi vida a los Pokemones",
      },
      {
        mode: "lecture",
        string: "He estado esperandote para poder obsequiarte uno de ellos!",
      },
      {
        mode: "question",
        string: "Elige el que se adecue mejor a tu estilo.",
        options: ["Charmander", "Bulbasaur", "Squirtle"],
      },
      {
        mode: "lecture",
        string: "Buena eleccion! Ahora quiero pedirte un favor.",
      },
      {
        mode: "lecture",
        string: "En la tienda de Ciudad Verde tienen un paquete para mí.",
      },
      { mode: "lecture", string: "Ve por la Ruta 1, recógelo y tráemelo." },
      {
        mode: "lecture",
        string: "Después estarás listo para comenzar tu viaje.",
      },
    ],
    map: maps.oakLab,
    x: 6,
    y: 4,
    endAction: "jump to",
    newStage: 3,
    trigger: "auto",
  },

  dialogue6: {
    npc: npcs.npcProfesorOak,
    sprite: npcs.npcProfesorOak.spritesSet.stand,
    stages: [3, 3],
    strings: [
      {
        mode: "lecture",
        string: "Ciudad Verde queda luego de cruzar la Ruta 1.",
      },
      { mode: "lecture", string: "Necesito que traigas el paquete por favor!" },
    ],
    map: maps.oakLab,
    x: 6,
    y: 4,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue7: {
    npc: npcs.npcVendedor,
    sprite: npcs.npcVendedor.spritesSet.stand,
    stages: [3, 3],
    strings: [
      {mode: "lecture", string: "Hola, viajero! Como estas?"},
      {mode: "lecture", string: "El Profesor Oak me dijo que vendrias!"},
      {mode: "lecture", string: "Este es el paquete que debes entregarle de mi parte..."},
      {mode: "lecture", string: "Ten cuidado, es muy fragil!"},
      {mode: "lecture", string: "Que te vaya bien, ve con cuidado."},
    ],
    map: maps.pokeMarket,
    x: 5,
    y: 4,
    endAction: "increase",
    trigger: "auto",
  },

  dialogue8: {
    npc: npcs.npcVendedor,
    sprite: npcs.npcVendedor.spritesSet.stand,
    stages: [4, 4],
    strings: [
      {mode: "lecture", string: "Entrega el paquete al profesor Oak."},
      {mode: "lecture", string: "Esta en su laboratorio de Pueblo Paleta"},
    ],
    map: maps.pokeMarket,
    x: 5,
    y: 4,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue9: {
    npc: npcs.npcProfesorOak,
    sprite: npcs.npcProfesorOak.spritesSet.stand,
    stages: [4, 4],
    strings: [
      {mode: "lecture", string: "Trajiste el paquete que te pedi?"},
      {mode: "lecture", string: "Perfecto! Muchisimas gracias..."},
      {mode: "lecture", string: "Justamente se trata de algo que te ayudará en tu aventura..."},
      {mode: "lecture", string: "Es una PokeDex y sirve para registrar los Pokemones..."},
      {mode: "lecture", string: "Y para enviarmelos a mi, y que pueda estudiarlos."},
      {mode: "lecture", string: "Además te obsequio las PokeBalls..."},
      {mode: "lecture", string: "Son usadas para poder capturar a Pokemones salvajes!"},
      {mode: "lecture", string: "Ahora sí, estas listo para llegar hasta Ciudad Plateada."},
    ],
    map: maps.oakLab,
    x: 6,
    y: 6,
    endAction: "jump to",
    newStage: 5,
    trigger: "auto",
  },

  dialogue10: {
    npc: npcs.npcProfesorOak,
    sprite: npcs.npcProfesorOak.spritesSet.stand,
    stages: [5, 5],
    strings: [
      {mode: "lecture", string: "Ve a Ciudad Plateada y gana la medalla Pokemon!"},
    ],
    map: maps.oakLab,
    x: 6,
    y: 6,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue11: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 5],
    strings: [
      {mode: "lecture", string: "Aun no tienes las medallas suficientes"},
      {mode: "lecture", string: "Como para competir en este Gimnasio!"},
    ],
    map: maps.viridianCity,
    x: 36,
    y: 10,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue12: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 4],
    strings: [
      {mode: "lecture", string: "Aun debes entregar el Paquete al Profesor Oak"},
    ],
    map: maps.viridianCity,
    x: 19,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue13: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 4],
    strings: [
      {mode: "lecture", string: "Aun debes entregar el Paquete al Profesor Oak"},
    ],
    map: maps.viridianCity,
    x: 20,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue14: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 4],
    strings: [
      {mode: "lecture", string: "Aun debes entregar el Paquete al Profesor Oak"},
    ],
    map: maps.viridianCity,
    x: 21,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue15: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 4],
    strings: [
      {mode: "lecture", string: "Aun debes entregar el Paquete al Profesor Oak"},
    ],
    map: maps.viridianCity,
    x: 22,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue16: {
    npc: npcs.npcPlayerWarning,
    stages: [1, 4],
    strings: [
      {mode: "lecture", string: "Aun debes entregar el Paquete al Profesor Oak"},
    ],
    map: maps.viridianCity,
    x: 23,
    y: 0,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue17: {
    npc: npcs.npcEntrenadorJavier,
    sprite: npcs.npcEntrenadorJavier.spritesSet.stand,
    stages: [1, 3],
    strings: [
      {mode: "lecture", string: "Te ganaré facilmente!"},
    ],
    map: maps.route01,
    x: 7,
    y: 30,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue18: {
    npc: npcs.npcEntrenadoraFanny,
    sprite: npcs.npcEntrenadoraFanny.spritesSet.stand,
    stages: [1, 5],
    strings: [
      {mode: "lecture", string: "Tengo cuentas pendientes contigo!"},
    ],
    map: maps.route01,
    x: 10,
    y: 21,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue19: {
    npc: npcs.npcEntrenadorIsmael,
    sprite: npcs.npcEntrenadorIsmael.spritesSet.stand,
    stages: [1, 5],
    strings: [
      {mode: "lecture", string: "Quisiera saber qué tan bueno soy..."},
    ],
    map: maps.route01,
    x: 17,
    y: 12,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue20: {
    npc: npcs.npcEntrenadoraEma,
    sprite: npcs.npcEntrenadoraEma.spritesSet.stand,
    stages: [1, 5],
    strings: [
      {mode: "lecture", string: "Mi Ponyta te vencerá facilmente..."},
    ],
    map: maps.route01,
    x: 13,
    y: 3,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue21: {
    npc: npcs.npcEntrenadorJoaquin,
    sprite: npcs.npcEntrenadorJoaquin.spritesSet.stand,
    stages: [1, 7],
    strings: [
      {mode: "lecture", string: "Que onda? Quieres una batalla?"},
    ],
    map: maps.route02,
    x: 10,
    y: 71,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue22: {
    npc: npcs.npcEntrenadoraSofia,
    sprite: npcs.npcEntrenadoraSofia.spritesSet.stand,
    stages: [1, 8],
    strings: [
      {mode: "lecture", string: "Me caes mal..."},
    ],
    map: maps.route02,
    x: 9,
    y: 10,
    endAction: "keep",
    trigger: "auto",
  },

  dialogue23: {
    npc: npcs.npcEntrenadoraJenny,
    stages: [5, 5],
    strings: [
      {mode: "lecture", string: "Para ganar la medalla, primero debes ganarme a mi!"},
    ],
    map: maps.pewterCityGym,
    x: 6,
    y: 11,
    endAction: "increase",
    trigger: "auto",
  },

  dialogue24: {
    npc: npcs.npcEntrenadorJose,
    sprite: npcs.npcEntrenadorJose.spritesSet.stand,
    stages: [6, 6],
    strings: [
      {mode: "lecture", string: "Aun te falta mucho..."},
    ],
    map: maps.pewterCityGym,
    x: 6,
    y: 8,
    endAction: "increase",
    trigger: "auto",
  },

  dialogue25: {
    npc: npcs.npcLiderDelGimnasioJuan,
    sprite: npcs.npcLiderDelGimnasioJuan.spritesSet.stand,
    stages: [7, 7],
    strings: [
      {mode: "lecture", string: "No cantes victoria..."},
    ],
    map: maps.pewterCityGym,
    x: 6,
    y: 6,
    endAction: "increase",
    trigger: "auto",
  },
};

export const pokemons = {
  charmander: {
    name: "Charmander",
    attacks: [attacks.scratch, attacks.ember, attacks.growl, attacks.quickAttack],
    type: "Fuego",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Charmander/charmanderFront.png",
    spriteBack: "assets/sprites/Pokemons/Charmander/charmanderBack.png",
  },
  bulbasaur: {
    name: "Bulbasaur",
    attacks: [attacks.tackle, attacks.vineWhip, attacks.razorLeaf, attacks.growl],
    type: "Planta",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Bulbasaur/bulbasaurFront.png",
    spriteBack: "assets/sprites/Pokemons/Bulbasaur/bulbasaurBack.png",
  },
  squirtle: {
    name: "Squirtle",
    attacks: [attacks.tackle, attacks.waterGun, attacks.bite, attacks.tailWhip],
    type: "Agua",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Squirtle/squirtleFront.png",
    spriteBack: "assets/sprites/Pokemons/Squirtle/squirtleBack.png",
  },

  pidgey: {
    name: "Pidgey",
    attacks: [attacks.tackle, attacks.quickAttack, attacks.growl, attacks.tailWhip],
    type: "Volador",
    map: [maps.route01],
    spriteFront: "assets/sprites/Pokemons/Pidgey/pidgeyFront.png",
    spriteBack: "assets/sprites/Pokemons/Pidgey/pidgeyBack.png",
  },

  rattata: {
    name: "Rattata",
    attacks: [attacks.tackle, attacks.quickAttack, attacks.bite, attacks.tailWhip],
    type: "Normal",
    map: [maps.route01],
    spriteFront: "assets/sprites/Pokemons/Rattata/rattataFront.png",
    spriteBack: "assets/sprites/Pokemons/Rattata/rattataBack.png",
  },

  spearow: {
    name: "Spearow",
    attacks: [attacks.tackle, attacks.quickAttack, attacks.bite, attacks.growl],
    type: "Volador",
    map: [maps.route01],
    spriteFront: "assets/sprites/Pokemons/Spearow/spearowFront.png",
    spriteBack: "assets/sprites/Pokemons/Spearow/spearowBack.png",
  },

  nidoran: {
    name: "Nidoran",
    attacks: [attacks.scratch, attacks.tailWhip, attacks.bite, attacks.growl],
    type: "Veneno",
    map: [maps.route01],
    spriteFront: "assets/sprites/Pokemons/Nidoran/nidoranFront.png",
    spriteBack: "assets/sprites/Pokemons/Nidoran/nidoranBack.png",
  },

  abra: {
    name: "Abra",
    attacks: [attacks.confusion, attacks.growl, attacks.tackle, attacks.quickAttack],
    type: "Psíquico",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Abra/abraFront.png",
    spriteBack: "assets/sprites/Pokemons/Abra/abraBack.png",
  },

  machop: {
    name: "Machop",
    attacks: [attacks.scratch, attacks.tackle, attacks.bite, attacks.growl],
    type: "Lucha",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Machop/machopFront.png",
    spriteBack: "assets/sprites/Pokemons/Machop/machopBack.png",
  },

  ponyta: {
    name: "Ponyta",
    attacks: [attacks.scratch, attacks.quickAttack, attacks.ember, attacks.growl],
    type: "Fuego",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Ponyta/ponytaFront.png",
    spriteBack: "assets/sprites/Pokemons/Ponyta/ponytaBack.png",
  },

  geodude: {
    name: "Geodude",
    attacks: [attacks.tackle, attacks.tailWhip, attacks.growl, attacks.scratch],
    type: "Roca",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Geodude/geodudeFront.png",
    spriteBack: "assets/sprites/Pokemons/Geodude/geodudeBack.png",
  },

  cubone: {
    name: "Cubone",
    attacks: [attacks.scratch, attacks.tackle, attacks.tailWhip, attacks.growl],
    type: "Tierra",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Cubone/cuboneFront.png",
    spriteBack: "assets/sprites/Pokemons/Cubone/cuboneBack.png",
  },

  bellsprout: {
    name: "Bellsprout",
    attacks: [attacks.vineWhip, attacks.razorLeaf, attacks.growl, attacks.tackle],
    type: "Planta",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Bellsprout/bellsproutFront.png",
    spriteBack: "assets/sprites/Pokemons/Bellsprout/bellsproutBack.png",
  },

  jynx: {
    name: "Jynx",
    attacks: [attacks.confusion, attacks.waterGun, attacks.bite, attacks.quickAttack],
    type: "Normal",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Jynx/jynxFront.png",
    spriteBack: "assets/sprites/Pokemons/Jynx/jynxBack.png",
  },

  gastly: {
    name: "Gastly",
    attacks: [attacks.confusion, attacks.bite, attacks.scratch, attacks.growl],
    type: "Fantasma",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Gastly/gastlyFront.png",
    spriteBack: "assets/sprites/Pokemons/Gastly/gastlyBack.png",
  },

  magenmite: {
    name: "Magenmite",
    attacks: [attacks.thunderShock, attacks.tackle, attacks.growl, attacks.quickAttack],
    type: "Eléctrico",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Magenmite/magenmiteFront.png",
    spriteBack: "assets/sprites/Pokemons/Magenmite/magenmiteBack.png",
  },

  seel: {
    name: "Seel",
    attacks: [attacks.waterGun, attacks.bite, attacks.tailWhip, attacks.tackle],
    type: "Agua",
    map: [],
    spriteFront: "assets/sprites/Pokemons/Seel/seelFront.png",
    spriteBack: "assets/sprites/Pokemons/Seel/seelBack.png",
  },
};
