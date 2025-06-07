class Game {
    constructor() {
        // Define possible spawn locations
        const spawnLocations = SPAWNS;
        // Randomly select a spawn location
        const randomSpawn = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];

        this.player = {
            health: CONFIG.starting_health,
            hunger: CONFIG.starting_hunger,
            thirst: CONFIG.starting_thirst,
            inventory: CONFIG.starting_inventory,
            location: randomSpawn,
            equippedWeapon: null,
            baseDamage: CONFIG.base_damage,
            infection: false,         // Tracks infection status
            inventoryCapacity: CONFIG.starting_carry_space,     // Default capacity,
            junk: 0,
            score: 0,
            deathReason: null,
        };

        this.weapons = WEAPONS;
        
        this.locations = LOCATIONS;
        this.gameRunning = true;
        this.timeCounter = 0;
        this.actionInProgress = false; // Tracks if an action is ongoing
        this.actionDuration = CONFIG.action_duration; // Action duration in milliseconds (3 seconds)
        //this.init();
        self = this;
        document.getElementById("startBtn").addEventListener("click", function(e) {
            e.preventDefault();
            self.init();
        });
    }
    
    equipWeapon(weaponId) {
        if (this.actionInProgress) return;
        if (this.player.inventory.includes(weaponId) && this.weapons[weaponId]) {
            this.startAction(`Equipping ${this.weapons[weaponId].name}...`, () => {
                this.player.score += 50;
                this.player.equippedWeapon = weaponId;
                this.updateStory(`You equipped ${this.weapons[weaponId].name}.`);
                this.updateDisplay();
                this.generateActions();
            });
        }
    }

    setupTooltips() {
        const tooltip = document.getElementById('tooltip');
        const mapLocations = document.querySelectorAll('.map-location');

        mapLocations.forEach(location => {
            location.addEventListener('mousemove', (e) => {
                if (this.actionInProgress) return; // Don't show tooltips during actions
                const tooltipText = location.getAttribute('data-tooltip');
                if (tooltipText) {
                    tooltip.textContent = tooltipText;
                    tooltip.style.display = 'block';
                    // Position tooltip near cursor, offset to avoid covering the marker
                    tooltip.style.left = `${e.pageX + 10}px`;
                    tooltip.style.top = `${e.pageY - 40}px`;
                }
            });

            location.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }

    init() {
        document.getElementById("start").remove();
        this.updateDisplay();
        this.generateActions();
        setInterval(() => this.tick(), CONFIG.tick_time);
        this.setupTooltips();
    }

    tick() {
        if (!this.gameRunning) return;
        
        this.timeCounter++;
        
        // Decrease hunger and thirst over time
        if (this.timeCounter % CONFIG.stat_modulation === 0) {
            this.player.hunger = Math.max(0, this.player.hunger - CONFIG.hunger_depletion);
            this.player.thirst = Math.max(0, this.player.thirst - CONFIG.thirst_depletion);
        }
        
        // Health effects from hunger/thirst
        if (this.player.hunger <= CONFIG.hunger_min || this.player.thirst <= CONFIG.thirst_min) {
            this.player.health = Math.max(0, this.player.health - CONFIG.health_depletion);
            if (this.player.health <= 0) {
                this.player.deathReason = this.player.hunger <= CONFIG.hunger_min ? 'starvation' : 'thirst';
            }
        }
        
        this.player.score += CONFIG.score_per_tick;
        this.checkGameOver();
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('health-bar').style.width = this.player.health + '%';
        document.getElementById('hunger-bar').style.width = this.player.hunger + '%';
        document.getElementById('thirst-bar').style.width = this.player.thirst + '%';
        
        document.getElementById('health-text').textContent = `${this.player.health}/100`;
        document.getElementById('hunger-text').textContent = `${this.player.hunger}/100`;
        document.getElementById('thirst-text').textContent = `${this.player.thirst}/100`;
        
        document.getElementById('score-text').textContent = `Score: ${this.player.score}pts`;
        
        const loc = this.locations[this.player.location];
        document.getElementById('location-name').textContent = "Location: " + loc.name;
        document.getElementById('location-description').textContent = loc.description;
        
        console.log(this.player.score);
        
        const startLocationEl = document.getElementById('start-location');
        if (startLocationEl && !startLocationEl.textContent) {
            startLocationEl.textContent = loc.name;
        }
        
        this.updateMap();
        
        const inventoryEl = document.getElementById('inventory-items');
        if (this.player.inventory.length === 0) {
            inventoryEl.innerHTML = '<div class="inventory-item">Fists</div>';
        } else {
            inventoryEl.innerHTML = this.player.inventory.map(item => 
                `<div class="inventory-item" onclick="game.useItem('${item}')" style="cursor: pointer;">${this.formatItemName(item)}${this.player.equippedWeapon === item ? ' (Equipped)' : ''}</div>`
            ).join('');
        }

        // Display equipped weapon
        const inventoryTitle = document.querySelector('.inventory-title');
        if (inventoryTitle) {
            inventoryTitle.textContent = `Inventory (Weapon: ${this.player.equippedWeapon ? this.weapons[this.player.equippedWeapon].name : 'None'})`;
        }
    }
    
    updateMap() {
        // Reset all map locations
        Object.keys(this.locations).forEach(locId => {
            const mapEl = document.getElementById(`map-${locId}`);
            if (mapEl) {
                mapEl.className = `map-location map-${locId}`;
            }
        });

        // Highlight current location
        const currentMapEl = document.getElementById(`map-${this.player.location}`);
        if (currentMapEl) {
            currentMapEl.classList.add('current');
        }

        // Highlight connected locations
        const currentLoc = this.locations[this.player.location];
        currentLoc.connections.forEach(connection => {
            const connectedMapEl = document.getElementById(`map-${connection}`);
            if (connectedMapEl) {
                connectedMapEl.classList.add('connected');
            }
        });

        // Draw roads
        const svg = document.querySelector('.map-roads');
        const map = document.getElementById('map');
        const mapRect = map.getBoundingClientRect();
        svg.setAttribute('width', mapRect.width);
        svg.setAttribute('height', mapRect.height);
        svg.innerHTML = '';
        currentLoc.connections.forEach(connection => {
            const fromEl = document.getElementById(`map-${this.player.location}`);
            const toEl = document.getElementById(`map-${connection}`);
            if (fromEl && toEl) {
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();
                const x1 = fromRect.left + fromRect.width / 2 - mapRect.left;
                const y1 = fromRect.top + fromRect.height / 2 - mapRect.top;
                const x2 = toRect.left + toRect.width / 2 - mapRect.left;
                const y2 = toRect.top + toRect.height / 2 - mapRect.top;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#ab4cde');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            }
        });
    }

    updateStatus() {
        if (this.player.infection) {
            this.player.health = Math.max(0, this.player.health - CONFIG.action_damage);
            this.updateStory('<span class="danger">Your infection worsens, draining your health!</span>');
            if (this.player.health <= 0) {
                this.player.deathReason = 'infection';
                this.checkGameOver();
            }
        }
        this.updateDisplay();
    }

    survivorEncounter() {
        if (this.actionInProgress) {
            this.updateStory("You are already performing an action. Please wait.");
            return;
        }

        this.actionInProgress = true;
        this.disableInteractions();

        const storyEl = document.getElementById('story-text');
        const timerContainer = document.getElementById('timer-container');
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        let countdown = Math.ceil(this.actionDuration / 1000);

        const isFriendly = Math.random() < 0.7; // 70% chance friendly, 30% hostile

        if (isFriendly) {
            this.updateStory('<span class="success">You encounter a friendly survivor!</span> They offer to trade.');
            timerText.textContent = `Talking to survivor... ${countdown}s`;
            timerContainer.style.display = 'flex';
            timerFill.style.width = '100%';
            timerFill.offsetWidth;
            timerFill.style.transition = `width ${this.actionDuration}ms linear`;
            timerFill.style.width = '0%';

            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    timerText.textContent = `Talking to survivor... ${countdown}s`;
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(countdownInterval);
                this.startTrade();
                this.actionInProgress = false;
                timerContainer.style.display = 'none';
                timerFill.style.transition = 'none';
                timerFill.style.width = '100%';
                this.enableInteractions();
                this.updateDisplay();
                this.generateActions();
            }, this.actionDuration);
        } else {
            // Hostile survivor encounter
            let qteSuccess = false;
            const qteButton = document.createElement('button');
            qteButton.className = 'action-btn qte-btn';
            qteButton.textContent = 'Defend!';
            qteButton.style.display = 'block';
            timerContainer.appendChild(qteButton);

            timerText.textContent = `Fighting hostile survivor... ${countdown}s`;
            timerContainer.style.display = 'flex';
            timerFill.style.width = '100%';
            timerFill.offsetWidth;
            timerFill.style.transition = `width ${this.actionDuration}ms linear`;
            timerFill.style.width = '0%';

            this.updateStory('<span class="danger">A hostile survivor attacks you!</span> React quickly!');
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    timerText.textContent = `Fighting hostile survivor... ${countdown}s`;
                }
            }, 1000);

            const qteHandler = () => {
                qteSuccess = true;
                this.updateStory('<span class="success">Quick defense! You counter the attack!</span>');
                qteButton.remove();
            };
            qteButton.addEventListener('click', qteHandler);

            qteButton.classList.add('shake');
            const qteDuration = 2000;
            setTimeout(() => {
                qteButton.classList.remove('shake');
                qteButton.remove();
                qteButton.removeEventListener('click', qteHandler);
                if (!qteSuccess) {
                    this.updateStory('<span class="warning">Too slow! The survivor lands a hit!</span>');
                }
            }, qteDuration);

            setTimeout(() => {
                clearInterval(countdownInterval);
                let damage = Math.floor(Math.random() * 30) + 15; // 15-45 damage
                let playerDamage = this.player.equippedWeapon ? this.weapons[this.player.equippedWeapon].damage : this.player.baseDamage;

                if (qteSuccess) {
                    damage = Math.floor(damage * 0.5); // Reduce damage by 50%
                    playerDamage *= 1.5; // Increase player damage by 50%
                }

                this.player.health = Math.max(0, this.player.health - damage);
                this.updateStory(`<span class="danger">You fought the hostile survivor!</span> You dealt ${playerDamage} damage and took ${damage} damage.`);

                if (playerDamage >= 40) {
                    this.updateStory('You defeated the hostile survivor!');
                    this.player.score += qteSuccess ? 60 : 30;
                } else {
                    this.updateStory('The survivor escapes after injuring you.');
                    this.player.score += qteSuccess ? 30 : 15;
                }

                if (Math.random() < 0.3 && this.player.inventory.length > 0) { // 30% chance to lose an item
                    const lostItem = this.player.inventory.splice(Math.floor(Math.random() * this.player.inventory.length), 1)[0];
                    this.updateStory(`<span class="warning">The survivor stole your ${this.formatItemName(lostItem)}!</span>`);
                }
                if (this.player.health <= 0) {
                    this.player.deathReason = 'survivor';
                }
                this.actionInProgress = false;
                timerContainer.style.display = 'none';
                timerFill.style.transition = 'none';
                timerFill.style.width = '100%';
                this.enableInteractions();

                this.checkGameOver();
                this.updateDisplay();
                this.generateActions();
            }, this.actionDuration);
        }
    }

    startTrade() {
        const tradeItems = ['canned_food', 'water_bottle', 'bandage', 'protein_bar', 'soda_can']; // Possible trade items
        const survivorItem = tradeItems[Math.floor(Math.random() * tradeItems.length)];

        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'trade-popup';
        popup.className = 'trade-popup';

        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'trade-popup-content';
        popupContent.innerHTML = `
            <h2>Trade Offer</h2>
            <p>The survivor offers <strong>${this.formatItemName(survivorItem)}</strong>. Choose an item to trade or decline.</p>
            <div id="trade-buttons" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
        `;

        // Append content to popup
        popup.appendChild(popupContent);
        document.body.appendChild(popup);

        // Create trade buttons
        const tradeButtonContainer = popupContent.querySelector('#trade-buttons');
        const tradeButtons = [];
        if (this.player.inventory.length === 0) {
            popupContent.innerHTML += '<p class="warning">You have nothing to trade!</p>';
            tradeButtons.push({
                text: 'Decline Trade',
                action: 'game.declineTrade()'
            });
        } else {
            this.player.inventory.forEach(item => {
                tradeButtons.push({
                    text: `Trade ${this.formatItemName(item)}`,
                    action: `game.tradeItem('${item}', '${survivorItem}')`
                });
            });
            tradeButtons.push({
                text: 'Decline Trade',
                action: 'game.declineTrade()'
            });
        }

        tradeButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = btn.text;
            button.setAttribute('onclick', btn.action);
            tradeButtonContainer.appendChild(button);
        });

        // Disable other interactions
        this.disableInteractions();
    }

    // Replace the tradeItem function
    tradeItem(playerItem, survivorItem) {
        const index = this.player.inventory.indexOf(playerItem);
        if (index !== -1) {
            this.player.inventory.splice(index, 1); // Remove player's item
            this.player.inventory.push(survivorItem); // Add survivor's item
            this.updateStory(`You traded your ${this.formatItemName(playerItem)} for a ${this.formatItemName(survivorItem)}.`);
            this.player.score += 20;
        }
        document.getElementById('trade-popup').remove();
        this.enableInteractions();
        this.updateDisplay();
        this.generateActions();
    }

    // Replace the declineTrade function
    declineTrade() {
        this.updateStory('You declined the trade and part ways with the survivor.');
        document.getElementById('trade-popup').remove();
        this.enableInteractions();
        this.updateDisplay();
        this.generateActions();
    }

    mapTravel(destination) {
        const currentLocation = this.player.location;
        const allowedConnections = this.locations[currentLocation].connections;

        if (!allowedConnections.includes(destination)) {
            this.updateStory(`<span class="warning">You cannot travel directly from ${this.locations[currentLocation].name} to ${this.locations[destination].name}.</span>`);
            return;
        }

        this.startAction(`Traveling to ${this.locations[destination].name}...`, () => {
            this.player.location = destination;
            this.updateStory(`You have arrived at ${this.locations[destination].name}.`);

            const encounterChance = Math.random();
            if (encounterChance < CONFIG.zombie_chance) {
                this.zombieEncounter();
            } else if (encounterChance < CONFIG.zombie_chance + CONFIG.survivor_chance) {
                this.survivorEncounter();
            }

            this.player.hunger = Math.max(0, this.player.hunger - CONFIG.travel_hunger);
            this.player.thirst = Math.max(0, this.player.thirst - CONFIG.travel_thirst);
            this.updateStatus();
            this.updateDisplay();
            this.generateActions();
        });
    }

    isUsableItem(item) {
        return ['canned_food', 'water_bottle', 'bandage', 'medical_supplies', 'military_rations'].includes(item);
    }

    formatItemName(item) {
        const itemNames = {
            canned_food: 'Canned Food',
            protein_bar: 'Protein Bar',
            fresh_fruit: 'Fresh Fruit',
            military_rations: 'Military Rations',
            water_bottle: 'Water Bottle',
            soda_can: 'Soda Can',
            energy_drink: 'Energy Drink',
            bandage: 'Bandage',
            medical_supplies: 'Medical Supplies',
            antibiotics: 'Antibiotics',
            fishing_rod: 'Fishing Rod',
            junk: 'Junk',
            backpack: 'Backpack'
        };
        if (this.weapons[item]) {
            return this.weapons[item].name;
        }
        return itemNames[item] || item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    generateActions() {
        if (!this.gameRunning || document.getElementById('trade-popup')) return; // Skip if trade popup is active
        const actionsEl = document.getElementById('action-buttons');
        actionsEl.innerHTML = '';

        const loc = this.locations[this.player.location];
        const buttons = [];

        // Search action
        buttons.push({ text: 'Search Area', action: `game.searchArea()`, disabled: this.actionInProgress });

        // Travel actions
        loc.connections.forEach(conn => {
            buttons.push({
                text: `Travel to ${this.locations[conn].name}`,
                action: `game.mapTravel('${conn}')`,
                disabled: this.actionInProgress
            });
        });

        // Use item actions
        this.player.inventory.forEach(item => {
            if (this.isUsableItem(item)) {
                buttons.push({
                    text: `Use ${this.formatItemName(item)}`,
                    action: `game.useItem('${item}')`,
                    disabled: this.actionInProgress
                });
            }
            // Equip weapon action
            if (this.weapons[item] && item !== this.player.equippedWeapon) {
                buttons.push({
                    text: `Equip ${this.weapons[item].name}`,
                    action: `game.equipWeapon('${item}')`,
                    disabled: this.actionInProgress
                });
            }
        });

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = btn.text;
            button.setAttribute('onclick', btn.action);
            if (btn.disabled) button.disabled = true;
            actionsEl.appendChild(button);
        });
    }

    getRandomLoot(lootTable) {
        const rand = Math.random();
        let cumulative = 0;
        for (const [item, probability] of Object.entries(lootTable)) {
            cumulative += probability;
            if (rand <= cumulative) {
                return item;
            }
        }
        return Object.keys(lootTable)[0]; // Fallback to first item if something goes wrong
    }
    
    updateStory(message) {
        const storyEl = document.getElementById('story-text');
        if (!storyEl) return; // Safety check

        // Create new story entry
        const newEntry = document.createElement('div');
        newEntry.innerHTML = message;
        newEntry.style.marginTop = '16px';
        newEntry.style.color = 'lightgreen';

        storyEl.appendChild(newEntry);

        setTimeout(() => {
          newEntry.style.color = 'white';
        }, 2500);
        
        // Scroll to bottom
        storyEl.scrollTop = storyEl.scrollHeight;
    }

    getWeightedRandomItem(lootTable, noLootChance = 0.2) {
        if (!lootTable || Object.keys(lootTable).length === 0) return null;

        // Apply no loot chance
        if (Math.random() < noLootChance) return null;

        // Calculate total weight
        const totalWeight = Object.values(lootTable).reduce((sum, weight) => sum + weight, 0);
        if (totalWeight <= 0) return null;

        // Generate random value between 0 and totalWeight
        let random = Math.random() * totalWeight;
        
        // Select item based on cumulative weight
        for (const [item, weight] of Object.entries(lootTable)) {
            random -= weight;
            if (random <= 0) return item;
        }
        
        // Fallback: return null if no item selected (edge case)
        return null;
    }

    startAction(actionText, callback) {
        const timerContainer = document.getElementById('timer-container');
        const timerText = document.getElementById('timer-text');
        const timerFill = document.getElementById('timer-fill');
        
        this.actionInProgress = true;
        let countdown = Math.ceil(this.actionDuration / 1000);
        
        // Set initial timer state
        timerText.textContent = `${actionText} ${countdown}s`;
        timerContainer.style.display = 'flex';
        timerFill.style.width = '100%'; // Ensure initial width
        timerFill.offsetWidth; // Force reflow to trigger animation
        timerFill.style.transition = `width ${this.actionDuration}ms linear`;
        timerFill.style.width = '0%';
        
        // Update countdown text every second
        const countdownInterval = setInterval(() => {
            countdown--;
            timerText.textContent = `${actionText} ${countdown}s`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        // Complete action after duration
        setTimeout(() => {
            timerContainer.style.display = 'none';
            timerFill.style.transition = 'none';
            timerFill.style.width = '100%';
            this.actionInProgress = false;
            callback();
        }, this.actionDuration);
    }

    searchArea() {
        this.startAction('Searching area...', () => {
            const loc = this.locations[this.player.location];
            const noLootChance = loc.zombieChance > 0.5 ? 0.3 : 0.2;
            const loot = this.getWeightedRandomItem(loc.lootTable, noLootChance);
            if (loot && this.player.inventory.length < this.player.inventoryCapacity) {
                this.player.inventory.push(loot);
                this.updateStory(`You found ${this.formatItemName(loot)}!`);
                this.player.score += 10;
            } else {
                this.updateStory('You searched but found nothing useful.');
            }
            if (Math.random() < loc.zombieChance) {
                this.zombieEncounter();
            }
            this.updateStatus();
            this.updateDisplay();
            this.generateActions();
        });
    }

    zombieEncounter() {
        if (this.actionInProgress) {
            this.updateStory("You are already performing an action. Please wait.");
            return;
        }

        this.actionInProgress = true;
        this.disableInteractions();

        const storyEl = document.getElementById('story-text');
        const timerContainer = document.getElementById('timer-container');
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        let countdown = Math.ceil(this.actionDuration / 1000);
        
        // Create QTE button
        const qteButton = document.createElement('button');
        qteButton.className = 'action-btn qte-btn';
        qteButton.textContent = 'Dodge/Attack!';
        qteButton.style.display = 'block';
        qteButton.style.top = (Math.floor(Math.random() * 70) + 10) + 'vh';
        qteButton.style.left = (Math.floor(Math.random() * 70) + 10) + '%';
        let qteSuccess = false;

        // Append QTE button to timer-container instead of action-buttons
        timerContainer.appendChild(qteButton);

        // Show timer
        timerText.textContent = `Fighting zombie... ${countdown}s`;
        timerContainer.style.display = 'flex';
        timerFill.style.width = '100%';
        timerFill.offsetWidth;
        timerFill.style.transition = `width ${this.actionDuration}ms linear`;
        timerFill.style.width = '0%';

        // Countdown text and dynamic story updates
        this.updateStory('<span class="danger">A zombie lunges at you!</span> React quickly!');
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerText.textContent = `Fighting zombie... ${countdown}s`;
            }
        }, 1000);

        // QTE event listener
        const qteHandler = () => {
            qteSuccess = true;
            this.updateStory('<span class="success">Swift move! You dodged and struck back!</span>');
            qteButton.remove();
        };
        qteButton.addEventListener('click', qteHandler);

        // Shake effect for QTE button
        qteButton.classList.add('shake');
        const qteDuration = CONFIG.interactTime;
        setTimeout(() => {
            qteButton.classList.remove('shake');
            qteButton.remove();
            qteButton.removeEventListener('click', qteHandler);
            if (!qteSuccess) {
                this.updateStory('<span class="warning">Too slow! The zombie lands a hit!</span>');
            }
        }, qteDuration);

        setTimeout(() => {
            clearInterval(countdownInterval);
            let damage = 0;
            let playerDamage = this.player.equippedWeapon ? this.weapons[this.player.equippedWeapon].damage : this.player.baseDamage;
            const encounterType = Math.random();

            if (encounterType < 0.3) {
                const zombieCount = Math.floor(Math.random() * 2) + 2;
                damage = Math.floor(Math.random() * 20 + 15) * zombieCount;
                if (qteSuccess) {
                    damage = Math.floor(damage * 0.5);
                    playerDamage *= 1.5;
                }
                this.player.health = Math.max(0, this.player.health - damage);
                this.updateStory(`<span class="danger">A group of ${zombieCount} zombies ambushed you!</span> You dealt ${playerDamage} damage and took ${damage} damage.`);
                this.player.score += qteSuccess ? 40 : 20;
            } else {
                damage = Math.floor(Math.random() * 40) + 15;
                if (qteSuccess) {
                    damage = Math.floor(damage * 0.5);
                    playerDamage *= 1.5;
                }
                this.player.health = Math.max(0, this.player.health - damage);
                this.updateStory(`<span class="danger">A zombie shambled from the shadows!</span> You dealt ${playerDamage} damage and took ${damage} damage.`);
                this.player.score += qteSuccess ? 30 : 20;
            }

            if (Math.random() < CONFIG.infection_chance && !this.player.infection) {
                this.player.infection = true;
                this.updateStory('<span class="danger">The zombie’s bite infects you! Find antibiotics!</span>');
            }

            if (playerDamage >= 50) {
                this.updateStory('You defeated the zombie!');
                this.player.score += qteSuccess ? 50 : 25;
            } else {
                this.updateStory('The zombie survives your attack and injures you.');
            }
            if (this.player.health <= 0) {
                this.player.deathReason = 'zombie';
            }
            this.actionInProgress = false;
            timerContainer.style.display = 'none';
            timerFill.style.transition = 'none';
            timerFill.style.width = '100%';
            this.enableInteractions();

            this.checkGameOver();
            this.updateDisplay();
            this.generateActions();
        }, this.actionDuration);
    }

    travel(destination) {
        if (this.actionInProgress) {
            document.getElementById('story-text').textContent = "You are already performing an action. Please wait.";
            return;
        }

        const currentLoc = this.locations[this.player.location];
        const destName = this.locations[destination].name;
        
        if (!currentLoc.connections.includes(destination)) {
            document.getElementById('story-text').textContent = "You can't reach that location from here. You need to find a connecting road.";
            return;
        }

        // Show confirmation dialog
        const confirmTravel = confirm(`Do you want to travel to ${destName}?`);
        if (!confirmTravel) {
            document.getElementById('story-text').textContent = `You decided to stay in ${currentLoc.name}.`;
            return;
        }

        // Start action
        this.actionInProgress = true;
        this.disableInteractions();

        // Show timer
        const timerContainer = document.getElementById('timer-container');
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        let countdown = Math.ceil(this.actionDuration / 1000);
        timerText.textContent = `Traveling to ${destName}... ${countdown}`;
        timerContainer.style.display = 'flex';
        timerFill.style.transition = `width ${this.actionDuration}ms linear`;
        timerFill.style.width = '0%';

        // Countdown text
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerText.textContent = `Traveling to ${destName}... ${countdown}`;
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownInterval);
            const storyEl = document.getElementById('story-text');

            // Resource cost for travel
            this.player.hunger = Math.max(0, this.player.hunger - 15);
            this.player.thirst = Math.max(0, this.player.thirst - 15);

            // Random encounter (50% chance)
            const encounterChance = Math.random();
            if (encounterChance < CONFIG.encounter_chance) {
                // 25% chance for zombie encounter
                this.zombieEncounter();
            } else if (encounterChance < 0.4) {
                // 15% chance for environmental hazard
                const damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
                this.player.health = Math.max(0, this.player.health - damage);
                storyEl.innerHTML = `<span class="danger">You trip on rough terrain and injure yourself!</span> You take ${damage} damage while traveling to ${destName}.`;
                this.checkGameOver();
            } else if (encounterChance < 0.5) {
                // 10% chance for hostile survivor encounter
                const damage = Math.floor(Math.random() * 30) + 15; // 15-45 damage
                this.player.health = Math.max(0, this.player.health - damage);
                // Chance to lose an item
                if (this.player.inventory.length > 0 && Math.random() < 0.5) {
                    const lostItem = this.player.inventory.splice(Math.floor(Math.random() * this.player.inventory.length), 1)[0];
                    storyEl.innerHTML = `<span class="danger">A hostile survivor ambushes you!</span> You fight them off but take ${damage} damage and lose your ${this.formatItemName(lostItem)}.`;
                    this.player.score += 25;
                } else {
                    storyEl.innerHTML = `<span class="danger">A hostile survivor ambushes you!</span> You fight them off but take ${damage} damage.`;
                    this.player.score += 25;
                }
                this.checkGameOver();
            } else {
                // 50% chance for safe travel
                this.player.location = destination;
                storyEl.textContent = `You carefully make your way along the roads to ${destName}. The journey is tense, but you arrive safely.`;
                this.player.score += 50;
            }

            // Reset action state
            this.actionInProgress = false;
            timerContainer.style.display = 'none';
            timerFill.style.transition = 'none';
            timerFill.style.width = '100%';
            this.enableInteractions();

            this.updateDisplay();
            this.generateActions();
        }, this.actionDuration);
    }

    rest() {
        if (this.actionInProgress) {
            document.getElementById('story-text').textContent = "You are already performing an action. Please wait.";
            return;
        }

        const storyEl = document.getElementById('story-text');

        // Show confirmation dialog
        const confirmRest = confirm("Do you want to rest?");
        if (!confirmRest) {
            storyEl.textContent = "You decided not to rest.";
            return;
        }

        // Start action
        this.actionInProgress = true;
        this.disableInteractions();

        // Show timer
        const timerContainer = document.getElementById('timer-container');
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        let countdown = Math.ceil(this.actionDuration / 1000);
        timerText.textContent = `Resting... ${countdown}`;
        timerContainer.style.display = 'flex';
        timerFill.style.transition = `width ${this.actionDuration}ms linear`;
        timerFill.style.width = '0%';

        // Countdown text
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerText.textContent = `Resting... ${countdown}`;
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownInterval);
            const healthGain = Math.min(20, 100 - this.player.health);
            this.player.health = Math.min(100, this.player.health + healthGain);
            this.player.hunger = Math.max(0, this.player.hunger - 10);
            this.player.thirst = Math.max(0, this.player.thirst - 15);
            
            storyEl.textContent = `You find a safe spot and rest for a while, recovering ${healthGain} health. However, you're now more hungry and thirsty.`;
            
            // Reset action state
            this.actionInProgress = false;
            timerContainer.style.display = 'none';
            timerFill.style.transition = 'none';
            timerFill.style.width = '100%';
            this.enableInteractions();
            
            this.updateDisplay();
            this.generateActions();
        }, this.actionDuration);
    }

    useItem(item) {
        if (this.actionInProgress) return false;
        this.startAction(`Using ${this.formatItemName(item)}...`, () => {
            const index = this.player.inventory.indexOf(item);
            if (index !== -1) {
                this.player.inventory.splice(index, 1);
                switch (item) {
                    case 'fishing_rod':
                        this.player.hunger = Math.min(100, this.player.hunger + 100);
                        this.updateStory('You caught some fish and feel full!');
                        this.player.score += 10;
                      break;
                    case 'canned_food':
                        this.player.hunger = Math.min(100, this.player.hunger + 40);
                        this.updateStory('You ate some canned food, feeling less hungry.');
                        this.player.score += 10;
                        break;
                    case 'protein_bar':
                        this.player.hunger = Math.min(100, this.player.hunger + 20);
                        this.updateStory('You ate a protein bar, a light snack.');
                        this.player.score += 10;
                        break;
                    case 'fresh_fruit':
                        this.player.hunger = Math.min(100, this.player.hunger + 15);
                        this.player.thirst = Math.min(100, this.player.thirst + 10);
                        this.player.health = Math.min(100, this.player.health + 5);
                        this.updateStory('You ate fresh fruit, feeling refreshed.');
                        this.player.score += 10;
                        break;
                    case 'military_rations':
                        this.player.hunger = Math.min(100, this.player.hunger + 60);
                        this.updateStory('You consumed military rations, feeling well-fed.');
                        this.player.score += 10;
                        break;
                    case 'water_bottle':
                        this.player.thirst = Math.min(100, this.player.thirst + 50);
                        this.updateStory('You drank a water bottle, quenching your thirst.');
                        this.player.score += 10;
                        break;
                    case 'soda_can':
                        this.player.thirst = Math.min(100, this.player.thirst + 30);
                        this.updateStory('You drank a soda can, feeling refreshed.');
                        this.player.score += 10;
                        break;
                    case 'energy_drink':
                        this.player.thirst = Math.min(100, this.player.thirst + 40);
                        this.player.hunger = Math.min(100, this.player.hunger + 10);
                        this.updateStory('You drank an energy drink, feeling energized.');
                        this.player.score += 10;
                        break;
                    case 'bandage':
                        this.player.health = Math.min(100, this.player.health + 30);
                        this.updateStory('You applied a bandage, stopping some bleeding.');
                        this.player.score += 15;
                        break;
                    case 'medical_supplies':
                        this.player.health = Math.min(100, this.player.health + 50);
                        this.updateStory('You used medical supplies, restoring significant health.');
                        this.player.score += 20;
                        break;
                    case 'antibiotics':
                        this.player.infection = false; // Clear infection
                        this.updateStory('You took antibiotics, curing your infection.');
                        this.player.score += 100;
                        break;
                    case 'backpack':
                        this.player.inventoryCapacity = 12; // Increase from 8
                        this.updateStory('You equipped a backpack, increasing your inventory capacity.');
                        this.player.score += 15;
                        break;
                    case 'junk':
                        this.updateStory('You have played with your junk ' + (this.player.junk + 1) + ' times!');
                        this.player.score += 10;
                        this.player.junk++;
                        break;
                    }
                this.updateStatus();
                this.updateDisplay();
                this.generateActions();
            }
        });
    }

    checkGameOver() {
        if (this.player.health <= 0 && this.gameRunning) {
            this.gameRunning = false;
            const deathMessages = {
                zombie: 'You were torn apart by zombies!',
                survivor: 'A hostile survivor overwhelmed you!',
                starvation: 'You succumbed to starvation!',
                thirst: 'You died of dehydration!',
                infection: 'The infection consumed you!'
            };
            const deathMessage = deathMessages[this.player.deathReason] || 'You died under mysterious circumstances!';
            document.getElementById('story-text').innerHTML = 
                `<div class="game-over">Game Over<br>${deathMessage}<br><span style="color:orange;">Score: ${this.player.score}pts</span></div>`;
            setTimeout(() => {
                document.getElementById('action-buttons').remove();
                document.getElementById('map').remove();
                document.getElementById('inventory-items').remove();
            }, 10);
        }
    }
    
    disableInteractions() {
        // Disable action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });
        
        // Disable inventory items
        document.querySelectorAll('.inventory-item').forEach(item => {
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.5';
        });
        
        // Disable map locations
        document.querySelectorAll('.map-location').forEach(loc => {
            loc.style.pointerEvents = 'none';
            loc.style.opacity = '0.5';
        });
    }

    enableInteractions() {
        // Enable action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });
        
        // Enable inventory items
        document.querySelectorAll('.inventory-item').forEach(item => {
            item.style.pointerEvents = 'auto';
            item.style.opacity = '1';
        });
        
        // Enable map locations
        document.querySelectorAll('.map-location').forEach(loc => {
            loc.style.pointerEvents = 'auto';
            loc.style.opacity = '1';
        });
    }
}

// Start the game
const game = new Game();