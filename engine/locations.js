//ITEM NAMES ARE:
/*
canned_food
protein_bar
fresh_fruit
military_rations
water_bottle
soda_can
energy_drink
bandage
medical_supplies
antibiotics
fishing_rod
junk
backpack
glock
knife
rifle
pistol
hoe
leadpipe
m4a1
*/
var LOCATIONS = {
  // Northwest Region
  lopatino: {
      name: 'Lopatino',
      description: 'A small village close to the NWAF. Abandoned houses dot the landscape.',
      connections: ['nwaf', 'novaya_petrovka', 'vybor', 'myshkino'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.1,
          water_bottle: 0.15,
          soda_can: 0.1,
          bandage: 0.1,
          knife: 0.05,
          hoe: 0.05,
          fresh_fruit: 0.1
      },
      zombieChance: 0.3
  },
  novaya_petrovka: {
      name: 'Novaya Petrovka',
      description: 'The most North-Western town in Chernarus. Directly above the NWAF.',
      connections: ['nwaf', 'tisy', 'severograd', 'lopatino', 'kamensk'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.1,
          water_bottle: 0.15,
          soda_can: 0.1,
          bandage: 0.1,
          knife: 0.05,
          junk: 0.05,
          hoe: 0.05,
          glock: 0.05
      },
      zombieChance: 0.3
  },
  nwaf: {
      name: 'NWAF',
      description: 'The North-West Airfield is a very dangerous military area with barracks and hangars.',
      connections: ['vybor', 'tisy', 'lopatino', 'novaya_petrovka', 'kabanino'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.15,
          medical_supplies: 0.15,
          pistol: 0.12,
          rifle: 0.08,
          knife: 0.1,
          mosinRifle: 0.1,
          backpack: 0.1,
          m4a1: 0.05,
          antibiotics: 0.1
      },
      zombieChance: 0.5
  },
  tisy: {
      name: 'Tisy',
      description: 'A heavily fortified military base with underground bunkers. Extremely dangerous.',
      connections: ['nwaf', 'novaya_petrovka', 'kamensk'],
      lootTable: {
          military_rations: 0.25,
          energy_drink: 0.15,
          medical_supplies: 0.2,
          pistol: 0.1,
          rifle: 0.15,
          knife: 0.1,
          mosinRifle: 0.1,
          m4a1: 0.05,
          backpack: 0.05
      },
      zombieChance: 0.6
  },
  
  // Northeast Region
  kamensk: {
      name: 'Kamensk',
      description: 'A military town near Tisy base. Barracks and vehicle depots line the streets.',
      connections: ['tisy', 'severograd', 'krasnostav', 'novaya_petrovka'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.1,
          medical_supplies: 0.15,
          pistol: 0.1,
          rifle: 0.1,
          junk: 0.1,
          hoe: 0.05,
          m4a1: 0.02,
          backpack: 0.05
      },
      zombieChance: 0.45
  },
  krasnostav: {
      name: 'Krasnostav',
      description: 'A large northeastern town with an airfield and police station.',
      connections: ['kamensk', 'severograd', 'svetlojarsk', 'berezino'],
      lootTable: {
          canned_food: 0.2,
          protein_bar: 0.15,
          water_bottle: 0.15,
          energy_drink: 0.1,
          medical_supplies: 0.1,
          pistol: 0.12,
          hoe: 0.05,
          junk: 0.08,
          backpack: 0.1
      },
      zombieChance: 0.4
  },
  
  // Central-East Region
  gorka: {
      name: 'Gorka',
      description: 'A hillside town with a military checkpoint. Strategic position overlooking valleys.',
      connections: ['severograd', 'polana', 'berezino'],
      lootTable: {
          military_rations: 0.15,
          canned_food: 0.15,
          water_bottle: 0.15,
          medical_supplies: 0.1,
          pistol: 0.1,
          knife: 0.1,
          junk: 0.1,
          m4a1: 0.02,
          backpack: 0.05,
          hoe: 0.05,
          glock: 0.05
      },
      zombieChance: 0.35
  },
  polana: {
      name: 'Polana',
      description: 'A factory town with large industrial buildings and worker housing.',
      connections: ['gorka', 'berezino', 'solnichniy'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.1,
          water_bottle: 0.15,
          junk: 0.2,
          bandage: 0.1,
          hoe: 0.05,
          knife: 0.1,
          energy_drink: 0.1
      },
      zombieChance: 0.3
  },
  
  // Coastal Towns
  rify: {
      name: 'Rify',
      description: 'A small coastal village with fishing boats. The sea breeze carries an eerie silence.',
      connections: ['berezino', 'svetlojarsk', 'solnichniy'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.15,
          water_bottle: 0.2,
          fishing_rod: 0.2,
          knife: 0.1,
          bandage: 0.1,
          m4a1: 0.02,
          soda_can: 0.05
      },
      zombieChance: 0.2
  },
  
  // Central Region
  stary_sobor: {
      name: 'Stary Sobor',
      description: 'An old town with a military tent camp. Once a major military staging area.',
      connections: ['novy_sobor', 'kabanino', 'guglovo', 'vybor'],
      lootTable: {
          military_rations: 0.18,
          energy_drink: 0.12,
          medical_supplies: 0.15,
          pistol: 0.1,
          rifle: 0.1,
          junk: 0.1,
          bandage: 0.15,
          glock: 0.05,
          antibiotics: 0.1
      },
      zombieChance: 0.5
  },
  kabanino: {
      name: 'Kabanino',
      description: 'A small village with scattered houses and a school.',
      connections: ['stary_sobor', 'vybor', 'novy_sobor', 'nwaf'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.15,
          water_bottle: 0.2,
          soda_can: 0.15,
          bandage: 0.15,
          hoe: 0.05,
          knife: 0.1,
          junk: 0.05
      },
      zombieChance: 0.25
  },
  guglovo: {
      name: 'Guglovo',
      description: 'A rural village surrounded by farmland and forests.',
      connections: ['stary_sobor', 'mogilevka', 'staroye', 'novy_sobor'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.2,
          water_bottle: 0.2,
          soda_can: 0.15,
          fishing_rod: 0.1,
          bandage: 0.1
      },
      zombieChance: 0.2
  },
  mogilevka: {
      name: 'Mogilevka',
      description: 'A farming community with barns and agricultural equipment.',
      connections: ['guglovo', 'staroye', 'elektro'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.25,
          water_bottle: 0.2,
          junk: 0.15,
          knife: 0.1,
          bandage: 0.1
      },
      zombieChance: 0.2
  },
  staroye: {
      name: 'Staroye',
      description: 'An old village with traditional houses and a small church.',
      connections: ['mogilevka', 'elektro', 'tulga', 'guglovo'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.2,
          water_bottle: 0.25,
          soda_can: 0.15,
          bandage: 0.15,
          knife: 0.05
      },
      zombieChance: 0.15
  },
  tulga: {
      name: 'Tulga',
      description: 'A hillside village overlooking the coast. Isolated but scenic.',
      connections: ['staroye', 'kamyshovo', 'solnichniy'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.2,
          water_bottle: 0.2,
          hoe: 0.05,
          soda_can: 0.15,
          fishing_rod: 0.15,
          bandage: 0.05
      },
      zombieChance: 0.15
  },
  
  // Western Region
  pavlovo: {
      name: 'Pavlovo',
      description: 'A military town with a base and vehicle maintenance facilities.',
      connections: ['zelenogorsk', 'kamenka', 'kozlovka'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.15,
          medical_supplies: 0.15,
          pistol: 0.1,
          rifle: 0.1,
          mosinRifle: 0.05,
          junk: 0.15,
          m4a1: 0.02,
          backpack: 0.05
      },
      zombieChance: 0.45
  },
  kozlovka: {
      name: 'Kozlovka',
      description: 'A small western village with a few houses and a store.',
      connections: ['pavlovo', 'pogorevka', 'zelenogorsk'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.2,
          water_bottle: 0.2,
          hoe: 0.05,
          soda_can: 0.15,
          bandage: 0.15,
          knife: 0.05
      },
      zombieChance: 0.2
  },
  pogorevka: {
      name: 'Pogorevka',
      description: 'A remote village in the western forests. Very quiet and isolated.',
      connections: ['kozlovka', 'myshkino', 'vybor', 'zelenogorsk', 'lopatino'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.25,
          water_bottle: 0.25,
          fishing_rod: 0.15,
          knife: 0.1,
          bandage: 0.05
      },
      zombieChance: 0.1
  },
  
  // Existing locations (keeping your originals but fixing the duplicate NWAF)
  elektro: {
      name: 'Elektrozavodsk',
      description: 'A coastal city with industrial buildings and residential areas. The sound of waves can be heard nearby.',
      connections: ['cherno', 'prigorodki', 'kamyshovo', 'staroye', 'mogilevka'],
      lootTable: {
          brassKnuckles: 0.15,
          canned_food: 0.25,
          protein_bar: 0.15,
          water_bottle: 0.2,
          hoe: 0.05,
          soda_can: 0.15,
          bandage: 0.1,
          junk: 0.05,
          knife: 0.05,
          pistol: 0.05,
          glock: 0.05
      },
      zombieChance: 0.3
  },
  cherno: {
      name: 'Chernogorsk',
      description: 'A large coastal city with apartment buildings and shops. Many places to search for supplies.',
      connections: ['elektro', 'balota', 'prigorodki', 'kamenka', 'komarovo'],
      lootTable: {
          canned_food: 0.2,
          protein_bar: 0.15,
          fresh_fruit: 0.1,
          water_bottle: 0.15,
          soda_can: 0.1,
          hoe: 0.05,
          bandage: 0.1,
          medical_supplies: 0.1,
          pistol: 0.08,
          knife: 0.02,
          m4a1: 0.02,
          leadpipe: 0.05,
          glock: 0.05
      },
      zombieChance: 0.4
  },
  kamyshovo: {
      name: 'Kamyshovo',
      description: 'A small coastal town with a few houses and a dock. Quiet but potentially dangerous.',
      connections: ['elektro', 'solnichniy', 'prigorodki', 'tulga'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.15,
          water_bottle: 0.2,
          soda_can: 0.15,
          leadpipe: 0.05,
          hoe: 0.05,
          fishing_rod: 0.15,
          bandage: 0.1,
          knife: 0.05
      },
      zombieChance: 0.2
  },
  solnichniy: {
      name: 'Solnichniy Factory',
      description: 'An industrial area with large factory buildings. Good for finding tools and supplies.',
      connections: ['kamyshovo', 'berezino', 'svetlojarsk', 'polana', 'tulga', 'rify'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.15,
          water_bottle: 0.15,
          energy_drink: 0.1,
          junk: 0.2,
          leadpipe: 0.05,
          bandage: 0.1,
          knife: 0.1,
          pistol: 0.05
      },
      zombieChance: 0.35
  },
  berezino: {
      name: 'Berezino',
      description: 'A coastal town with residential buildings and a hospital. Medical supplies might be found here.',
      connections: ['solnichniy', 'svetlojarsk', 'novodmitrovsk', 'polana', 'gorka', 'rify', 'krasnostav'],
      lootTable: {
          canned_food: 0.15,
          brassKnuckles: 0.15,
          protein_bar: 0.1,
          water_bottle: 0.15,
          soda_can: 0.1,
          medical_supplies: 0.2,
          leadpipe: 0.05,
          antibiotics: 0.1,
          bandage: 0.15,
          backpack: 0.05
      },
      zombieChance: 0.25
  },
  balota: {
      name: 'Balota Airfield',
      description: 'An abandoned airfield with hangars and barracks. High-value loot but very dangerous.',
      connections: ['cherno', 'komarovo', 'kamenka', 'pavlovo'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.15,
          medical_supplies: 0.15,
          antibiotics: 0.1,
          bandage: 0.1,
          pistol: 0.1,
          leadpipe: 0.05,
          rifle: 0.1,
          backpack: 0.1,
          mosinRifle: 0.05
      },
      zombieChance: 0.6
  },
  novodmitrovsk: {
      name: 'Novodmitrovsk',
      description: 'A large industrial city in the northeast. Factories and warehouses offer ample loot but attract many infected.',
      connections: ['berezino', 'svetlojarsk', 'severograd'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.15,
          water_bottle: 0.15,
          energy_drink: 0.1,
          junk: 0.2,
          leadpipe: 0.05,
          medical_supplies: 0.1,
          pistol: 0.1,
          backpack: 0.05
      },
      zombieChance: 0.45
  },
  svetlojarsk: {
      name: 'Svetlojarsk',
      description: 'A coastal town in the north with a mix of homes and small businesses. The cold wind carries distant moans.',
      connections: ['solnichniy', 'berezino', 'novodmitrovsk', 'severograd', 'rify', 'krasnostav'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.15,
          leadpipe: 0.05,
          water_bottle: 0.2,
          soda_can: 0.15,
          bandage: 0.1,
          knife: 0.1,
          fishing_rod: 0.05,
          pistol: 0.05
      },
      zombieChance: 0.3
  },
  zelenogorsk: {
      name: 'Zelenogorsk',
      description: 'An inland town with a military checkpoint. Good for military gear but risky due to patrols.',
      connections: ['cherno', 'vybor', 'myshkino', 'novy_sobor', 'pavlovo', 'pogorevka'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.15,
          leadpipe: 0.05,
          medical_supplies: 0.15,
          antibiotics: 0.1,
          bandage: 0.1,
          pistol: 0.1,
          rifle: 0.1,
          backpack: 0.05
      },
      zombieChance: 0.5
  },
  komarovo: {
      name: 'Komarovo',
      description: 'A small coastal village with quaint houses. A quiet place, but resources are scarce.',
      connections: ['balota', 'kamenka', 'cherno'],
      lootTable: {
          canned_food: 0.2,
          fresh_fruit: 0.2,
          water_bottle: 0.25,
          leadpipe: 0.05,
          soda_can: 0.15,
          fishing_rod: 0.15,
          bandage: 0.05
      },
      zombieChance: 0.15
  },
  kamenka: {
      name: 'Kamenka',
      description: 'A remote coastal village at the edge of Chernarus. Isolated but peaceful, with few supplies.',
      connections: ['komarovo', 'balota', 'zelenogorsk', 'cherno', 'pavlovo'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.2,
          water_bottle: 0.25,
          leadpipe: 0.05,
          soda_can: 0.15,
          fishing_rod: 0.15
      },
      zombieChance: 0.1
  },
  prigorodki: {
      name: 'Prigorodki',
      description: 'A small suburb near Elektrozavodsk. Scattered homes and a few stores offer modest loot.',
      connections: ['elektro', 'cherno', 'kamyshovo', 'staroye'],
      lootTable: {
          canned_food: 0.25,
          protein_bar: 0.15,
          water_bottle: 0.2,
          soda_can: 0.15,
          bandage: 0.15,
          junk: 0.05,
          knife: 0.05
      },
      zombieChance: 0.25
  },
  novy_sobor: {
      name: 'Novy Sobor',
      description: 'An inland village with a church and small market. A good stop for basic supplies.',
      connections: ['prigorodki', 'zelenogorsk', 'vybor', 'severograd', 'stary_sobor', 'kabanino', 'guglovo'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.15,
          water_bottle: 0.2,
          soda_can: 0.15,
          bandage: 0.15,
          fishing_rod: 0.05,
          knife: 0.05
      },
      zombieChance: 0.2
  },
  vybor: {
      name: 'Vybor',
      description: 'A central town with a military base nearby. High-value loot but heavily infested with infected.',
      connections: ['zelenogorsk', 'novy_sobor', 'myshkino', 'nwaf', 'lopatino', 'kabanino', 'stary_sobor'],
      lootTable: {
          military_rations: 0.2,
          energy_drink: 0.15,
          medical_supplies: 0.15,
          antibiotics: 0.1,
          bandage: 0.1,
          pistol: 0.1,
          rifle: 0.1,
          junk: 0.05
      },
      zombieChance: 0.55
  },
  myshkino: {
      name: 'Myshkino',
      description: 'A remote western village surrounded by forests.',
      connections: ['zelenogorsk', 'vybor', 'lopatino', 'pogorevka'],
      lootTable: {
          canned_food: 0.25,
          fresh_fruit: 0.2,
          water_bottle: 0.2,
          soda_can: 0.15,
          fishing_rod: 0.15,
          bandage: 0.05
      },
      zombieChance: 0.15
  },
  severograd: {
      name: 'Severograd',
      description: 'A northern industrial town with factories and a hospital.',
      connections: ['novodmitrovsk', 'svetlojarsk', 'novaya_petrovka', 'novy_sobor', 'gorka', 'kamensk', 'krasnostav'],
      lootTable: {
          canned_food: 0.15,
          protein_bar: 0.15,
          water_bottle: 0.15,
          energy_drink: 0.1,
          medical_supplies: 0.2,
          junk: 0.1,
          bandage: 0.1,
          pistol: 0.1,
          backpack: 0.05
      },
      zombieChance: 0.4
  }
};
