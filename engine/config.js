var CONFIG = {
  
    //SPAWN THINGS
    starting_health: 100, //as a %
    starting_hunger: 50, //as a %
    starting_thirst: 50, //as a %
    starting_carry_space: 4, //as a number of items
    starting_inventory: [ //what you carry at spawn as a name list
      'fresh_fruit',
    ],
    
    //DAMAGE
    base_damage: 10, //damage with fists as points of damage
    zombie_damage: 15, //damage from zombies
    infection_chance: 0.15, //the change of infection (0.15 = 15%)
    zombie_chance: 0.45, //the chance of being attacked when travelling (0.5 = 50%)
    encounter_chance: 0.2, //the chance of an encounter happening when travelling (0.25 = 25%)
    interactTime: 1250, //the time you have to interact with the dodge/attack button
    
    //TIMINGS & TICKS
    action_duration: 3000, //how long an action takes in ms (3000 = 3 sec)
    tick_time: 3000, //how fast the game progresses in ms (3000 = 3 sec)
    score_per_tick: 1, //how many points the user gets per tick
    stat_modulation: 4, //how often hunger/thirst/health decrease (in number of ticks)
    
    //STAT THINGS
    hunger_depletion: 1, //how much hunger is reduced by every tick
    thirst_depletion: 2, //how much thirst is reduced by every tick
    health_depletion: 1, //how much health is reduced by if no hunger/thirst every tick
    hunger_min: 5, //the level of hunger before your health is affected 
    thirst_min: 5, //the level of thirst before your health is affected
    action_damage: 5, //how much your health decreases when infected and doing an action
    travel_hunger: 15, //how much hunger is removed when travelling
    travel_thirst: 18, //how much thirst is removed when travelling
    survivor_chance: 0.1, //the chance of encountering a survivor
    
}