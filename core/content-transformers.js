/**
 * Content Transformers - Transform loaded items into specific formats
 */

export const ClassTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: 'class',
      hitDice: doc.system?.hitDice || doc.system?.hp?.denomination || 'd8',
      spellcasting: doc.system?.spellcasting?.progression || null,
      saves: doc.system?.saves || [],
      skills: doc.system?.skills || null,
      source: source,
      isHomebrew: isHomebrew
    };
  }
};

export const RaceTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: 'race',
      source: source,
      abilityBoosts: doc.system?.advancement || null,
      size: doc.system?.traits?.size || 'med',
      speed: doc.system?.movement?.walk || 30,
      isHomebrew: isHomebrew
    };
  }
};

export const BackgroundTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: 'background',
      source: source,
      skills: doc.system?.skills || null,
      languages: doc.system?.languages || null,
      equipment: doc.system?.startingEquipment || null,
      isHomebrew: isHomebrew
    };
  }
};

export const SpellTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: 'spell',
      level: doc.system?.level || 0,
      school: doc.system?.school || 'evo',
      components: doc.system?.components || {},
      ritual: doc.system?.properties?.ritual || false,
      concentration: doc.system?.properties?.concentration || false,
      source: source,
      isHomebrew: isHomebrew
    };
  }
};

export const EquipmentTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: doc.type,
      equipmentType: doc.system?.type?.value || doc.type,
      rarity: doc.system?.rarity || 'common',
      weight: doc.system?.weight?.value || 0,
      price: doc.system?.price?.value || 0,
      source: source,
      isHomebrew: isHomebrew
    };
  }
};

export const FeatTransformer = {
  transform(doc, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));
    
    return {
      id: doc.id,
      packName: packName,
      name: doc.name,
      type: 'feat',
      requirements: doc.system?.requirements || null,
      source: source,
      isHomebrew: isHomebrew
    };
  }
};
