const TILE_SIZE = 16;
const FPS = 60;
const PERIOD = FPS / 1000; // 60 FPS -> 16 ms

const VIEW_WIDTH = 240;
const VIEW_HEIGHT = 160;
let fpsElapsed = 0;
let count = 0;
const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};
import { sprites } from "./sprites.js?v=20261014-trainer-defeated-1";
import { maps } from "./maps.js?v=20261014-trainer-defeated-1";
import { npcs, npcsDialogues, pokemons } from "./npcs.js?v=20261014-trainer-defeated-1";
const player = {
  x: 4,
  y: 5,
  sprite_index: sprites.spritePlayerStand,
  image_index: 0,
  image_number: 0,
  image_speed: 1,
  image_frames_elapsed: 0,
  speed: 5, // -> Luego de 60 iteraciones (60 FPS) el jugador se mueve "speed" celdas (16 px)
  pokedex: [], // Inicia vacio
  xp: 0,
  lvl: 1,
  money: 500,
  defeatedTrainers: [],
  items: [],
};
let stage = Number.parseInt(localStorage.getItem("storyStage") || "1", 10);
if (!Number.isFinite(stage)) stage = 1;
let wildPokemonOpponent = null;
let trainerBattleNpc = null;
let trainerPayoutApplied = false;
let trainerBattleStage = 1;
let canAutoSpeak = true;
let visibleDialogues = [];
let activeDialogue = null;
let dialogueLineIndex = 0;
const npcElements = new Map();
let map = maps.playerHouseHigh;
let collisionMap = map.collisionMap;
let smartReturnPoint = null;
let smartReturnLock = null;
let playerElement = document.querySelector("#player");
let mapElement = document.querySelector("#map");
let dialogueBoxElement = document.getElementById("dialogueBox");
let dialogueOptionsElement = document.getElementById("dialogueOptions");
let showDialogueBox = false;
let canSpeak = false;
const renderGridFlag = false;
const charTime = 2; // 2 frames -> 1s/60Frames * 2Frams aprox 32 ms por caracter
let charTimer = 0; // El charTimer debe llegar hasta charTime para incrementar en uno el realStringIndex
let realString = "";
let realStringIndex = 0;
let npcToSpeak = null;
let dialogueIndex = 0;
let stringIsOver = false;
let dialogueOptionIndex = 0;
let showDialogueOptions = false;
let currentDialogueLine = null;
let selectedOption = null;
let startBattle = false;
let brightnessTimer = 0;
const brightnessTime = 60 * 2; // 2 segundos
const battleElement = document.getElementById("battle");
let lastX = player.x,
  lastY = player.y;
let isInBattle = false;
const viewportElement = document.getElementById("viewport");
let battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
let battleOptionIndex = 0;
let selectedBattleOption = null;
let battleMessages = [];
let battleUpdates = [];
let battleMessageIndex = 0;
let battleMenuPage = "main";
let battleListOffset = 0;
let battleListOptions = [];
let playerPokemon = {
  pokemon: pokemons.charmander,
  level: player.lvl,
  atk1: [pokemons.charmander.attacks[0], pokemons.charmander.attacks[0].uses], // Ataque y usos disponibles
  atk2: [pokemons.charmander.attacks[1], pokemons.charmander.attacks[1].uses],
  atk3: [pokemons.charmander.attacks[2], pokemons.charmander.attacks[2].uses],
  atk4: [pokemons.charmander.attacks[3], pokemons.charmander.attacks[3].uses],
  maxhp: 100,
  physicalAtk: getRandomInt(100),
  physicalDef: getRandomInt(100),
  specialAtk: getRandomInt(100),
  specialDef: getRandomInt(100),
  hp: getRandomInt(100),
  paralyzed: false,
  staggered: false,
  accuracy: getRandomInt(100),
  priority: getRandomInt(100),
};
let playerPokemonElement = document.getElementById("player-pokemon");
let opponentPokemonElement = document.getElementById("opponent-pokemon");
let playerStatsElement = document.getElementById("player-stats");
let opponentStatsElement = document.getElementById("opponent-stats");
let playerNameElement = document.getElementById("player-name");
let opponentNameElement = document.getElementById("opponent-name");
let playerLevelElement = document.getElementById("player-level");
let opponentLevelElement = document.getElementById("opponent-level");
let playerHpBarElement = document.getElementById("player-hp-bar");
let opponentHpBarElement = document.getElementById("opponent-hp-bar");
let prob = 0;
const battleTextboxElement = document.getElementById("battle-textbox");
function checkIfBattleStarts() {
  if (!hasLivingPokemon()) return;
  prob += Math.random();

  if (prob >= 3) {
    startBattle = true;
    brightnessTimer = 0;
    keys.down = false;
    keys.up = false;
    keys.right = false;
    keys.left = false;
  }
  // console.log("prob: " + prob);
  // console.log("battleStarts: " + startBattle);
}
function hasLivingPokemon() {
  return playerPokemon.hp > 0 || (player.pokedex || []).some((entry) => typeof entry === "object" && entry?.hp > 0);
}
function movePlayer(dx, dy) {
  const newX = Math.round(player.x + dx);
  const newY = Math.round(player.y + dy);
  const npcBlocksCell = getVisibleDialogues().some(
    (dialogue) => dialogue.x === newX && dialogue.y === newY,
  );

  if (
    newY >= 0 &&
    newY < collisionMap.length &&
    newX >= 0 &&
    newX < collisionMap[newY].length &&
    collisionMap[newY][newX] != 1 &&
    !npcBlocksCell
  ) {
    player.x += dx;
    player.y += dy;

    const currentRoundedX = Math.round(player.x);
    const currentRoundedY = Math.round(player.y);
    if (smartReturnLock && (currentRoundedX !== smartReturnLock.x || currentRoundedY !== smartReturnLock.y)) {
      smartReturnLock = null;
    }

    // Comparamos si cambiamos de casilla entera
    if (
      currentRoundedX != Math.round(lastX) ||
      currentRoundedY != Math.round(lastY)
    ) {
      if (collisionMap[currentRoundedY][currentRoundedX] == 3 && !startBattle) {
        checkIfBattleStarts();
      }
      lastX = player.x;
      lastY = player.y;
    }
  }
}
document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  switch (event.key) {
    case "q":
      saveData();
      break;
    case "e":
      loadData();
      break;
    case "x":
    case "X":
      if (canSpeak) {
        if (!showDialogueBox) {
          if (npcToSpeak != null) {
            if (npcToSpeak.trigger == "manual") {
              showDialogueBox = true;
              realString = "";
              realStringIndex = 0;
              stringIsOver = false;
            }
          }
        }
      }
      if (!isInBattle && stringIsOver) {
        if (npcToSpeak != null) {
          if (dialogueIndex < npcToSpeak.strings.length - 1) {
            realString = "";
            realStringIndex = 0;
            stringIsOver = false;
            dialogueIndex++;
          } else {
            if (canAutoSpeak) canAutoSpeak = false;
            realString = "";
            realStringIndex = 0;
            stringIsOver = false;
            dialogueIndex = 0;
            showDialogueBox = false;
            if (npcToSpeak?.npc?.type === "battle" || npcToSpeak?.npc?.battle) {
              if (!hasLivingPokemon()) {
                battleMessages = ["No tienes ningún Pokémon con vida para combatir."];
                startBattle = false;
                showDialogueBox = false;
                return;
              }
              trainerBattleNpc = npcToSpeak.npc;
              trainerBattleStage = Math.max(1, Number(stage) || 1);
              trainerPayoutApplied = false;
              startBattle = true;
              brightnessTimer = 0;
              keys.down = false;
              keys.up = false;
              keys.right = false;
              keys.left = false;
            }
            switch (npcToSpeak.endAction) {
              case "keep":
                break;
              case "increase":
                stage++;
                break;
              case "jump to":
                stage = npcToSpeak?.newStage;
                break;
            }
          }
        }
      }
      if (showDialogueOptions) {
        selectedOption = currentDialogueLine?.options[dialogueOptionIndex];
      }
      if (isInBattle) {
        if (selectedBattleOption === "Mochila" && battleMenuPage === "main") {
          battleMenuPage = "bag-categories";
          battleOptions = ["Objetos", "Pokemon"];
          battleOptionIndex = 0;
          return;
        }
        if (selectedBattleOption === "Mochila" && battleMenuPage !== "main") {
          if (battleMenuPage === "bag-categories") {
            battleMenuPage = battleOptions[battleOptionIndex] === "Objetos" ? "bag-items" : "bag-pokemon";
            if (battleMenuPage === "bag-items") {
              battleListOptions = player.items.filter((item) => item.quantity > 0).map((item) => `${item.name} x${item.quantity}`);
            } else {
              battleListOptions = [playerPokemon.pokemon.name, ...(player.pokedex || []).map((entry) => {
                const key = typeof entry === "string" ? entry : entry?.pokemon || entry?.name;
                return pokemons[key]?.name || key;
              }).filter(Boolean)];
            }
            battleOptions = battleListOptions.length ? battleListOptions : ["(Vacío)"];
            battleOptionIndex = 0;
            return;
          }
          if (battleMenuPage === "bag-items") {
            const item = player.items.filter((entry) => entry.quantity > 0)[battleOptionIndex];
            if (!item) return;
            battleMessages = [item.type === "potion" && playerPokemon.hp > 0 && playerPokemon.hp < playerPokemon.maxhp
              ? `${playerPokemon.pokemon.name} recuperó 20 PS.` : "No puedes usar ese objeto ahora."];
            if (item.type === "potion" && playerPokemon.hp > 0 && playerPokemon.hp < playerPokemon.maxhp) {
              playerPokemon.hp = Math.min(playerPokemon.maxhp, playerPokemon.hp + 20);
              item.quantity--;
            }
          } else {
            const name = battleOptions[battleOptionIndex];
            const entry = (player.pokedex || []).find((pokemonEntry) => {
              const key = typeof pokemonEntry === "string" ? pokemonEntry : pokemonEntry?.pokemon || pokemonEntry?.name;
              return (pokemons[key]?.name || key) === name;
            });
            const key = typeof entry === "string" ? entry : entry?.pokemon || entry?.name;
            const pokemon = pokemons[key];
            if (pokemon && pokemon !== playerPokemon.pokemon) {
              playerPokemon = { ...playerPokemon, pokemon, hp: playerPokemon.maxhp, atk1: [pokemon.attacks[0], pokemon.attacks[0].uses], atk2: [pokemon.attacks[1], pokemon.attacks[1].uses], atk3: [pokemon.attacks[2], pokemon.attacks[2].uses], atk4: [pokemon.attacks[3], pokemon.attacks[3].uses] };
              battleMessages = [`Adelante, ${pokemon.name}!`];
            } else battleMessages = [`${name} ya está en combate.`];
          }
          battleUpdates = [null]; selectedBattleOption = "Resultado"; battleMessageIndex = 0;
          realString = ""; realStringIndex = 0; stringIsOver = false; battleMenuPage = "main";
          return;
        }
        if (selectedBattleOption === null) {
          selectedBattleOption = battleOptions[battleOptionIndex];
          battleOptionIndex = 0;
        } else if (selectedBattleOption === "Resultado") {
          if (stringIsOver) {
            if (battleMessageIndex < battleMessages.length - 1) {
              battleMessageIndex++;
              realString = "";
              realStringIndex = 0;
              stringIsOver = false;
              charTimer = 0;
            } else {
              if (playerPokemon.hp <= 0 || wildPokemonOpponent.hp <= 0) {
                if (trainerBattleNpc && !trainerPayoutApplied) {
                  const won = wildPokemonOpponent.hp <= 0;
                  const amount = trainerBattleStage * (won ? 100 : 25);
                  player.money = won ? player.money + amount : Math.max(0, player.money - amount);
                  if (won && trainerBattleNpc.id != null) {
                    if (!Array.isArray(player.defeatedTrainers)) player.defeatedTrainers = [];
                    if (!player.defeatedTrainers.includes(trainerBattleNpc.id)) {
                      player.defeatedTrainers.push(trainerBattleNpc.id);
                      saveData();
                    }
                  }
                  battleMessages.push(won ? `Ganaste $${amount}.` : `Perdiste $${amount}.`);
                  battleUpdates.push(null);
                  battleMessageIndex++;
                  trainerPayoutApplied = true;
                  realString = "";
                  realStringIndex = 0;
                  stringIsOver = false;
                  charTimer = 0;
                } else {
                  isInBattle = false;
                  startBattle = false;
                  brightnessTimer = 0;
                  trainerBattleNpc = null;
                }
              }
              selectedBattleOption = null;
              battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
              battleOptionIndex = 0;
              realString = "";
              realStringIndex = 0;
              stringIsOver = false;
            }
          }
        } else if (selectedBattleOption === "Pelear") {
          const selectedAttack = playerPokemon[`atk${battleOptionIndex + 1}`];
          const enemyAttacks = [
            wildPokemonOpponent.atk1,
            wildPokemonOpponent.atk2,
            wildPokemonOpponent.atk3,
            wildPokemonOpponent.atk4,
          ].filter((attack) => attack[1] > 0);
          const enemyAttack = enemyAttacks.length
            ? enemyAttacks[getRandomInt(enemyAttacks.length - 1)]
            : null;
          const playerPriority =
            playerPokemon.priority +
            (selectedAttack[0].effect === "first" ? 100 : 0);
          const enemyPriority =
            wildPokemonOpponent.priority +
            (enemyAttack?.[0].effect === "first" ? 100 : 0);
          const playerActsFirst =
            playerPriority === enemyPriority
              ? getRandomInt(1) === 0
              : playerPriority > enemyPriority;
          const turns = playerActsFirst
            ? [
                {
                  attacker: playerPokemon,
                  target: wildPokemonOpponent,
                  attack: selectedAttack,
                },
                ...(enemyAttack
                  ? [
                      {
                        attacker: wildPokemonOpponent,
                        target: playerPokemon,
                        attack: enemyAttack,
                      },
                    ]
                  : []),
              ]
            : [
                ...(enemyAttack
                  ? [
                      {
                        attacker: wildPokemonOpponent,
                        target: playerPokemon,
                        attack: enemyAttack,
                      },
                    ]
                  : []),
                {
                  attacker: playerPokemon,
                  target: wildPokemonOpponent,
                  attack: selectedAttack,
                },
              ];
          const initialPlayerState = {
            hp: playerPokemon.hp,
            physicalAtk: playerPokemon.physicalAtk,
            physicalDef: playerPokemon.physicalDef,
            paralyzed: playerPokemon.paralyzed,
            staggered: playerPokemon.staggered,
          };
          const initialOpponentState = {
            hp: wildPokemonOpponent.hp,
            physicalAtk: wildPokemonOpponent.physicalAtk,
            physicalDef: wildPokemonOpponent.physicalDef,
            paralyzed: wildPokemonOpponent.paralyzed,
            staggered: wildPokemonOpponent.staggered,
          };
          battleMessages = [];
          battleUpdates = [];
          battleMessageIndex = 0;
          realString = "";
          realStringIndex = 0;
          stringIsOver = false;
          charTimer = 0;
          for (const turn of turns) {
            if (turn.attacker.hp <= 0 || turn.target.hp <= 0) continue;
            let turnMessage = "";
            if (turn.attacker.paralyzed || turn.attacker.staggered) {
              turnMessage = `${turn.attacker.pokemon.name} no pudo moverse.`;
              turn.attacker.paralyzed = false;
              turn.attacker.staggered = false;
            } else if (turn.attack[1] <= 0) {
              turnMessage = `${turn.attacker.pokemon.name} no tiene usos de ${turn.attack[0].name}.`;
            } else {
              turn.attack[1]--;
              if (getRandomInt(99) >= turn.attack[0].accuracy) {
                turnMessage = `${turn.attacker.pokemon.name} usó ${turn.attack[0].name}, pero falló (precisión ${turn.attack[0].accuracy}%). ${turn.attack[0].description}`;
              } else {
                let damage = turn.attack[0].damage
                  ? Math.max(
                      1,
                      turn.attack[0].damage +
                        Math.floor(turn.attacker.physicalAtk / 10) -
                        Math.floor(turn.target.physicalDef / 20),
                    )
                  : 0;
                if (
                  turn.attack[0].strongAgainst.includes(
                    turn.target.pokemon.type,
                  )
                )
                  damage *= 2;
                if (turn.attack[0].effect === "critical") damage *= 2;
                if (turn.attack[0].effect === "burn") damage += 2;
                turn.target.hp = Math.max(0, turn.target.hp - damage);
                if (turn.attack[0].effect === "weaken")
                  turn.target.physicalAtk = Math.max(
                    0,
                    turn.target.physicalAtk - 10,
                  );
                if (turn.attack[0].effect === "weakenDefense")
                  turn.target.physicalDef = Math.max(
                    0,
                    turn.target.physicalDef - 10,
                  );
                if (turn.attack[0].effect === "paralyze")
                  turn.target.paralyzed = true;
                if (turn.attack[0].effect === "stagger")
                  turn.target.staggered = true;
                turnMessage = `${turn.attacker.pokemon.name} usó ${turn.attack[0].name}${damage ? ` e hizo ${damage} de daño` : ""}. ${turn.attack[0].description}`;
              }
            }
            battleMessages.push(turnMessage);
            battleUpdates.push({
              player: {
                hp: playerPokemon.hp,
                physicalAtk: playerPokemon.physicalAtk,
                physicalDef: playerPokemon.physicalDef,
                paralyzed: playerPokemon.paralyzed,
                staggered: playerPokemon.staggered,
              },
              opponent: {
                hp: wildPokemonOpponent.hp,
                physicalAtk: wildPokemonOpponent.physicalAtk,
                physicalDef: wildPokemonOpponent.physicalDef,
                paralyzed: wildPokemonOpponent.paralyzed,
                staggered: wildPokemonOpponent.staggered,
              },
            });
          }
          if (wildPokemonOpponent.hp <= 0) {
            battleMessages.push(
              `${wildPokemonOpponent.pokemon.name} quedó fuera de combate.`,
            );
            battleUpdates.push(null);
          } else if (playerPokemon.hp <= 0) {
            battleMessages.push(
              `${playerPokemon.pokemon.name} quedó fuera de combate.`,
            );
            battleUpdates.push(null);
          } else if (!enemyAttack) {
            battleMessages.push(
              `${wildPokemonOpponent.pokemon.name} no tiene ataques disponibles.`,
            );
            battleUpdates.push(null);
          }
          if (!battleMessages.length) {
            battleMessages.push("No ocurrió nada.");
            battleUpdates.push(null);
          }
          Object.assign(playerPokemon, initialPlayerState);
          Object.assign(wildPokemonOpponent, initialOpponentState);
          selectedBattleOption = "Resultado";
        } else {
          switch (selectedBattleOption) {
            case "Correr":
              if (battleOptions[battleOptionIndex] === "Sí") {
                if (trainerBattleNpc) {
                  const amount = Math.min(player.money, trainerBattleStage * 25);
                  player.money = Math.max(0, player.money - amount);
                }
                isInBattle = false;
                startBattle = false;
                brightnessTimer = 0;
                trainerBattleNpc = null;
                trainerPayoutApplied = false;
                selectedBattleOption = null;
                battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
                battleOptionIndex = 0;
              } else {
                selectedBattleOption = null;
                battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
                battleOptionIndex = 0;
              }
              break;
            default:
              selectedBattleOption = battleOptions[battleOptionIndex];
          }
        }
      }
      break;
    case "ArrowUp":
      if (!showDialogueBox && !startBattle) {
        keys.up = true;
        keys.down = false;
        keys.left = false;
        keys.right = false;
        // movePlayer(0, -1);
        player.sprite_index = sprites.spritePlayerWalkUp;
        player.image_index = 0;
        fpsElapsed = 0;
      }
      if (showDialogueOptions) {
        if (dialogueOptionIndex > 0) dialogueOptionIndex--;
      }
      if (isInBattle) {
        if (selectedBattleOption === "Mochila" || selectedBattleOption === "Pokemon") battleOptionIndex = Math.max(0, battleOptionIndex - 1);
        else if (battleOptionIndex >= 2) battleOptionIndex -= 2;
      }
      break;
    case "ArrowDown":
      if (!showDialogueBox && !startBattle) {
        keys.down = true;
        keys.up = false;
        keys.left = false;
        keys.right = false;
        // movePlayer(0, 1);
        player.sprite_index = sprites.spritePlayerWalkDown;
        player.image_index = 0;
        fpsElapsed = 0;
      }
      if (showDialogueOptions) {
        if (dialogueOptionIndex < currentDialogueLine?.options.length - 1)
          dialogueOptionIndex++;
      }
      if (isInBattle) {
        if (selectedBattleOption === "Mochila" || selectedBattleOption === "Pokemon") battleOptionIndex = Math.min(battleOptions.length - 1, battleOptionIndex + 1);
        else if (battleOptionIndex + 2 < battleOptions.length)
          battleOptionIndex += 2;
      }
      break;
    case "ArrowLeft":
      if (!showDialogueBox && !startBattle) {
        keys.left = true;
        keys.up = false;
        keys.down = false;
        keys.right = false;
        // movePlayer(-1, 0);
        player.sprite_index = sprites.spritePlayerWalkLeft;
        player.image_index = 0;
        fpsElapsed = 0;
      }
      if (isInBattle && battleOptionIndex % 2 === 1) battleOptionIndex--;
      break;
    case "ArrowRight":
      if (!showDialogueBox && !startBattle) {
        keys.right = true;
        keys.up = false;
        keys.down = false;
        keys.left = false;
        // movePlayer(1, 0);
        player.sprite_index = sprites.spritePlayerWalkRight;
        player.image_index = 0;
        fpsElapsed = 0;
      }
      if (
        isInBattle &&
        battleOptionIndex % 2 === 0 &&
        battleOptionIndex + 1 < battleOptions.length
      )
        battleOptionIndex++;
      break;
    case "c":
    case "C":
      if (isInBattle && selectedBattleOption !== "Resultado") {
        selectedBattleOption = null;
        battleMenuPage = "main";
        battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
        battleOptionIndex = 0;
      }
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
      keys.up = false;
      break;
    case "ArrowDown":
      keys.down = false;
      break;
    case "ArrowLeft":
      keys.left = false;
      break;
    case "ArrowRight":
      keys.right = false;
      break;
  }
});

function changeMap(newmap, startx, starty) {
  keys.down = false;
  keys.up = false;
  keys.right = false;
  keys.left = false;
  map = maps[newmap];
  console.log("newmap: " + newmap);
  console.log("map: " + map);
  collisionMap = map.collisionMap;
  player.x = startx;
  player.y = starty;
  lastX = player.x;
  lastY = player.y;
}

function checkTeleporter() {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  const cell = collisionMap[y]?.[x];
  const currentMapKey = Object.keys(maps).find((key) => maps[key] === map)
    || Object.keys(maps).find((key) => maps[key].background === map.background);

  if (smartReturnLock && currentMapKey === smartReturnLock.mapKey && x === smartReturnLock.x && y === smartReturnLock.y) return;

  if (Array.isArray(cell) && Number(cell[0]) === 2 && maps[cell[1]]) {
    changeMap(cell[1], Number(cell[2]), Number(cell[3]));
  } else if (Array.isArray(cell) && Number(cell[0]) === 4 && maps[cell[1]]) {
    smartReturnPoint = { mapKey: currentMapKey, x, y: y + 1 };
    changeMap(cell[1], Number(cell[2]), Number(cell[3]));
  } else if (Number(cell) === 4 && smartReturnPoint && maps[smartReturnPoint.mapKey]) {
    const returnPoint = { ...smartReturnPoint };
    changeMap(returnPoint.mapKey, returnPoint.x, returnPoint.y);
    smartReturnLock = { ...returnPoint };
  }
}

function updateCamera() {
  const playerX = player.x * TILE_SIZE + TILE_SIZE / 2;
  const playerY = player.y * TILE_SIZE + TILE_SIZE / 2;

  let cameraX = VIEW_WIDTH / 2 - playerX;
  let cameraY = VIEW_HEIGHT / 2 - playerY;

  // Evitar que la cámara salga del mapa
  cameraX = Math.min(0, Math.max(VIEW_WIDTH - map.width, cameraX));
  cameraY = Math.min(0, Math.max(VIEW_HEIGHT - map.height, cameraY));

  mapElement.style.left = `${cameraX}px`;
  mapElement.style.top = `${cameraY}px`;
}
function saveData() {
  localStorage.setItem("playerState", JSON.stringify(player));
  localStorage.setItem("mapState", JSON.stringify(map));
  localStorage.setItem("stage", JSON.stringify(stage));
  localStorage.setItem("smartReturnPoint", JSON.stringify(smartReturnPoint));
  localStorage.setItem("smartReturnLock", JSON.stringify(smartReturnLock));
}
function loadData() {
  const savedData = localStorage.getItem("playerState");
  const mapData = localStorage.getItem("mapState");
  const stageData = localStorage.getItem("stage");
  if (savedData && mapData) {
    const savedPlayer = JSON.parse(savedData);

    Object.assign(player, savedPlayer);
    if (!Number.isFinite(player.money)) player.money = 0;
    if (!Array.isArray(player.defeatedTrainers)) player.defeatedTrainers = [];
    if (!Array.isArray(player.items)) player.items = [];
    map = JSON.parse(mapData);
    stage = JSON.parse(stageData);
    collisionMap = map.collisionMap;
    const savedSmartReturnPoint = localStorage.getItem("smartReturnPoint");
    smartReturnPoint = savedSmartReturnPoint ? JSON.parse(savedSmartReturnPoint) : null;
    const savedSmartReturnLock = localStorage.getItem("smartReturnLock");
    smartReturnLock = savedSmartReturnLock ? JSON.parse(savedSmartReturnLock) : null;
  }
}

function getVisibleDialogues() {
  return Object.values(npcsDialogues).filter(
    (dialogue) =>
      !(dialogue.npc && (dialogue.npc.type === "battle" || dialogue.npc.battle) && player.defeatedTrainers?.includes(dialogue.npc.id)) &&
      (dialogue.map === map || dialogue.map?.background === map.background) &&
      dialogue.stages?.[0] <= stage &&
      stage <= dialogue.stages?.[1],
  );
}

function renderWorld() {
  if (!isInBattle) {
    mapElement.style.visibility = "visible";
    battleElement.style.visibility = "hidden";
    canSpeak = false;
    // console.log("stage: " + stage);
    mapElement.innerHTML = "";
    // Render Map
    mapElement.style.backgroundImage = `url("${map.background}")`;
    mapElement.style.width = `${map.width}px`;
    mapElement.style.height = `${map.height}px`;
    mapElement.style.backgroundSize = `${map.width}px ${map.height}px`;

    // Render Player
    playerElement = document.createElement("div");
    playerElement.id = "player";
    playerElement.style.left = `${player.x * TILE_SIZE}px`;
    playerElement.style.top = `${player.y * TILE_SIZE}px`;

    // Animacion
    const image = player.sprite_index.sprite[player.image_index];
    playerElement.style.backgroundImage = `url("${image.src}")`;

    // Añadir el Contenedor del Personaje
    mapElement.appendChild(playerElement);

    // Reset the automatic dialogue cooldown only after leaving every nearby trigger.
    const visibleDialogues = getVisibleDialogues();
    const nearAutoDialogue = visibleDialogues.some((dialogue) =>
      dialogue.trigger === "auto" &&
      Math.hypot(player.x - dialogue.x, player.y - dialogue.y) < 2,
    );
    if (!nearAutoDialogue) canAutoSpeak = true;

    // Render NPCs
    let counter = 0;
    let npcElement = null;
    for (const dialogue of visibleDialogues) {
      if (dialogue) {
        if (
          "sprite" in dialogue
        ) // Si existe la clave sprite (hay npcs sin sprites)
        {
          npcElement = document.createElement("div");
          npcElement.id = "npc" + counter;
          npcElement.style.left = `${dialogue.x * TILE_SIZE}px`;
          npcElement.style.top = `${dialogue.y * TILE_SIZE}px`;
          const npcImage = dialogue.sprite.sprite[0];
          npcElement.style.backgroundImage = `url("${npcImage.src}")`;
          npcElement.style.width = npcImage.naturalWidth + "px";
          npcElement.style.height = npcImage.naturalHeight + "px";
          npcElement.style.backgroundSize = "cover";
          npcElement.style.position = "absolute";
          npcElement.style.zIndex = "2";
          npcElement.style.backgroundRepeat = "no-repeat";
          npcElement.style.imageRendering = "pixelated";
          mapElement.appendChild(npcElement);
        }
        // Si la distancia entre el jugador y el npc es menor que 1.5, se puede hablar
        if (
          Math.sqrt(
            Math.pow(player.x - dialogue.x, 2) +
              Math.pow(player.y - dialogue.y, 2),
          ) <= 1.5
        ) {
          if (!showDialogueBox && dialogue.trigger == "auto" && canAutoSpeak) {
            showDialogueBox = true;
            realString = "";
            realStringIndex = 0;
            stringIsOver = false;
          }
          canSpeak = true;
          npcToSpeak = dialogue;
        }
        counter++;
      }
    }

    dialogueBoxElement.style.visibility = showDialogueBox
      ? "visible"
      : "hidden";
    // Renderizador de Texto
    if (showDialogueBox) {
      // A este punto se llegan 60 veces por segundo, y el charTime indica cuantas veces se debe llegar para incrementar en un caracter el texto a renderizar
      if (charTimer < charTime) {
        charTimer++;
      } else if (npcToSpeak != null) {
        charTimer = 0; //Resetear el timer
        if (realStringIndex < npcToSpeak.strings[dialogueIndex].string.length) {
          if (npcToSpeak) {
            realString +=
              npcToSpeak.strings[dialogueIndex].string[realStringIndex];
          }
          realStringIndex++; // Incrementar el Indice
        } else {
          stringIsOver = true;
        }
      }
    }
    if (npcToSpeak != null) {
      let dialogueTextElement = document.getElementById("dialogueText");
      let dialogueNameElement = document.getElementById("dialogueName");
      dialogueNameElement.innerHTML = "";
      dialogueNameElement.appendChild(
        document.createTextNode(npcToSpeak.npc.name),
      );
      dialogueTextElement.innerHTML = "";
      dialogueTextElement.appendChild(document.createTextNode(realString));
    }
    // Mostrar el panel cuando la línea actual es una pregunta.
    currentDialogueLine = npcToSpeak?.strings?.[dialogueIndex];
    showDialogueOptions =
      showDialogueBox && currentDialogueLine?.mode === "question";
    dialogueOptionsElement.style.visibility = showDialogueOptions
      ? "visible"
      : "hidden";
    if (showDialogueOptions) {
      const options = currentDialogueLine?.options;
      dialogueOptionsElement.innerHTML = "";
      let index = 0;
      for (const option of options) {
        const optionElement = document.createElement("div");
        if (index == dialogueOptionIndex)
          optionElement.textContent = "▶ " + option;
        else optionElement.textContent = option;
        dialogueOptionsElement.appendChild(optionElement);
        index++;
      }
    }
    if (startBattle) {
      viewportElement.style.filter = `brightness(${1 - brightnessTimer / brightnessTime})`;
    }
  } else {
    prob = 0;
    mapElement.innerHTML = "";
    mapElement.style.visibility = "hidden";
    viewportElement.style.filter = "none";
    battleElement.style.visibility = "visible";
    battleTextboxElement.innerHTML = "";
    switch (selectedBattleOption) {
      case "Correr":
        battleOptions = ["Sí", "No"];
        battleTextboxElement.style.display = "grid";
        battleTextboxElement.style.gridTemplateColumns = "repeat(2, 1fr)";
        battleTextboxElement.style.gridTemplateRows = "repeat(2, 1fr)";
        battleTextboxElement.style.alignItems = "center";
        battleTextboxElement.style.justifyItems = "center";
        const question = document.createElement("div");
        const abandonmentLoss = trainerBattleNpc
          ? Math.min(player.money, trainerBattleStage * 25)
          : 0;
        question.textContent = trainerBattleNpc
          ? `¿Abandonar? Perderás $${abandonmentLoss}.`
          : "¿Abandonar?";
        question.style.gridColumn = "1 / -1";
        battleTextboxElement.appendChild(question);
        for (const battleOption of battleOptions) {
          const battleOptionElement = document.createElement("div");
          battleOptionElement.textContent = battleOption;
          if (battleOption == battleOptions[battleOptionIndex]) {
            battleOptionElement.textContent = "▶ " + battleOption;
          }
          battleTextboxElement.appendChild(battleOptionElement);
        }
        break;
      case "Mochila":
      case "Pokemon":
        battleTextboxElement.style.display = "grid";
        battleTextboxElement.style.gridTemplateColumns = "1fr";
        battleTextboxElement.style.gridTemplateRows = "repeat(4, 1fr)";
        battleTextboxElement.style.alignItems = "center";
        battleTextboxElement.style.justifyItems = "start";
        battleTextboxElement.style.padding = "6px 14px";
        battleTextboxElement.style.overflowY = "hidden";
        if (battleMenuPage === "main") battleOptions = ["Objetos", "Pokemon"];
        else if (battleMenuPage === "bag-categories") battleOptions = ["Objetos", "Pokemon"];
        const visibleOptions = battleOptions.slice(Math.max(0, battleOptionIndex - 3), battleOptionIndex + 1);
        for (const option of visibleOptions) {
          const row = document.createElement("div");
          row.textContent = `${option === battleOptions[battleOptionIndex] ? "▶ " : ""}${option}`;
          battleTextboxElement.appendChild(row);
        }
        break;
      case "Pokemon":
        break;
      case "Pelear":
        battleOptions = [
          playerPokemon.atk1[0].name,
          playerPokemon.atk2[0].name,
          playerPokemon.atk3[0].name,
          playerPokemon.atk4[0].name,
        ];
        battleTextboxElement.style.display = "grid";
        battleTextboxElement.style.gridTemplateColumns = "repeat(2, 1fr)";
        battleTextboxElement.style.gridTemplateRows = "repeat(2, 1fr)";
        battleTextboxElement.style.alignItems = "center";
        battleTextboxElement.style.justifyItems = "center";
        for (const battleOption of battleOptions) {
          const battleOptionElement = document.createElement("div");
          battleOptionElement.textContent = battleOption;
          if (battleOption == battleOptions[battleOptionIndex]) {
            battleOptionElement.textContent = "▶ " + battleOption;
          }
          battleTextboxElement.appendChild(battleOptionElement);
        }
        break;
      case "Resultado":
        battleTextboxElement.style.display = "flex";
        battleTextboxElement.style.alignItems = "center";
        battleTextboxElement.style.justifyContent = "center";
        if (battleUpdates[battleMessageIndex]) {
          if (battleUpdates[battleMessageIndex].player.hp < playerPokemon.hp) {
            playerPokemonElement.classList.remove("pokemon-hit-flash");
            void playerPokemonElement.offsetWidth;
            playerPokemonElement.classList.add("pokemon-hit-flash");
          }
          if (
            battleUpdates[battleMessageIndex].opponent.hp <
            wildPokemonOpponent.hp
          ) {
            opponentPokemonElement.classList.remove("pokemon-hit-flash");
            void opponentPokemonElement.offsetWidth;
            opponentPokemonElement.classList.add("pokemon-hit-flash");
          }
          Object.assign(
            playerPokemon,
            battleUpdates[battleMessageIndex].player,
          );
          Object.assign(
            wildPokemonOpponent,
            battleUpdates[battleMessageIndex].opponent,
          );
          battleUpdates[battleMessageIndex] = null;
        }
        if (charTimer < charTime) {
          charTimer++;
        } else {
          charTimer = 0;
          if (realStringIndex < battleMessages[battleMessageIndex].length) {
            realString += battleMessages[battleMessageIndex][realStringIndex];
            realStringIndex++;
          } else {
            stringIsOver = true;
          }
        }
        battleTextboxElement.textContent = realString;
        break;
      default:
        battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
        battleTextboxElement.style.display = "grid";
        battleTextboxElement.style.gridTemplateColumns = "repeat(2, 1fr)";
        battleTextboxElement.style.gridTemplateRows = "repeat(2, 1fr)";
        battleTextboxElement.style.alignItems = "center";
        battleTextboxElement.style.justifyItems = "center";
        for (const battleOption of battleOptions) {
          const battleOptionElement = document.createElement("div");
          battleOptionElement.textContent = battleOption;
          if (battleOption == battleOptions[battleOptionIndex]) {
            battleOptionElement.textContent = "▶ " + battleOption;
          }
          battleTextboxElement.appendChild(battleOptionElement);
        }
        break;
    }
    // Renderizar Pokemones
    playerPokemonElement.style.backgroundImage = `url(${playerPokemon.pokemon.spriteBack})`;
    opponentPokemonElement.style.backgroundImage = `url(${wildPokemonOpponent.pokemon.spriteFront})`;
    playerStatsElement.style.backgroundImage =
      'url("assets/sprites/UI/player-stats.png")';
    opponentStatsElement.style.backgroundImage =
      'url("assets/sprites/UI/opponent-stats.png")';
    playerNameElement.textContent = playerPokemon.pokemon.name;
    opponentNameElement.textContent = wildPokemonOpponent.pokemon.name;
    playerLevelElement.textContent = `Lv ${playerPokemon.level}`;
    opponentLevelElement.textContent = `Lv ${wildPokemonOpponent.level}`;
    playerHpBarElement.style.width = `${Math.max(
      0,
      Math.min(100, (playerPokemon.hp / playerPokemon.maxhp) * 100),
    )}%`;
    opponentHpBarElement.style.width = `${Math.max(
      0,
      Math.min(100, (wildPokemonOpponent.hp / wildPokemonOpponent.maxhp) * 100),
    )}%`;
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function determineEnemy() {
  // Devoler una lista de pokemones salvajes del mapa actual
  const battleOptionsForNpc = trainerBattleNpc?.battle?.pokemonOptions || [];
  if (trainerBattleNpc && battleOptionsForNpc.length) {
    const selectedOption = battleOptionsForNpc[getRandomInt(battleOptionsForNpc.length - 1)];
    const pokemonKey = typeof selectedOption === "string" ? selectedOption : selectedOption.pokemon;
    const selectedPokemon = typeof pokemonKey === "string" ? pokemons[pokemonKey] : pokemonKey;
    if (!selectedPokemon) {
      trainerBattleNpc = null;
      return determineEnemy();
    }
    const trainerStage = trainerBattleStage;
    const trainerLevel = Math.min(100, 3 + trainerStage * 2);
    const trainerMaxHp = 40 + trainerStage * 8;
    wildPokemonOpponent = {
      pokemon: selectedPokemon,
      level: trainerLevel,
      atk1: [selectedPokemon.attacks[0], selectedPokemon.attacks[0].uses],
      atk2: [selectedPokemon.attacks[1], selectedPokemon.attacks[1].uses],
      atk3: [selectedPokemon.attacks[2], selectedPokemon.attacks[2].uses],
      atk4: [selectedPokemon.attacks[3], selectedPokemon.attacks[3].uses],
      maxhp: trainerMaxHp,
      physicalAtk: 20 + trainerStage * 5,
      physicalDef: 15 + trainerStage * 4,
      specialAtk: 20 + trainerStage * 5,
      specialDef: 15 + trainerStage * 4,
      hp: trainerMaxHp,
      accuracy: Math.min(100, 75 + trainerStage * 2),
      priority: 20 + trainerStage * 3,
      paralyzed: false,
      staggered: false,
    };
    battleMessages = [`${trainerBattleNpc.name} te desafía con ${selectedPokemon.name} de nivel ${wildPokemonOpponent.level}.`];
    battleUpdates = [null];
    battleMessageIndex = 0;
    realString = "";
    realStringIndex = 0;
    stringIsOver = false;
    charTimer = 0;
    selectedBattleOption = "Resultado";
    battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
    battleOptionIndex = 0;
    return;
  }
  trainerBattleNpc = null;
  const wildPokemonsInDZN = Object.values(pokemons).filter((data) =>
    data.map?.some((wildMap) => wildMap.background === map.background),
  );
  console.log("pokemonesSalvajes: " + wildPokemonsInDZN);
  // Instanciar un pokemon salvaje aleatorio
  let randomPokemon =
    wildPokemonsInDZN[getRandomInt(wildPokemonsInDZN.length - 1)];
  wildPokemonOpponent = {
    pokemon: randomPokemon,
    level: getRandomInt(3) + 2,
    atk1: [randomPokemon.attacks[0], randomPokemon.attacks[0].uses], // Ataque y usos disponibles
    atk2: [randomPokemon.attacks[1], randomPokemon.attacks[1].uses],
    atk3: [randomPokemon.attacks[2], randomPokemon.attacks[2].uses],
    atk4: [randomPokemon.attacks[3], randomPokemon.attacks[3].uses],
    maxhp: 100,
    physicalAtk: getRandomInt(100),
    physicalDef: getRandomInt(100),
    specialAtk: getRandomInt(100),
    specialDef: getRandomInt(100),
    hp: getRandomInt(100),
    accuracy: getRandomInt(100),
    priority: getRandomInt(100),
    paralyzed: false,
    staggered: false,
  };
  battleMessages = [
    `Un ${wildPokemonOpponent.pokemon.name} salvaje de nivel ${wildPokemonOpponent.level} ha aparecido.`,
  ];
  battleUpdates = [null];
  battleMessageIndex = 0;
  realString = "";
  realStringIndex = 0;
  stringIsOver = false;
  charTimer = 0;
  selectedBattleOption = "Resultado";
  battleOptions = ["Pelear", "Mochila", "Pokemon", "Correr"];
  battleOptionIndex = 0;
}

function gameLoop() {
  if (startBattle) {
    if (brightnessTimer < brightnessTime) {
      brightnessTimer++;
    } else if (!isInBattle) {
      // Pasar a la batalla
      isInBattle = true;
      determineEnemy();
    }
  }
  // console.log("stage: " + stage);
  // actualizar juego
  // renderizar
  fpsElapsed = fpsElapsed < FPS - 1 ? fpsElapsed + 1 : 0;
  if (fpsElapsed == 0) {
    // saveData();
  }
  // console.log(fpsElapsed);
  // console.log(player.sprite_index.sprite);
  // console.log("count: " + count);
  // console.log("image_speed: " + player.image_speed);
  // console.log("image_frames_elapsed: " + player.image_frames_elapsed);
  // console.log(keys);
  // Actualizar subimagen del jugador
  // Obtener la cantidad de subimagenes del sprite actual
  player.image_number = player.sprite_index.subimages;
  // Obtener la cantidad de frames por subimagen del sprite actual
  player.image_speed = Math.round(
    FPS / (player.image_number * player.sprite_index.speed),
  );

  if (player.image_frames_elapsed < player.image_speed) {
    player.image_frames_elapsed = player.image_frames_elapsed + 1;
  } else {
    player.image_frames_elapsed = 0;
    player.image_index =
      player.image_index < player.image_number - 1 ? player.image_index + 1 : 0;
  }

  if (keys.up) {
    movePlayer(0, -player.speed / FPS);
  } else if (keys.down) {
    movePlayer(0, player.speed / FPS);
  } else if (keys.left) {
    movePlayer(-player.speed / FPS, 0);
  } else if (keys.right) {
    movePlayer(player.speed / FPS, 0);
  } else {
    player.sprite_index = sprites.spritePlayerStand;
    player.image_index = 0;
  }
  checkTeleporter();
  renderWorld();
  updateCamera();
  requestAnimationFrame(gameLoop);
}
gameLoop();
                                                                                                                                                                                                            