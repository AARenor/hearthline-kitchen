// Shared tuning and palette for Hearthline Kitchen.
export const VIEW = { width: 1280, height: 800 };

export const PALETTE = {
  ink: '#241512',
  cream: '#f6e7c9',
  parchment: '#f3dfb6',
  copper: '#c96f36',
  copperLight: '#f0a45b',
  tile: '#e2c79c',
  tileDark: '#bf9a70',
  wood: '#7c4a2d',
  woodLight: '#a4683c',
  steel: '#8a9199',
  steelLight: '#cfd6da',
  herb: '#5c9a3c',
  ember: '#e0602f',
  gold: '#f3c35b',
  shadow: '#00000055',
};

export const INGREDIENTS = [
  { id: 'tomato', name: 'Tomato', color: '#d54636', leaf: '#4d8a36' },
  { id: 'mushroom', name: 'Mushroom', color: '#a8795b', leaf: '#e0c9ac' },
  { id: 'noodle', name: 'Noodle', color: '#e9bd65', leaf: '#f6dfad' },
  { id: 'herb', name: 'Herb', color: '#5b9c45', leaf: '#8ccb62' },
  { id: 'fish', name: 'Fish', color: '#8fb6c4', leaf: '#d9edf2' },
  { id: 'pepper', name: 'Pepper', color: '#c4433b', leaf: '#4d8a36' },
  { id: 'rice', name: 'Rice', color: '#f0e6cf', leaf: '#d8cbb0' },
  { id: 'lemon', name: 'Lemon', color: '#e8c846', leaf: '#7cae42' },
];

export const SHIFT_SECONDS = 240;
export const TICKET_SECONDS = 68;

export const CRATE_X = [96, 208, 320, 432, 544, 656, 768, 880];
export const CRATE_Y = 660;

export const STATIONS = {
  prep: { x: 104, y: 430, w: 190, h: 132, label: 'CHOP BOARD' },
  stove: { x: 340, y: 430, w: 190, h: 132, label: 'EMBER STOVE' },
  assembly: { x: 576, y: 430, w: 190, h: 132, label: 'PLATING BENCH' },
  pass: { x: 812, y: 430, w: 156, h: 132, label: 'THE PASS' },
};

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id) ?? INGREDIENTS[0];
}
