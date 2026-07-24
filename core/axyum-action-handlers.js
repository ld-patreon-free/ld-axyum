export const AxyumActionHandlers = Base => class extends Base {
    async onNext(event) {
        this.navigation.nextPage(), await this.render();
    }
    async onPrevious(event) {
        this.navigation.previousPage(), await this.render();
    }
    onSelectClass(event, target) {
        const classId = target.dataset.classId, className = target.dataset.className;
        console.log("AxyumApp | selectClass", {
            classId: classId,
            className: className
        });
        const cls = this.availableOptions.classes.find((c => c.id === classId));
        if (cls) {
            this.characterData.class = {
                id: cls.id,
                name: cls.name,
                level: 1,
                hitDie: cls.hitDie && cls.hitDie.match(/\d+/)?.[0] || "8",
                source: cls.source || null,
                isHomebrew: !!cls.isHomebrew
            };
            const armorProfs = this._buildArmorProficiencies().filter((a => a.granted)).map((a => a.id)), weaponProfs = this._buildWeaponProficiencies().filter((w => w.granted)).map((w => w.id));
            this.characterData.proficiencies.armor = armorProfs, this.characterData.proficiencies.weapons = weaponProfs, 
            this._updateDerivedStats(), this.render();
        }
    }
    onSelectRace(event, target) {
        const raceId = target.dataset.raceId, raceName = target.dataset.raceName;
        console.log("AxyumApp | selectRace", {
            raceId: raceId,
            raceName: raceName
        });
        const race = this.availableOptions.races.find((r => r.id === raceId));
        race && (this.characterData.race = {
            id: race.id,
            name: race.name,
            source: race.source || null,
            isHomebrew: !!race.isHomebrew,
            speed: race.movement?.walk || 30
        }, this.characterData.proficiencies.languages = this._getRaceLanguages(), this._updateDerivedStats(), 
        this.render());
    }
    onSelectBackground(event, target) {
        const bgId = target.dataset.backgroundId, bgName = target.dataset.backgroundName;
        console.log("AxyumApp | selectBackground", {
            bgId: bgId,
            bgName: bgName
        });
        const bg = this.availableOptions.backgrounds.find((b => b.id === bgId));
        if (bg) {
            this.characterData.background = {
                id: bg.id,
                name: bg.name,
                source: bg.source || null,
                isHomebrew: !!bg.isHomebrew
            };
            const toolProfs = this._buildToolProficiencies().filter((t => t.granted)).map((t => t.id));
            this.characterData.proficiencies.tools = toolProfs, this._updateDerivedStats(), 
            this.render();
        }
    }
    onSelectRole(event, target) {
        const index = parseInt(target.dataset.roleIndex);
        this.filter.setSelectedRole(index), this.render();
    }
    onRollAbility(event, target) {
        const ability = target.dataset.ability;
        if (!ability) return void console.error("LD Axyum | Roll failed - no ability key found on target");
        if (target) {
            target.style.opacity = "0", target.style.transition = "opacity 0.2s", target.style.pointerEvents = "none";
            const slot = target.closest(".roll-slot");
            slot && slot.classList.add("is-rolling");
        }
        const roll = this.abilityManager.rollAbilityScore();
        console.log(`LD Axyum | Rolled ${roll.total} for ${ability}`, roll), this.abilityManager.rolledScores[ability] = roll.total, 
        this.abilityManager.diceBreakdowns[ability] = roll.breakdown, this._animateDiceRoll(ability, roll);
    }
    _animateDiceRoll(ability, roll) {
        const container = this.element?.querySelector(`#dice-anim-${ability}`);
        if (container) {
            container.classList.add("show");
            container.querySelectorAll(".dice-tumble i").forEach(((die, i) => {
                die.className = "fas fa-dice-d6", die.offsetWidth, die.classList.add("rolling"), 
                setTimeout((() => {
                    die.classList.remove("rolling"), die.classList.add("landed");
                }), 400 + 150 * i);
            })), setTimeout((() => {
                this.render();
            }), 1200);
        } else console.warn(`LD Axyum | Animation container #dice-anim-${ability} not found`), 
        this.render();
    }
    onRollAllAbilities(event, target) {
        const status = this.abilityManager.getRerollStatus();
        if (status.hasRolled && status.hasRerolled) return void ui.notifications.warn("Reroll limit reached. You must stay with your current scores.");
        const results = this.abilityManager.rollAllAbilityScores();
        console.log("LD Axyum | Rolled all abilities:", results), results.rerollLimitReached ? ui.notifications.info("Final roll! Drag and drop these scores to your abilities.") : ui.notifications.info('Scores rolled! Drag and drop them to assign, or "Roll All" again once to reroll.'), 
        this.render();
    }
    onUnassignScore(event, target) {
        const ability = target.dataset.ability, score = this.characterData.abilities[ability];
        score && (delete this.characterData.abilities[ability], this.abilityManager.assignedAbilities && delete this.abilityManager.assignedAbilities[ability], 
        this.abilityManager.rolledPool && (this.abilityManager.rolledPool.push({
            value: score,
            breakdown: "Returned",
            assigned: !1
        }), this.abilityManager.rolledPool.sort(((a, b) => b.value - a.value))), this.render());
    }
    onAssignScore(event, target) {
        const ability = target.dataset.ability, score = parseInt(target.dataset.score);
        ability && !isNaN(score) && (this.characterData.abilities[ability] = score, this.abilityManager.assignScore(ability, score), 
        this.render());
    }
    onUseStandardArray(event, target) {
        this.abilityManager.rolledPool = [ 15, 14, 13, 12, 10, 8 ].map((v => ({
            value: v,
            breakdown: "Standard Array",
            assigned: !1
        }))), this.abilityManager.rolledScores = {}, this.abilityManager.diceBreakdowns = {}, 
        this.characterData.abilities = {}, this.render();
    }
    onUsePointBuy(event, target) {
        this.characterData.abilities = {}, [ "str", "dex", "con", "int", "wis", "cha" ].forEach((ab => {
            this.characterData.abilities[ab] = 8;
        })), this.abilityManager.rolledPool = null, this.abilityManager.rolledScores = {}, 
        this.abilityManager.diceBreakdowns = {}, ui.notifications.info("Point Buy mode: All scores set to 8. Use + and - to adjust (27 points total)."), 
        this.render();
    }
    onResetAbilities(event, target) {
        this.abilityManager.reset(), this.characterData.abilities = {}, this.render();
    }
    onAssignScoreClick(event, target) {
        const ability = target.dataset.ability, pool = this.abilityManager.rolledPool;
        if (pool && pool.length > 0) {
            const unassigned = pool.find((s => !s.assigned));
            unassigned && (unassigned.assigned = !0, this.characterData.abilities[ability] = unassigned.value, 
            this.abilityManager.assignScore(ability, unassigned.value), this.render());
        }
    }
    async onRollTrait(event, target) {
        if (!target) return void console.error("LD Axyum | onRollTrait called with null target");
        const trait = target.dataset.trait, tableName = {
            "details.traits": "personality-traits",
            "details.ideals": "ideals",
            "details.bonds": "bonds",
            "details.flaws": "flaws"
        }[trait] || trait;
        if (console.log("LD Axyum | Rolling trait:", {
            trait: trait,
            tableName: tableName,
            target: target
        }), !tableName) return void console.error("LD Axyum | Could not determine table name for trait:", trait);
        const result = await this.rollTables.rollOnTable(tableName);
        if (result) {
            const field = this.element.querySelector(`[name="${trait}"]`);
            if (field) {
                field.value = result;
                const parts = trait.split(".");
                let model = this.characterData;
                for (let i = 0; i < parts.length - 1; i++) model = model[parts[i]];
                model[parts[parts.length - 1]] = result;
            }
        }
    }
    onFilterCompendium(event, target) {
        const filterValue = target.dataset.filter || target.value, type = target.classList.contains("race-compendium-filter-btn") ? "race" : "class";
        this.filter.setCompendiumFilter(type, filterValue), this.render();
    }
    onToggleHomebrew(event, target) {
        this.filter.setHomebrewVisibility(target.checked), this.render();
    }
    onFilterEquipment(event, target) {
        const button = target.closest?.("[data-filter]") || target, filter = button?.dataset?.filter || "";
        this.currentEquipmentFilter = filter, this.render();
    }
    onToggleEquipment(event, target) {
        const itemId = target.dataset.itemId || target.value;
        if (!itemId) return;
        this.characterData.selectedEquipmentIds || (this.characterData.selectedEquipmentIds = []);
        if (this.characterData.selectedEquipmentIds.includes(itemId)) this.characterData.selectedEquipmentIds = this.characterData.selectedEquipmentIds.filter((id => id !== itemId)); else {
            if (this.characterData.selectedEquipmentIds.length >= 10) return void ui.notifications.warn("Maximum 10 starting items allowed!");
            this.characterData.selectedEquipmentIds.push(itemId);
        }
        this.render();
    }
    onToggleLanguage(event, target) {
        const langId = target.dataset.langId || target.value;
        if (!langId || target.disabled) return;
        this.characterData.proficiencies.languages || (this.characterData.proficiencies.languages = []);
        const isSelected = this.characterData.proficiencies.languages.includes(langId), maxLanguages = this._getTotalLanguageSlots(), raceLangs = this._getRaceLanguages(), grantedCount = raceLangs.length, currentChoices = this.characterData.proficiencies.languages.filter((l => !raceLangs.includes(l))).length;
        if (isSelected) this.characterData.proficiencies.languages = this.characterData.proficiencies.languages.filter((id => id !== langId)); else {
            if (currentChoices >= maxLanguages - grantedCount) return void ui.notifications.warn(`No more language choices available! (Max ${maxLanguages - grantedCount})`);
            this.characterData.proficiencies.languages.push(langId);
        }
        this.render();
    }
    onToggleArmorProf(event, target) {
        const armorId = target.dataset.armorId || target.value;
        if (!armorId || target.disabled) return;
        this.characterData.proficiencies.armor || (this.characterData.proficiencies.armor = []);
        this.characterData.proficiencies.armor.includes(armorId) ? this.characterData.proficiencies.armor = this.characterData.proficiencies.armor.filter((id => id !== armorId)) : this.characterData.proficiencies.armor.push(armorId), 
        this.render();
    }
    onToggleWeaponProf(event, target) {
        const weaponId = target.dataset.weaponId || target.value;
        if (!weaponId || target.disabled) return;
        this.characterData.proficiencies.weapons || (this.characterData.proficiencies.weapons = []);
        this.characterData.proficiencies.weapons.includes(weaponId) ? this.characterData.proficiencies.weapons = this.characterData.proficiencies.weapons.filter((id => id !== weaponId)) : this.characterData.proficiencies.weapons.push(weaponId), 
        this.render();
    }
    onToggleToolProf(event, target) {
        const toolId = target.dataset.toolId || target.value;
        if (!toolId || target.disabled) return;
        this.characterData.proficiencies.tools || (this.characterData.proficiencies.tools = []);
        this.characterData.proficiencies.tools.includes(toolId) ? this.characterData.proficiencies.tools = this.characterData.proficiencies.tools.filter((id => id !== toolId)) : this.characterData.proficiencies.tools.push(toolId), 
        this.render();
    }
    async onCreate(event, target) {
        try {
            const nameInput = this.element?.querySelector('input[name="name"]');
            nameInput && nameInput.value && nameInput.value.trim() && (this.characterData.name = nameInput.value.trim());
            const errors = [];
            if (this.characterData.name?.trim() || errors.push("Character Name"), this.characterData.class?.id || errors.push("Class Selection"), 
            this.characterData.race?.id || errors.push("Race Selection"), this.characterData.background?.id || errors.push("Background Selection"), 
            errors.length > 0) return void ui.notifications.error(`Missing required fields: ${errors.join(", ")}`);
            const rolledScores = this.abilityManager.getRolledScores(), assignedAbilities = this.abilityManager.getAssignedAbilities(), abilities = [ "str", "dex", "con", "int", "wis", "cha" ];
            for (const ab of abilities) assignedAbilities[ab] ? this.characterData.abilities[ab] = assignedAbilities[ab] : rolledScores[ab] ? this.characterData.abilities[ab] = rolledScores[ab] : this.characterData.abilities[ab] || (this.characterData.abilities[ab] = 10);
            this._updateDerivedStats(), console.log("LD Axyum | Final character data for creation:", this.characterData);
            const actor = await this.creator.createCharacter(this.characterData);
            ui.notifications.info(`Character "${actor.name}" created successfully!`), this.close(), 
            actor?.sheet?.render && actor.sheet.render({
                force: !0
            });
        } catch (err) {
            console.error("LD Axyum | Character creation failed", err), ui.notifications.error(`Failed to create character: ${err.message}`);
        }
    }
    async onSave(event) {
        try {
            await this.creator.updateCharacter(this.actor, this.characterData), ui.notifications.info(`Character "${this.actor.name}" updated successfully!`), 
            this.close();
        } catch (err) {
            console.error("LD Axyum | Character update failed", err), ui.notifications.error("Failed to update character");
        }
    }
    async onConfigureCompendia(event) {
        const {CompendiumSelector: CompendiumSelector} = await import("../ui/modals/compendium-selector.js");
        (new CompendiumSelector).render({
            force: !0
        });
    }
    _onFormInputChange(event) {
        const input = event.target, name = input.name, value = input.value;
        if (!name) return;
        const parts = name.split(".");
        let target = this.characterData;
        for (let i = 0; i < parts.length - 1; i++) target[parts[i]] || (target[parts[i]] = {}), 
        target = target[parts[i]];
        const finalKey = parts[parts.length - 1];
        "number" === input.type ? target[finalKey] = parseInt(value, 10) || 0 : target[finalKey] = value, 
        "function" == typeof this._updateDerivedStats && this._updateDerivedStats(), this._renderDebounceTimer && clearTimeout(this._renderDebounceTimer), 
        this._renderDebounceTimer = setTimeout((() => {
            "function" == typeof this.render && this.render();
        }), 100), console.log(`LD Axyum | Form input changed: ${name} = ${value}`);
    }
    _onDragStart(event) {
        const target = event.currentTarget;
        target.classList.add("dragging"), event.dataTransfer.effectAllowed = "move";
        const dragData = {
            score: target.dataset.score,
            sourceAbility: target.dataset.sourceAbility || null,
            poolIndex: target.dataset.poolIndex || null,
            fromAssigned: "true" === target.dataset.fromAssigned
        };
        console.log("LD Axyum | Dragging:", dragData), event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }
    _onDragEnd(event) {
        event.currentTarget.classList.remove("dragging"), this.element?.querySelectorAll(".drag-over").forEach((z => z.classList.remove("drag-over")));
    }
    _onDragOver(event) {
        event.preventDefault(), event.dataTransfer.dropEffect = "move", event.currentTarget.classList.add("drag-over");
    }
    _onDragLeave(event) {
        event.currentTarget.classList.remove("drag-over");
    }
    _onDrop(event) {
        event.preventDefault();
        const zone = event.currentTarget;
        zone.classList.remove("drag-over");
        try {
            const data = JSON.parse(event.dataTransfer.getData("text/plain")), ability = zone.dataset.ability, score = parseInt(data.score);
            if (!ability || isNaN(score)) return;
            if (this.characterData.abilities[ability] && this._returnScoreToPool(ability), this.characterData.abilities[ability] = score, 
            this.abilityManager.assignScore(ability, score), null !== data.poolIndex && void 0 !== data.poolIndex && this.abilityManager.rolledPool) {
                const idx = parseInt(data.poolIndex);
                idx >= 0 && idx < this.abilityManager.rolledPool.length && this.abilityManager.rolledPool.splice(idx, 1);
            }
            data.sourceAbility && this.abilityManager.rolledScores && (delete this.abilityManager.rolledScores[data.sourceAbility], 
            this.abilityManager.diceBreakdowns && delete this.abilityManager.diceBreakdowns[data.sourceAbility]), 
            data.fromAssigned && data.sourceAbility && (delete this.characterData.abilities[data.sourceAbility], 
            delete this.abilityManager.assignedAbilities[data.sourceAbility]), this._playDropSound(), 
            this.render();
        } catch (err) {
            console.error("LD Axyum | Drop error:", err);
        }
    }
    _returnScoreToPool(ability) {
        const score = this.characterData.abilities[ability];
        score && this.abilityManager.rolledPool && (this.abilityManager.rolledPool.push({
            value: score,
            breakdown: "",
            assigned: !1
        }), this.abilityManager.rolledPool.sort(((a, b) => b.value - a.value)));
    }
    _playDropSound() {
        if (game.settings.get("core", "globalAmbientVolume") > 0) {
            const AudioAPI = globalThis.foundry?.audio?.AudioHelper ?? globalThis.AudioHelper;
            if (AudioAPI && "function" == typeof AudioAPI.play) try {
                const maybe = AudioAPI.play({
                    src: "sounds/dice.wav",
                    volume: .3,
                    autoplay: !0
                }, !1);
                maybe && "function" == typeof maybe.catch && maybe.catch((e => console.warn("Axyum | Audio play failed:", e)));
            } catch (e) {
                console.warn("Axyum | Audio play failed:", e);
            }
        }
    }
};
