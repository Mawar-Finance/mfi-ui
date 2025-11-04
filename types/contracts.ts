// Growth stages enum (matching Solidity contract)
export enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  BLOOMING = 3,
}

// Plant interface (matching contract struct)
export interface Plant {
  id: bigint
  owner: string
  stage: GrowthStage
  plantedDate: bigint // timestamp dalam seconds
  lastWatered: bigint // timestamp dalam seconds
  waterLevel: number // 0-100
  exists: boolean
  isDead: boolean // apakah plant mati karena kurang air
}

// Growth stage display names
export const STAGE_NAMES = {
  [GrowthStage.SEED]: 'seed',
  [GrowthStage.SPROUT]: 'sprout',
  [GrowthStage.GROWING]: 'growing',
  [GrowthStage.BLOOMING]: 'blooming',
} as const

// Contract constants (sesuai dengan smart contract)
export const PLANT_PRICE = '0.001' // ETH
export const HARVEST_REWARD = '0.003' // ETH
export const STAGE_DURATION = 60 // 60 seconds = 1 menit per stage
export const WATER_DEPLETION_TIME = 30 // 30 seconds
export const WATER_DEPLETION_RATE = 20 // 20% per interval

// Contract address dari environment variable
export const LISK_GARDEN_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Contract ABI (Application Binary Interface)
// Ini adalah interface untuk berinteraksi dengan smart contract
export const LISK_GARDEN_ABI = [
  // Constructor
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},

  // Events
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"PlantDied","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"PlantHarvested","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"PlantSeeded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"newWaterLevel","type":"uint8"}],"name":"PlantWatered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":false,"internalType":"enum LiskGarden.GrowthStage","name":"newStage","type":"uint8"}],"name":"StageAdvanced","type":"event"},

  // View functions (read-only)
  {"inputs":[],"name":"HARVEST_REWARD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PLANT_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"STAGE_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"WATER_DEPLETION_RATE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"WATER_DEPLETION_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"calculateWaterLevel","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"getPlant","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"enum LiskGarden.GrowthStage","name":"stage","type":"uint8"},{"internalType":"uint256","name":"plantedDate","type":"uint256"},{"internalType":"uint256","name":"lastWatered","type":"uint256"},{"internalType":"uint8","name":"waterLevel","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"isDead","type":"bool"}],"internalType":"struct LiskGarden.Plant","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPlants","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"plantCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  // Write functions (state-changing)
  {"inputs":[],"name":"plantSeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"waterPlant","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"updatePlantStage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"harvestPlant","outputs":[],"stateMutability":"nonpayable","type":"function"},
] as const