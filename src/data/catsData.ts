import { Cat } from '../types';

export const INITIAL_CATS: Record<'piper' | 'bodacious', Cat> = {
  piper: {
    id: 'piper',
    name: 'Piper',
    breed: 'Calico Mix',
    description: 'A sassy, sweet Calico mix with striking ginger, chocolate, and cream patches. She loves high perches and warm sunspots!',
    avatarColor: '#ea580c',
    furPattern: 'calico',
    happiness: 85,
    selectedCostume: 'none',
    unlockedCostumes: ['none', 'sailor_bib', 'hawaiian_lei', 'red_bowtie'],
    quotes: [
      "Prrr! That sunbeam on the gazebo is mine!",
      "I saw you pull off that 5-tile yarn bomb! Meow-velous!",
      "Scritches behind the ears? Yes please, human!",
      "Bodacious may have the Maine Coon fluff, but I have the calico attitude!",
      "More milk bottles dropped, more treats for Piper!"
    ]
  },
  bodacious: {
    id: 'bodacious',
    name: 'Bodacious',
    breed: 'Fluffy Maine Coon',
    description: 'A small, adorably fluffy Maine Coon with magnificent tufted lynx-tipped ears, a majestic feather-duster tail, and royal grace.',
    avatarColor: '#78716c',
    furPattern: 'fluffy_mainecoon',
    happiness: 90,
    selectedCostume: 'royal_crown',
    unlockedCostumes: ['none', 'royal_crown', 'fluffy_scarf', 'gold_sunglasses'],
    quotes: [
      "Behold my magnificent Maine Coon ear tufts!",
      "I am small, but my fluff contains infinite universe.",
      "You built this whole sanctuary just for us? Bodacious approves!",
      "Mrow! Petting time? 3 belly rubs maximum, then it's bunny-kicks!",
      "A true feline king requires the coziest velvet cushion."
    ]
  }
};

export interface CostumeItem {
  id: string;
  name: string;
  catId: 'piper' | 'bodacious' | 'both';
  icon: string;
  cost: number;
  unlockedByDefault: boolean;
  description: string;
}

export const COSTUMES: CostumeItem[] = [
  { id: 'none', name: 'Natural Fluff', catId: 'both', icon: '✨', cost: 0, unlockedByDefault: true, description: 'Au naturel, pristine coat' },
  { id: 'sailor_bib', name: 'Sailor Bib', catId: 'piper', icon: '⚓', cost: 150, unlockedByDefault: true, description: 'Classic blue sailor collar with anchor knot' },
  { id: 'hawaiian_lei', name: 'Hibiscus Flower Lei', catId: 'piper', icon: '🌺', cost: 250, unlockedByDefault: true, description: 'Tropical blossoms for island vacation vibes' },
  { id: 'red_bowtie', name: 'Dapper Red Bowtie', catId: 'piper', icon: '🎀', cost: 200, unlockedByDefault: true, description: 'Sharp gentleman bowtie' },
  { id: 'witch_hat', name: 'Spooky Mini Hat', catId: 'piper', icon: '🎩', cost: 300, unlockedByDefault: false, description: 'Mysterious feline sorcery cap' },

  { id: 'royal_crown', name: 'Gilded Royal Crown', catId: 'bodacious', icon: '👑', cost: 350, unlockedByDefault: true, description: 'A regal jewel-encrusted golden crown for King Bodacious' },
  { id: 'fluffy_scarf', name: 'Pink Cashmere Scarf', catId: 'bodacious', icon: '🧣', cost: 200, unlockedByDefault: true, description: 'Ultra-soft cozy winter scarf' },
  { id: 'gold_sunglasses', name: 'Cool Gold Aviators', catId: 'bodacious', icon: '🕶️', cost: 280, unlockedByDefault: true, description: 'Pure swagger for a VIP kitty' },
  { id: 'gentleman_monocle', name: 'Vintage Monocle', catId: 'bodacious', icon: '🧐', cost: 320, unlockedByDefault: false, description: 'Distinguished scholarly Maine Coon look' }
];
