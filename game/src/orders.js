// Recipes, order tickets and the slow ramp of service pressure.
import { TICKET_SECONDS, ingredientById } from './config.js';

export const RECIPES = [
  { id: 'ember', name: 'Ember Noodles', parts: ['noodle', 'pepper', 'herb'], color: '#d9682f' },
  { id: 'garden', name: 'Market Salad', parts: ['tomato', 'pepper', 'herb'], color: '#8ba449' },
  { id: 'citrus', name: 'Citrus Fish', parts: ['fish', 'lemon'], color: '#d6b544' },
  { id: 'sunrise', name: 'Sunrise Rice', parts: ['rice', 'tomato'], color: '#de7a42' },
  { id: 'glade', name: 'Glade Bowl', parts: ['mushroom', 'rice', 'herb'], color: '#789c50' },
];

export function recipeById(id) {
  return RECIPES.find((recipe) => recipe.id === id) ?? RECIPES[0];
}

export function makeOrder(seed, elapsed = 0) {
  const recipe = RECIPES[seed % RECIPES.length];
  const pressure = Math.min(0.45, elapsed / 240);
  const priority = seed % 5 === 0;
  const seconds = Math.round(TICKET_SECONDS * (1 - pressure) * (priority ? 0.8 : 1));
  return {
    id: seed,
    recipeId: recipe.id,
    name: recipe.name,
    color: recipe.color,
    priority,
    parts: recipe.parts.slice(),
    total: seconds,
    remaining: seconds,
  };
}

export function orderMatchesDish(order, dish) {
  if (!order || !dish || dish.parts.length !== order.parts.length) return false;
  const wanted = order.parts.slice().sort().join('|');
  const given = dish.parts.slice().sort().join('|');
  return wanted === given;
}

export function ticketUrgency(order) {
  return 1 - order.remaining / order.total;
}

export function ingredientLabel(id) {
  return ingredientById(id).name;
}
