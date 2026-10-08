import { SanctuaryTask } from '../types';

export const SANCTUARY_TASKS: SanctuaryTask[] = [
  {
    id: 'task_1',
    title: 'Clear Weeds & Tidy Grounds',
    description: 'Clean up overgrowth and fallen leaves to prepare the sanctuary lawn for Piper & Bodacious.',
    costStars: 1,
    completed: false,
    furnitureKey: 'clean_lawn',
    defaultStyle: 0,
    styles: [
      { name: 'Emerald Lawn', description: 'Freshly cut lush spring green velvet grass', previewColor: '#22c55e', icon: '🌱' },
      { name: 'Sunlit Meadow', description: 'Warm golden lawn dotted with tiny white clover blossoms', previewColor: '#84cc16', icon: '🌼' },
      { name: 'Zen Moss Carpet', description: 'Tranquil Japanese garden moss & neat raked stone border', previewColor: '#15803d', icon: '🌿' }
    ]
  },
  {
    id: 'task_2',
    title: 'Erect Decorative Perimeter Fence',
    description: 'Install a secure, charming fence keeping the kittens safe while watching the butterflies.',
    costStars: 1,
    completed: false,
    furnitureKey: 'fence',
    defaultStyle: 0,
    styles: [
      { name: 'White Picket Fence', description: 'Classic American cottage wooden picket with curved tops', previewColor: '#f8fafc', icon: '🏡' },
      { name: 'Rustic Redwood Lattice', description: 'Warm cedar timber lattice with climbing ivy vines', previewColor: '#b45309', icon: '🪵' },
      { name: 'Wrought Iron Filigree', description: 'Vintage garden wrought iron with cat-paw finials', previewColor: '#334155', icon: '⚜️' }
    ]
  },
  {
    id: 'task_3',
    title: 'Build Sunlit Sanctuary Gazebo',
    description: 'A grand covered gazebo for Bodacious and Piper to nap out of the midday sun.',
    costStars: 2,
    completed: false,
    furnitureKey: 'gazebo',
    defaultStyle: 0,
    styles: [
      { name: 'Tropical Thatched Gazebo', description: 'Breeze-friendly tiki thatch roof with bamboo pillars & white drapes', previewColor: '#d97706', icon: '🏝️' },
      { name: 'Victorian Rose Pavilion', description: 'Carved white timber cupola enveloped in pink roses', previewColor: '#f43f5e', icon: '🌸' },
      { name: 'Modern Nordic Timber Deck', description: 'Clean teak slats, warm downlights, and cozy canvas canopy', previewColor: '#78350f', icon: '⛺' }
    ]
  },
  {
    id: 'task_4',
    title: "Piper's Multi-Tier Cat Tree",
    description: 'High climbing tower with natural sisal rope scratching posts and hanging feather toys.',
    costStars: 2,
    completed: false,
    furnitureKey: 'scratching_post',
    defaultStyle: 0,
    styles: [
      { name: 'Natural Birch Forest Tree', description: 'Real birch branches with plush mossy perches & climbing leaves', previewColor: '#16a34a', icon: '🌳' },
      { name: 'Pastel Castle Tower', description: 'Turquoise and peach padded towers with a lookout crow’s nest', previewColor: '#06b6d4', icon: '🏰' },
      { name: 'Modern Bohemian Sisal', description: 'Macrame rope weave, natural jute scratching cylinders, rattan basket', previewColor: '#d97706', icon: '🧺' }
    ]
  },
  {
    id: 'task_5',
    title: "Bodacious's Royal Lounging Bed",
    description: 'An ultra-soft orthopedic cushion befitting a fluffy Maine Coon of royal distinction.',
    costStars: 2,
    completed: false,
    furnitureKey: 'cat_bed',
    defaultStyle: 0,
    styles: [
      { name: 'Royal Velvet Donut', description: 'Deep purple velvet with golden embroidery and tufted feather rim', previewColor: '#7c3aed', icon: '👑' },
      { name: 'Cloud-Nine Sherpa Nest', description: 'Fluffy white marshmallow fleece with heated inner pad', previewColor: '#f1f5f9', icon: '☁️' },
      { name: 'Sunburst Rattan Daybed', description: 'Hand-woven wicker chaise lounge with floral linen cushion', previewColor: '#eab308', icon: '☀️' }
    ]
  },
  {
    id: 'task_6',
    title: 'Install Purr-fect Tiered Fountain',
    description: 'Gurgling aerated drinking fountain with gentle flowing water that cats adore.',
    costStars: 2,
    completed: false,
    furnitureKey: 'fountain',
    defaultStyle: 0,
    styles: [
      { name: 'Carved Marble Lotus', description: 'White marble lotus petal bowls with crystal-clear bubbler', previewColor: '#38bdf8', icon: '⛲' },
      { name: 'Bamboo Shishi-Odoshi', description: 'Rock basin with rhythmic tilting bamboo pipe & smooth river pebbles', previewColor: '#65a30d', icon: '🎋' },
      { name: 'Mosaic Birdbath Fountain', description: 'Handcrafted Mediterranean blue & turquoise ceramic tiles', previewColor: '#2563eb', icon: '🌊' }
    ]
  },
  {
    id: 'task_7',
    title: 'Plant Blooming Catnip & Flowerbeds',
    description: 'Lush organic cat grass, fragrant catmint, and colorful butterfly-attracting blooms.',
    costStars: 2,
    completed: false,
    furnitureKey: 'flowers',
    defaultStyle: 0,
    styles: [
      { name: 'Catnip & Lavender Wonderland', description: 'Purple lavender bushes surrounded by fresh organic cat grass', previewColor: '#a855f7', icon: '🪻' },
      { name: 'Tropical Paradise Hibiscus', description: 'Bright pink and orange hibiscus blooms with palm ferns', previewColor: '#f97316', icon: '🌺' },
      { name: 'Sunflowers & Daisies', description: 'Cheerful yellow sunflowers waving gently in the afternoon sun', previewColor: '#eab308', icon: '🌻' }
    ]
  },
  {
    id: 'task_8',
    title: 'Add Poolside Sun Loungers & Umbrella',
    description: 'Chic lounge chairs with adjustable shade umbrellas for warm-weather afternoon catnaps.',
    costStars: 2,
    completed: false,
    furnitureKey: 'loungers',
    defaultStyle: 0,
    styles: [
      { name: 'Striped Cabana Set', description: 'Yellow and white striped canvas recliners with fringe umbrella', previewColor: '#f59e0b', icon: '🏖️' },
      { name: 'Teak Wood Minimalist', description: 'Warm Scandinavian teak wood loungers with seafoam green padding', previewColor: '#0d9488', icon: '🪵' },
      { name: 'Pink Flamingo Patio', description: 'Coral pink sun loungers with mint green cocktail side table', previewColor: '#ec4899', icon: '🦩' }
    ]
  },
  {
    id: 'task_9',
    title: "Piper & Bodacious's Tuna Feast Table",
    description: 'A celebratory gourmet buffet loaded with salmon sashimi treats, milk saucers, and catnip dips!',
    costStars: 3,
    completed: false,
    furnitureKey: 'feast_table',
    defaultStyle: 0,
    styles: [
      { name: 'Golden Seafood Banquet', description: 'Fine china platters of fresh tuna tartare, prawns, and cream bowls', previewColor: '#f59e0b', icon: '🍣' },
      { name: 'Rustic Picnic Spread', description: 'Woven gingham picnic basket brimming with catnip mice and fish biscuits', previewColor: '#ef4444', icon: '🧺' },
      { name: 'Cat Cafe Dessert Table', description: 'Kitty-shaped milk puddings, salmon mousse, and silver saucers', previewColor: '#ec4899', icon: '🧁' }
    ]
  }
];
