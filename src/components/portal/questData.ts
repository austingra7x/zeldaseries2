export interface QuestCheckitem {
  id: string;
  name: string;
  category: 'heart' | 'item' | 'upgrade' | 'quest';
  location: string;
  description?: string;
}

export interface GameQuestData {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  items: QuestCheckitem[];
}

export const ZELDA_GAMES_QUEST_DATA: GameQuestData[] = [
  {
    id: 'oot',
    title: 'Ocarina of Time',
    subtitle: 'N64 / 3DS',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    items: [
      // Heart Pieces
      { id: 'oot-hp-1', name: 'Heart Piece #1 - Kokiri Forest', category: 'heart', location: 'Behind the shop in Kokiri Forest (Hop across logs as Child Link).' },
      { id: 'oot-hp-2', name: 'Heart Piece #2 - Hyrule Field', category: 'heart', location: 'Sink with Iron Boots or Bomb secret grotto near Lake Hylia fence.' },
      { id: 'oot-hp-3', name: 'Heart Piece #3 - Market Dog Lady', category: 'heart', location: 'Return the lost white dog (Richard) to the lady in the Market at night.' },
      { id: 'oot-hp-4', name: 'Heart Piece #4 - Lon Lon Ranch', category: 'heart', location: 'Crawl into the storage tower and move crates behind the sleeping cows.' },
      { id: 'oot-hp-5', name: 'Heart Piece #5 - Kakariko Graveyard Tour', category: 'heart', location: 'Pay Dampé 10 Rupees to dig up glowing dirt patches during Gravedigging Tour.' },
      { id: 'oot-hp-6', name: 'Heart Piece #6 - Windmill Song of Storms', category: 'heart', location: 'Jump onto the spinning windmill blades inside Kakariko Windmill.' },
      { id: 'oot-hp-7', name: 'Heart Piece #7 - Death Mountain Trail', category: 'heart', location: 'Drop onto the ledge above Dodongo\'s Cavern entrance using Kaepora Gaebora.' },
      { id: 'oot-hp-8', name: 'Heart Piece #8 - Goron City Vase', category: 'heart', location: 'Throw a lighted Bomb into the giant spinning Goron Urn when the happy face aligns.' },
      { id: 'oot-hp-9', name: 'Heart Piece #9 - Zora\'s River Frog Chorus', category: 'heart', location: 'Play the Song of Storms and all 5 Ocarina song requests to the frogs in Zora\'s River.' },
      { id: 'oot-hp-10', name: 'Heart Piece #10 - Lake Hylia Fishing Pond', category: 'heart', location: 'Catch a 10+ lb fish as Child Link at the Lake Hylia Fishing Hole.' },
      
      // Items & Gear
      { id: 'oot-item-1', name: 'Kokiri Sword', category: 'item', location: 'Kokiri Forest - Crawl through training maze.' },
      { id: 'oot-item-2', name: 'Deku Shield', category: 'item', location: 'Purchased at Kokiri Shop for 40 Rupees.' },
      { id: 'oot-item-3', name: 'Fairy Slingshot', category: 'item', location: 'Inside the Great Deku Tree.' },
      { id: 'oot-item-4', name: 'Boomerang', category: 'item', location: 'Inside Jabu-Jabu\'s Belly.' },
      { id: 'oot-item-5', name: 'Master Sword', category: 'item', location: 'Temple of Time - Pull from pedestal with 3 Spiritual Stones & Ocarina of Time.' },
      { id: 'oot-item-6', name: 'Hookshot & Longshot', category: 'item', location: 'Beat Dampé\'s Ghost Race & Water Temple mid-boss (Dark Link).' },
      { id: 'oot-item-7', name: 'Megaton Hammer', category: 'item', location: 'Fire Temple dungeon chest.' },
      { id: 'oot-item-8', name: 'Mirror Shield', category: 'item', location: 'Spirit Temple dungeon chest as Adult Link.' },
      { id: 'oot-item-9', name: 'Lens of Truth', category: 'item', location: 'Bottom of the Well as Child Link.' },
      { id: 'oot-item-10', name: 'Biggoron\'s Sword', category: 'item', location: 'Complete the 11-step Adult Link Trading Sequence on Death Mountain.' },

      // Upgrades & Bottles
      { id: 'oot-up-1', name: 'Empty Bottle #1 - Lon Lon Ranch', category: 'upgrade', location: 'Win Super Cucco game from Talon.' },
      { id: 'oot-up-2', name: 'Empty Bottle #2 - Kakariko Village', category: 'upgrade', location: 'Gather all 7 lost Cuccos for Anju.' },
      { id: 'oot-up-3', name: 'Empty Bottle #3 - Lake Hylia', category: 'upgrade', location: 'Diving in Lake Hylia with Ruto\'s Letter.' },
      { id: 'oot-up-4', name: 'Empty Bottle #4 - Ghost Shop', category: 'upgrade', location: 'Catch and turn in all 10 Big Poes in Hyrule Field to Ghost Shopkeeper.' },
      { id: 'oot-up-5', name: 'Giant\'s Wallet (500 Rupees)', category: 'upgrade', location: 'Collect 50 Gold Skulltula Tokens.' },
      { id: 'oot-up-6', name: 'Goron Tunic & Zora Tunic', category: 'upgrade', location: 'Goron City shop/Link Jr & Zora\'s Domain King Zora thawed.' },

      // Quests
      { id: 'oot-q-1', name: 'Defeat Queen Gohma (Great Deku Tree)', category: 'quest', location: 'Kokiri Forest' },
      { id: 'oot-q-2', name: 'Defeat King Dodongo (Dodongo\'s Cavern)', category: 'quest', location: 'Death Mountain' },
      { id: 'oot-q-3', name: 'Defeat Barinade (Jabu-Jabu\'s Belly)', category: 'quest', location: 'Zora\'s Fountain' },
      { id: 'oot-q-4', name: 'Awaken Phantom Ganon (Forest Temple)', category: 'quest', location: 'Lost Woods' },
      { id: 'oot-q-5', name: 'Awaken Volvagia (Fire Temple)', category: 'quest', location: 'Death Mountain Crater' },
      { id: 'oot-q-6', name: 'Awaken Morpha (Water Temple)', category: 'quest', location: 'Lake Hylia' },
      { id: 'oot-q-7', name: 'Awaken Bongo Bongo (Shadow Temple)', category: 'quest', location: 'Kakariko Graveyard' },
      { id: 'oot-q-8', name: 'Awaken Twinrova (Spirit Temple)', category: 'quest', location: 'Desert Colossus' },
      { id: 'oot-q-9', name: 'Conquer Ganon\'s Castle & Defeat Ganondorf', category: 'quest', location: 'Ganon\'s Tower' }
    ]
  },
  {
    id: 'mm',
    title: 'Majora\'s Mask',
    subtitle: 'N64 / 3DS',
    coverImage: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80',
    items: [
      // Heart Pieces
      { id: 'mm-hp-1', name: 'Heart Piece #1 - Clock Tower Roof', category: 'heart', location: 'At the end of first 3-day cycle as Deku Link.' },
      { id: 'mm-hp-2', name: 'Heart Piece #2 - Postman\'s Timing Minigame', category: 'heart', location: 'Stop the postman timer at exactly 10.00 seconds.' },
      { id: 'mm-hp-3', name: 'Heart Piece #3 - Clock Town Playground', category: 'heart', location: 'Complete the Deku Scrub Playground minigame all 3 days.' },
      { id: 'mm-hp-4', name: 'Heart Piece #4 - Mayor\'s Residence', category: 'heart', location: 'Wear the Couple\'s Mask during the council meeting to receive it.' },
      { id: 'mm-hp-5', name: 'Heart Piece #5 - Swamp Shooting Gallery', category: 'heart', location: 'Score a perfect 2120 points at the Swamp Shooting Gallery.' },
      { id: 'mm-hp-6', name: 'Heart Piece #6 - Marine Lab Fish Feeding', category: 'heart', location: 'Feed 5 smaller fish to the aquarium fish until it grows and drops a heart.' },

      // Items & Masks
      { id: 'mm-item-1', name: 'Deku Mask', category: 'item', location: 'Cure the Deku curse with Song of Healing.' },
      { id: 'mm-item-2', name: 'Goron Mask', category: 'item', location: 'Heal Darmani\'s spirit in Mountain Village.' },
      { id: 'mm-item-3', name: 'Zora Mask', category: 'item', location: 'Heal Mikau at Great Bay Coast.' },
      { id: 'mm-item-4', name: 'Fierce Deity Mask', category: 'item', location: 'Trade all 20 non-transformation masks to children on the Moon.' },
      { id: 'mm-item-5', name: 'Bunny Hood', category: 'item', location: 'Match chicken chicks with Bremen Mask at Cucco Shack.' },
      { id: 'mm-item-6', name: 'Blast Mask', category: 'item', location: 'Save the old lady from Sakon the thief in North Clock Town at 12:00 AM Night 1.' },
      { id: 'mm-item-7', name: 'Mask of Truth', category: 'item', location: 'Clear the Swamp Spider House.' },
      { id: 'mm-item-8', name: 'Gilded Sword', category: 'item', location: 'Reforge sword at Mountain Smithy using Gold Dust won from Goron Races.' },

      // Upgrades & Bottles
      { id: 'mm-up-1', name: 'Bottle #1 - Kotake Poison Cure', category: 'upgrade', location: 'Received from Kotake in Southern Swamp.' },
      { id: 'mm-up-2', name: 'Bottle #2 - Goron Race Gold Dust', category: 'upgrade', location: 'Win the Spring Goron Race after Snowhead.' },
      { id: 'mm-up-3', name: 'Bottle #3 - Romani Ranch Chateau Romani', category: 'upgrade', location: 'Protect Kremia\'s milk delivery cart from bandits.' },
      { id: 'mm-up-4', name: 'Bottle #4 - Beaver Race', category: 'upgrade', location: 'Win both swimming races against the Beaver Brothers in Zora Cape.' },
      { id: 'mm-up-5', name: 'Bottle #5 - Ikana Graveyard Dampé', category: 'upgrade', location: 'Help Dampé dig up flames in Ikana Graveyard on Night 3.' },
      { id: 'mm-up-6', name: 'Bottle #6 - Anju & Kafei Quest', category: 'upgrade', location: 'Complete full Anju & Kafei wedding storyline.' },

      // Quests
      { id: 'mm-q-1', name: 'Purify Woodfall Temple (Odolwa)', category: 'quest', location: 'Southern Swamp' },
      { id: 'mm-q-2', name: 'Melt Snowhead Temple (Goht)', category: 'quest', location: 'Snowhead Mountains' },
      { id: 'mm-q-3', name: 'Cleanse Great Bay Temple (Gyorg)', category: 'quest', location: 'Great Bay Ocean' },
      { id: 'mm-q-4', name: 'Invert Stone Tower Temple (Twinmold)', category: 'quest', location: 'Ikana Canyon' },
      { id: 'mm-q-5', name: 'Reunite Anju & Kafei', category: 'quest', location: 'Clock Town & Ikana' },
      { id: 'mm-q-6', name: 'Defeat Majora\'s Mask on the Moon', category: 'quest', location: 'The Moon' }
    ]
  },
  {
    id: 'totk',
    title: 'Tears of the Kingdom',
    subtitle: 'Nintendo Switch',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    items: [
      // Heart Pieces / Containers
      { id: 'totk-hp-1', name: '4 Light Blessings -> Heart Container #1', category: 'heart', location: 'Complete 4 Shrines & pray at Goddess Statue.' },
      { id: 'totk-hp-2', name: 'Wind Temple Boss Heart Container', category: 'heart', location: 'Defeat Colgera over Hebra.' },
      { id: 'totk-hp-3', name: 'Fire Temple Boss Heart Container', category: 'heart', location: 'Defeat Marbled Gohma in Goronbi.' },
      { id: 'totk-hp-4', name: 'Water Temple Boss Heart Container', category: 'heart', location: 'Defeat Mucktorok on Great Sky Island.' },
      { id: 'totk-hp-5', name: 'Lightning Temple Boss Heart Container', category: 'heart', location: 'Defeat Queen Gibdo in Gerudo Desert.' },
      { id: 'totk-hp-6', name: 'Spirit Temple Boss Heart Container', category: 'heart', location: 'Defeat Seized Construct in Depths.' },

      // Items & Zonai Relics
      { id: 'totk-item-1', name: 'Ultrahand, Fuse, Recall, Ascend', category: 'item', location: 'Great Sky Island Shrines.' },
      { id: 'totk-item-2', name: 'Autobuild Ability', category: 'item', location: 'Great Abandoned Central Mine in the Depths.' },
      { id: 'totk-item-3', name: 'Restored Master Sword', category: 'item', location: 'Pull from the Light Dragon\'s head with 2 Stamina Wheels.' },
      { id: 'totk-item-4', name: 'Hylian Shield', category: 'item', location: 'Hyrule Castle Docks secret furnace chest.' },
      { id: 'totk-item-5', name: 'Champion\'s Leathers', category: 'item', location: 'Light torches in Hyrule Castle Throne Room.' },
      { id: 'totk-item-6', name: 'Glide Armor Set (3 pieces)', category: 'item', location: 'Complete sky diving ceremonial trials over Courage, Bravery & Valor islands.' },

      // Upgrades & Inventory
      { id: 'totk-up-1', name: 'Expand Weapon/Shield Stash (Hestu)', category: 'upgrade', location: 'Give Korok Seeds to Hestu near Lookout Landing / Korok Forest.' },
      { id: 'totk-up-2', name: 'Zonai Battery Expansions', category: 'upgrade', location: 'Trade 100 Crystallized Charges at Crystal Refineries.' },
      { id: 'totk-up-3', name: 'Great Fairy Armor Enhancements', category: 'upgrade', location: 'Unlock Great Fairies via Stable Trotters Musical Quests.' },

      // Quests
      { id: 'totk-q-1', name: 'Regional Phenomena: Wind, Fire, Water, Lightning', category: 'quest', location: 'Four corners of Hyrule' },
      { id: 'totk-q-2', name: 'Fifth Sage Mineru & Spirit Temple Construct', category: 'quest', location: 'Dragonhead Island & Depths' },
      { id: 'totk-q-3', name: 'Master Sword Geoglyphs & Dragon Tears', category: 'quest', location: '12 Impa Geoglyphs across Hyrule' },
      { id: 'totk-q-4', name: 'Infiltrate Gloom\'s Lair & Defeat Demon King Ganondorf', category: 'quest', location: 'Deep below Hyrule Castle' }
    ]
  },
  {
    id: 'botw',
    title: 'Breath of the Wild',
    subtitle: 'Wii U / Switch',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80',
    items: [
      { id: 'botw-hp-1', name: 'Great Plateau Shrines -> First Heart Container', category: 'heart', location: 'Temple of Time Goddess Statue' },
      { id: 'botw-hp-2', name: 'Vah Ruta Heart Container', category: 'heart', location: 'Defeat Waterblight Ganon' },
      { id: 'botw-hp-3', name: 'Vah Rudania Heart Container', category: 'heart', location: 'Defeat Fireblight Ganon' },
      { id: 'botw-hp-4', name: 'Vah Medoh Heart Container', category: 'heart', location: 'Defeat Windblight Ganon' },
      { id: 'botw-hp-5', name: 'Vah Naboris Heart Container', category: 'heart', location: 'Defeat Thunderblight Ganon' },

      { id: 'botw-item-1', name: 'Master Sword', category: 'item', location: 'Pull from Korok Forest with 13 Red Hearts.' },
      { id: 'botw-item-2', name: 'Hylian Shield', category: 'item', location: 'Defeat Stalnox in Hyrule Castle Lockup.' },
      { id: 'botw-item-3', name: 'Paraglider', category: 'item', location: 'King Rhoam on Great Plateau.' },
      { id: 'botw-item-4', name: 'Barber Sheikah Slate Runes (Remote Bomb, Stasis, Cryonis, Magnesis)', category: 'item', location: 'Great Plateau Shrines.' },

      { id: 'botw-up-1', name: 'Master Cycle Zero (DLC)', category: 'upgrade', location: 'Complete Monk Maz Koshia Champion\'s Ballad.' },
      { id: 'botw-up-2', name: 'Full Inventory Expansion (Hestu)', category: 'upgrade', location: 'Find Korok Seeds across Hyrule.' },

      { id: 'botw-q-1', name: 'Free the 4 Divine Beasts', category: 'quest', location: 'Zora, Goron, Rito, Gerudo' },
      { id: 'botw-q-2', name: 'Recover 12 Captured Memories', category: 'quest', location: 'Hyrule Landmarks with Pikango' },
      { id: 'botw-q-3', name: 'Build Tarrey Town (From the Ground Up)', category: 'quest', location: 'Akkala Region with Hudson' },
      { id: 'botw-q-4', name: 'Defeat Calamity Ganon & Dark Beast Ganon', category: 'quest', location: 'Hyrule Castle Sanctum' }
    ]
  },
  {
    id: 'alttp',
    title: 'A Link to the Past',
    subtitle: 'SNES / GBA',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    items: [
      { id: 'alttp-hp-1', name: 'Heart Piece #1 - Sanctuary Cliff', category: 'heart', location: 'Drop down ledge above Sanctuary.' },
      { id: 'alttp-hp-2', name: 'Heart Piece #2 - Lost Woods Bush', category: 'heart', location: 'Cut bushes in top left corner of Lost Woods.' },
      { id: 'alttp-hp-3', name: 'Heart Piece #3 - Kakariko Well', category: 'heart', location: 'Drop into hole from top ledge near Kakariko.' },

      { id: 'alttp-item-1', name: 'Master Sword (Lvl 2)', category: 'item', location: 'Pull from Lost Woods with 3 Pendants of Virtue.' },
      { id: 'alttp-item-2', name: 'Tempered & Golden Sword (Lvl 3 & 4)', category: 'item', location: 'Dwarven Smithies & Pyramid Fairy.' },
      { id: 'alttp-item-3', name: 'Moon Pearl', category: 'item', location: 'Tower of Hera dungeon chest.' },
      { id: 'alttp-item-4', name: 'Magic Hammer', category: 'item', location: 'Dark Palace chest.' },
      { id: 'alttp-item-5', name: 'Hookshot', category: 'item', location: 'Swamp Palace chest.' },

      { id: 'alttp-up-1', name: 'Ether, Bombos & Quake Medallions', category: 'upgrade', location: 'Stand on tablets with Book of Mudora.' },
      { id: 'alttp-up-2', name: 'Blue & Red Mail', category: 'upgrade', location: 'Ice Palace & Ganon\'s Tower chests.' },

      { id: 'alttp-q-1', name: 'Collect 3 Pendants of Virtue (Light World)', category: 'quest', location: 'Eastern Palace, Desert Palace, Tower of Hera' },
      { id: 'alttp-q-2', name: 'Rescue the 7 Maiden Crystals (Dark World)', category: 'quest', location: 'Dark World Dungeons 1 through 7' },
      { id: 'alttp-q-3', name: 'Defeat Agahnim & Ganon', category: 'quest', location: 'Hyrule Castle Tower & Pyramid of Power' }
    ]
  },
  {
    id: 'ww',
    title: 'The Wind Waker',
    subtitle: 'GameCube / Wii U HD',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    items: [
      { id: 'ww-hp-1', name: 'Heart Piece #1 - Outset Island Combat Trial', category: 'heart', location: 'Score 500 strikes against Orca.' },
      { id: 'ww-hp-2', name: 'Heart Piece #2 - Windfall Hide and Seek', category: 'heart', location: 'Find all 4 Killer Bees kids on Windfall.' },

      { id: 'ww-item-1', name: 'Hero\'s Sword & Master Sword', category: 'item', location: 'Outset Island / Hyrule Castle Basement.' },
      { id: 'ww-item-2', name: 'Wind Waker Baton', category: 'item', location: 'Given by King of Red Lions on Dragon Roost.' },
      { id: 'ww-item-3', name: 'Grappling Hook & Deku Leaf', category: 'item', location: 'Dragon Roost & Forbidden Woods.' },
      { id: 'ww-item-4', name: 'Iron Boots & Power Bracelets', category: 'item', location: 'Ice Ring Isle & Fire Mountain.' },

      { id: 'ww-up-1', name: 'Swift Sail (HD Version)', category: 'upgrade', location: 'Windfall Island Auction House at night.' },

      { id: 'ww-q-1', name: 'Rescue Aryll from Forsaken Fortress', category: 'quest', location: 'Forsaken Fortress' },
      { id: 'ww-q-2', name: 'Awaken Earth & Wind Sages (Medli & Makar)', category: 'quest', location: 'Earth Temple & Wind Temple' },
      { id: 'ww-q-3', name: 'Gather 8 Triforce Charts & Shards', category: 'quest', location: 'The Great Sea Charts & Salvaging' },
      { id: 'ww-q-4', name: 'Defeat Ganondorf in Underwater Hyrule', category: 'quest', location: 'Ganon\'s Tower underwater' }
    ]
  }
];
