import { PrismaClient, Edibility } from '@prisma/client';

const prisma = new PrismaClient();

const irishSpecies = [
  {
    latinName: 'Agaricus campestris',
    commonEn: 'Field Mushroom',
    commonGa: 'Beacán Páirce',
    slug: 'field-mushroom',
    edibility: 'EDIBLE' as Edibility,
    season: 'Late summer to autumn (August-November)',
    habitat: 'Grasslands, pastures, lawns',
    keyTraits:
      'White cap turning brown with age; pink gills becoming dark brown; white stem with ring; pleasant mushroom smell',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1598254436016-fe66ce128e8d?w=800&q=80',
  },
  {
    latinName: 'Boletus edulis',
    commonEn: 'Penny Bun / Cep',
    commonGa: 'Boileatán Inite',
    slug: 'penny-bun',
    edibility: 'CHOICE' as Edibility,
    season: 'Late summer to autumn (September-November)',
    habitat: 'Mixed woodland, especially under oak, beech, and conifers',
    keyTraits: 'Large brown cap; white then yellowish pores; thick white stem with fine network; excellent edible',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  {
    latinName: 'Amanita muscaria',
    commonEn: 'Fly Agaric',
    commonGa: 'Caipín Cuileog',
    slug: 'fly-agaric',
    edibility: 'TOXIC' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Birch and coniferous woodland',
    keyTraits: 'Iconic red cap with white spots; white gills; white stem with ring and bulbous base; TOXIC',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&q=80',
  },
  {
    latinName: 'Amanita phalloides',
    commonEn: 'Death Cap',
    commonGa: 'Caipín an Bháis',
    slug: 'death-cap',
    edibility: 'DEADLY' as Edibility,
    season: 'Late summer to autumn (August-November)',
    habitat: 'Mixed woodland, especially oak',
    keyTraits:
      'Greenish-yellow cap; white gills; white stem with ring and cup-like volva at base; DEADLY POISONOUS',
    sensitive: true,
    heroImageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80',
  },
  {
    latinName: 'Cantharellus cibarius',
    commonEn: 'Chanterelle',
    commonGa: 'Cantaral',
    slug: 'chanterelle',
    edibility: 'CHOICE' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Mixed woodland, especially oak and beech',
    keyTraits: 'Golden-yellow; funnel-shaped; false gills (ridges); fruity apricot smell; choice edible',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  {
    latinName: 'Coprinus comatus',
    commonEn: "Shaggy Ink Cap / Lawyer's Wig",
    commonGa: 'Caipín Dúigh Fionnach',
    slug: 'shaggy-ink-cap',
    edibility: 'EDIBLE' as Edibility,
    season: 'Spring to autumn (May-November)',
    habitat: 'Grassland, roadsides, disturbed ground',
    keyTraits: 'Tall white shaggy cap; deliquesces to black ink; edible when young',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1617281479455-b55fa5d24d04?w=800&q=80',
  },
  {
    latinName: 'Lactarius deliciosus',
    commonEn: 'Saffron Milk Cap',
    commonGa: 'Bainne Dearg',
    slug: 'saffron-milk-cap',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Coniferous woodland, especially pine',
    keyTraits: 'Orange cap with darker zones; orange milk that turns green; edible and tasty',
    sensitive: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1603935039124-89867879e40c?w=800&q=80',
  },
  {
    latinName: 'Lepista nuda',
    commonEn: 'Wood Blewit',
    commonGa: 'Muisiriún Gorm',
    slug: 'wood-blewit',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn to early winter (October-December)',
    habitat: 'Woodland, gardens, compost heaps',
    keyTraits: 'Violet-blue cap and stem when young; buff gills; pleasant smell; edible but cook well',
    sensitive: false,
  },
  {
    latinName: 'Macrolepiota procera',
    commonEn: 'Parasol Mushroom',
    commonGa: 'Muisiriún Paraisóil',
    slug: 'parasol-mushroom',
    edibility: 'CHOICE' as Edibility,
    season: 'Late summer to autumn (August-November)',
    habitat: 'Grassland, woodland edges, gardens',
    keyTraits: 'Large scaly brown cap on tall stem; double-edged moveable ring; excellent edible',
    sensitive: false,
  },
  {
    latinName: 'Pleurotus ostreatus',
    commonEn: 'Oyster Mushroom',
    commonGa: 'Muisiriún Oisrí',
    slug: 'oyster-mushroom',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn to spring (October-April)',
    habitat: 'Dead and dying hardwood trees',
    keyTraits: 'Oyster-shaped cap; white to grey; grows in tiers; good edible',
    sensitive: false,
  },
  {
    latinName: 'Russula emetica',
    commonEn: 'The Sickener',
    commonGa: 'An Múiscire',
    slug: 'sickener',
    edibility: 'TOXIC' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Coniferous and mixed woodland',
    keyTraits: 'Bright red cap; white stem and gills; very hot peppery taste; causes vomiting',
    sensitive: false,
  },
  {
    latinName: 'Hygrocybe conica',
    commonEn: 'Blackening Waxcap',
    commonGa: 'Ceir-Chaipín Dubhach',
    slug: 'blackening-waxcap',
    edibility: 'CAUTION' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Unimproved grassland, lawns',
    keyTraits: 'Conical orange-red cap; blackens with age or when handled; not recommended',
    sensitive: false,
  },
  {
    latinName: 'Armillaria mellea',
    commonEn: 'Honey Fungus',
    commonGa: 'Fungais Meala',
    slug: 'honey-fungus',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Dead and living trees, stumps',
    keyTraits: 'Honey-colored cap with darker scales; white ring on stem; grows in clusters; parasitic; edible but causes upset in some',
    sensitive: false,
  },
  {
    latinName: 'Clitocybe nebularis',
    commonEn: 'Clouded Funnel',
    commonGa: 'Néalscairt',
    slug: 'clouded-funnel',
    edibility: 'CAUTION' as Edibility,
    season: 'Autumn (September-December)',
    habitat: 'Woodland, especially beech',
    keyTraits: 'Large grey-brown cap; crowded white gills; strong mealy smell; causes upset in some people',
    sensitive: false,
  },
  {
    latinName: 'Lycoperdon perlatum',
    commonEn: 'Common Puffball',
    commonGa: 'Balláin Coiteann',
    slug: 'common-puffball',
    edibility: 'EDIBLE' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Woodland, grassland',
    keyTraits: 'Small white puffball with spiny warts; edible when pure white inside; releases brown spore cloud',
    sensitive: false,
  },
  {
    latinName: 'Calvatia gigantea',
    commonEn: 'Giant Puffball',
    commonGa: 'Balláin Ollmhór',
    slug: 'giant-puffball',
    edibility: 'EDIBLE' as Edibility,
    season: 'Late summer to autumn (August-October)',
    habitat: 'Grassland, pastures',
    keyTraits: 'Huge white ball up to 80cm; no stem; edible when pure white inside; choice edible',
    sensitive: false,
  },
  {
    latinName: 'Laccaria amethystina',
    commonEn: 'Amethyst Deceiver',
    commonGa: 'Meallaire Aimitis',
    slug: 'amethyst-deceiver',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Mixed woodland',
    keyTraits: 'Beautiful purple throughout when young; fades with age; edible but small',
    sensitive: false,
  },
  {
    latinName: 'Hypholoma fasciculare',
    commonEn: 'Sulphur Tuft',
    commonGa: 'Dos Buí Suifre',
    slug: 'sulphur-tuft',
    edibility: 'TOXIC' as Edibility,
    season: 'Year-round',
    habitat: 'Dead wood, stumps',
    keyTraits: 'Bright yellow cap with darker center; grows in dense clusters; bitter taste; POISONOUS',
    sensitive: false,
  },
  {
    latinName: 'Paxillus involutus',
    commonEn: 'Brown Roll-Rim',
    commonGa: 'Imeall Rolla Donn',
    slug: 'brown-roll-rim',
    edibility: 'DEADLY' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Woodland, heathland',
    keyTraits: 'Brown cap with inrolled margin; yellowish gills bruising brown; DEADLY - causes immune reaction',
    sensitive: true,
  },
  {
    latinName: 'Fomes fomentarius',
    commonEn: 'Tinder Fungus',
    commonGa: 'Fungais Spúnse',
    slug: 'tinder-fungus',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Year-round (perennial)',
    habitat: 'Dead birch trees',
    keyTraits: "Hoof-shaped bracket fungus; grey-brown; hard woody texture; historically used as tinder and 'amadou'; not edible",
    sensitive: false,
  },
  {
    latinName: 'Laetiporus sulphureus',
    commonEn: 'Chicken of the Woods',
    commonGa: 'Sicín na Coille',
    slug: 'chicken-of-the-woods',
    edibility: 'EDIBLE' as Edibility,
    season: 'Spring to autumn (May-October)',
    habitat: 'Dead or living trees, especially oak',
    keyTraits: 'Bright orange-yellow brackets; soft when young; chicken-like texture; good edible when young',
    sensitive: false,
  },
  {
    latinName: 'Grifola frondosa',
    commonEn: 'Hen of the Woods / Maitake',
    commonGa: 'Cearc na Coille',
    slug: 'hen-of-the-woods',
    edibility: 'CHOICE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Base of oak trees',
    keyTraits: 'Large clustered fronds; grey-brown; tender when young; excellent edible; highly prized',
    sensitive: false,
  },
  {
    latinName: 'Morchella esculenta',
    commonEn: 'Common Morel',
    commonGa: 'Moiréal Coiteann',
    slug: 'common-morel',
    edibility: 'CHOICE' as Edibility,
    season: 'Spring (April-May)',
    habitat: 'Woodland, orchards, disturbed ground',
    keyTraits: 'Honeycomb cap; hollow throughout; cream to brown; excellent edible when cooked; TOXIC raw',
    sensitive: false,
  },
  {
    latinName: 'Gyromitra esculenta',
    commonEn: 'False Morel',
    commonGa: 'Moiréal Bréige',
    slug: 'false-morel',
    edibility: 'DEADLY' as Edibility,
    season: 'Spring (April-May)',
    habitat: 'Sandy soil, coniferous woodland',
    keyTraits: 'Brain-like wrinkled cap; reddish-brown; hollow stem; DEADLY POISONOUS - contains rocket fuel toxin',
    sensitive: true,
  },
  {
    latinName: 'Craterellus cornucopioides',
    commonEn: 'Horn of Plenty',
    commonGa: 'Adharc an Fhlúirse',
    slug: 'horn-of-plenty',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Beech and oak woodland',
    keyTraits: 'Black trumpet-shaped; hollow; grey underside; good edible; hard to spot on forest floor',
    sensitive: false,
  },
  {
    latinName: 'Sparassis crispa',
    commonEn: 'Wood Cauliflower',
    commonGa: 'Cóilis Choille',
    slug: 'wood-cauliflower',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Base of conifers, especially pine',
    keyTraits: 'Large pale cauliflower-like mass; frilly lobed branches; good edible when young',
    sensitive: false,
  },
  {
    latinName: 'Hericium erinaceus',
    commonEn: "Lion's Mane",
    commonGa: 'Moing Leoin',
    slug: 'lions-mane',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Dead or dying hardwoods, especially beech',
    keyTraits: 'White cascade of icicle-like spines; rare in Ireland; excellent edible; medicinal properties',
    sensitive: false,
  },
  {
    latinName: 'Auricularia auricula-judae',
    commonEn: "Jelly Ear / Jew's Ear",
    commonGa: 'Cluas Liath',
    slug: 'jelly-ear',
    edibility: 'EDIBLE' as Edibility,
    season: 'Year-round',
    habitat: 'Elder and other hardwoods',
    keyTraits: 'Ear-shaped; brown gelatinous; grows on dead wood; edible; used in Asian cuisine',
    sensitive: false,
  },
  {
    latinName: 'Trametes versicolor',
    commonEn: 'Turkey Tail',
    commonGa: 'Eireaball Turcaí',
    slug: 'turkey-tail',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Year-round',
    habitat: 'Dead hardwood logs and stumps',
    keyTraits: 'Thin brackets with colorful concentric zones; velvety; medicinal properties; too tough to eat',
    sensitive: false,
  },
  {
    latinName: 'Ganoderma lucidum',
    commonEn: 'Reishi / Lacquered Bracket',
    commonGa: 'Fungais Véarnaiseach',
    slug: 'reishi',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Hardwood stumps and logs',
    keyTraits: 'Shiny reddish-brown bracket; kidney-shaped; woody; highly valued medicinally; too woody to eat',
    sensitive: false,
  },
  {
    latinName: 'Hydnum repandum',
    commonEn: 'Wood Hedgehog',
    commonGa: 'Gráinneog Choille',
    slug: 'wood-hedgehog',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Mixed woodland',
    keyTraits: 'Cream to pale orange cap; spines instead of gills; solid stem; good edible; peppery when old',
    sensitive: false,
  },
  {
    latinName: 'Clitocybe rivulosa',
    commonEn: 'Fool\'s Funnel',
    commonGa: 'Scairt an Amadáin',
    slug: 'fools-funnel',
    edibility: 'DEADLY' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Grassland, lawns',
    keyTraits: 'Small whitish cap; crowded white gills; mealy smell; DEADLY - contains muscarine; confused with edible species',
    sensitive: true,
  },
  {
    latinName: 'Mycena pura',
    commonEn: 'Lilac Bonnet',
    commonGa: 'Cochaillín Liathchorcra',
    slug: 'lilac-bonnet',
    edibility: 'TOXIC' as Edibility,
    season: 'Summer to autumn (June-November)',
    habitat: 'Woodland, especially beech',
    keyTraits: 'Lilac-pink throughout; bell-shaped cap; radish smell; contains muscarine - POISONOUS',
    sensitive: false,
  },
  {
    latinName: 'Agaricus arvensis',
    commonEn: 'Horse Mushroom',
    commonGa: 'Beacán Capaill',
    slug: 'horse-mushroom',
    edibility: 'EDIBLE' as Edibility,
    season: 'Summer to autumn (July-October)',
    habitat: 'Grassland, pastures, roadsides',
    keyTraits: 'Large white cap; pink gills becoming chocolate brown; aniseed smell; good edible',
    sensitive: false,
  },
  {
    latinName: 'Psilocybe semilanceata',
    commonEn: 'Liberty Cap',
    commonGa: 'Caipín Saoirse',
    slug: 'liberty-cap',
    edibility: 'TOXIC' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Grassland, pastures, especially sheep fields',
    keyTraits: 'Small bell-shaped cap; brown with nipple; long thin stem; contains psilocybin - PSYCHOACTIVE',
    sensitive: true,
  },
  {
    latinName: 'Coprinopsis atramentaria',
    commonEn: 'Common Inkcap',
    commonGa: 'Caipín Dúigh Coiteann',
    slug: 'common-inkcap',
    edibility: 'CAUTION' as Edibility,
    season: 'Year-round',
    habitat: 'Woodland, grassland, gardens',
    keyTraits: 'Grey-brown cap; deliquesces to black ink; causes alcohol intolerance; edible when young but avoid with alcohol',
    sensitive: false,
  },
  {
    latinName: 'Mycena galericulata',
    commonEn: 'Bonnet Mycena',
    commonGa: 'Cochaillín Coiteann',
    slug: 'bonnet-mycena',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Autumn to winter',
    habitat: 'Dead hardwood logs and stumps',
    keyTraits: 'Small grey-brown bell cap; white gills; tough stem; inedible',
    sensitive: false,
  },
  {
    latinName: 'Collybia dryophila',
    commonEn: 'Russet Toughshank',
    commonGa: 'Lámh Chrua Léana',
    slug: 'russet-toughshank',
    edibility: 'EDIBLE' as Edibility,
    season: 'Late summer to autumn (August-November)',
    habitat: 'Woodland, leaf litter',
    keyTraits: 'Orange-brown cap; tough fibrous stem; edible but not highly regarded',
    sensitive: false,
  },
  {
    latinName: 'Pholiota squarrosa',
    commonEn: 'Shaggy Pholiota',
    commonGa: 'Fioliota Fionnach',
    slug: 'shaggy-pholiota',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Dead and living hardwood trees',
    keyTraits: 'Yellow cap with shaggy brown scales; grows in clusters; bitter taste but edible',
    sensitive: false,
  },
  {
    latinName: 'Flammulina velutipes',
    commonEn: 'Velvet Shank',
    commonGa: 'Lámh Siodamh',
    slug: 'velvet-shank',
    edibility: 'EDIBLE' as Edibility,
    season: 'Late autumn to spring (November-March)',
    habitat: 'Dead hardwood stumps and logs',
    keyTraits: 'Slimy orange cap; dark velvety stem; grows in cold weather; good edible',
    sensitive: false,
  },
  {
    latinName: 'Inocybe geophylla',
    commonEn: 'White Fibrecap',
    commonGa: 'Fíbre-Caipín Bán',
    slug: 'white-fibrecap',
    edibility: 'TOXIC' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Woodland, especially coniferous',
    keyTraits: 'White conical cap with radial fibers; contains muscarine - POISONOUS',
    sensitive: false,
  },
  {
    latinName: 'Cortinarius violaceus',
    commonEn: 'Violet Webcap',
    commonGa: 'Caipín Corcra',
    slug: 'violet-webcap',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Mixed woodland, especially beech',
    keyTraits: 'Distinctive deep violet throughout; rare but beautiful; edible',
    sensitive: false,
  },
  {
    latinName: 'Gymnopilus penetrans',
    commonEn: 'Common Rustgill',
    commonGa: 'Gill Rustomha',
    slug: 'common-rustgill',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Year-round',
    habitat: 'Conifer stumps and logs',
    keyTraits: 'Orange-yellow cap; rusty brown gills; bitter taste; possibly psychoactive',
    sensitive: false,
  },
  {
    latinName: 'Tricholoma terreum',
    commonEn: 'Grey Knight',
    commonGa: 'Ridire Liath',
    slug: 'grey-knight',
    edibility: 'EDIBLE' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Coniferous woodland',
    keyTraits: 'Grey-brown cap; white gills; edible and good',
    sensitive: false,
  },
  {
    latinName: 'Stropharia aeruginosa',
    commonEn: 'Verdigris Agaric',
    commonGa: 'Agaric Uimh Meirge',
    slug: 'verdigris-agaric',
    edibility: 'UNKNOWN' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Woodland, gardens',
    keyTraits: 'Beautiful blue-green cap fading to yellow; slimy; uncommon',
    sensitive: false,
  },
  {
    latinName: 'Entoloma sinuatum',
    commonEn: 'Livid Pinkgill',
    commonGa: 'Gill Bán Corcra',
    slug: 'livid-pinkgill',
    edibility: 'TOXIC' as Edibility,
    season: 'Autumn (September-November)',
    habitat: 'Woodland, especially beech',
    keyTraits: 'Large grey-white cap; pink gills; mealy smell; causes severe gastrointestinal upset',
    sensitive: false,
  },
  {
    latinName: 'Leccinum scabrum',
    commonEn: 'Brown Birch Bolete',
    commonGa: 'Boileatán Donn Beithe',
    slug: 'brown-birch-bolete',
    edibility: 'EDIBLE' as Edibility,
    season: 'Summer to autumn (July-November)',
    habitat: 'Under birch trees',
    keyTraits: 'Brown cap; white pores; stem with black scales; good edible',
    sensitive: false,
  },
];

const glossaryTerms = [
  {
    termGa: 'Beacán',
    variants: ['beacáin', 'beacánach'],
    meaning: 'Mushroom (general term)',
    regions: ['All Ireland'],
    sources: ['Foclóir Gaeilge-Béarla'],
  },
  {
    termGa: 'Muisiriún',
    variants: ['muisiriúin'],
    meaning: 'Mushroom (cultivated)',
    regions: ['All Ireland'],
    sources: ['Standard Irish'],
  },
  {
    termGa: 'Pucaí',
    variants: ['púcaí', 'púca'],
    meaning: 'Toadstool, poisonous mushroom',
    regions: ['Munster', 'Connacht'],
    sources: ['Traditional Irish'],
  },
  {
    termGa: 'Cos préacháin',
    variants: [],
    meaning: "Literally 'crow's foot', fairy ring mushroom",
    regions: ['Connacht'],
    sources: ['Folklore'],
  },
  {
    termGa: 'Balláin chapall',
    variants: ['balláin chapaill'],
    meaning: "Literally 'horse ball', puffball",
    regions: ['Ulster', 'Connacht'],
    sources: ['Traditional Irish'],
  },
  {
    termGa: 'Cluas liath',
    variants: [],
    meaning: "Literally 'grey ear', wood ear fungus",
    regions: ['Munster'],
    sources: ['Traditional Irish'],
  },
  {
    termGa: 'Coill',
    variants: ['coillte'],
    meaning: 'Wood, woodland (habitat term)',
    regions: ['All Ireland'],
    sources: ['Standard Irish'],
  },
  {
    termGa: 'Páirc',
    variants: ['páirceanna'],
    meaning: 'Field, pasture (habitat term)',
    regions: ['All Ireland'],
    sources: ['Standard Irish'],
  },
  {
    termGa: 'Fásra',
    variants: [],
    meaning: 'Vegetation, flora',
    regions: ['All Ireland'],
    sources: ['Standard Irish'],
  },
  {
    termGa: 'Nimhiúil',
    variants: [],
    meaning: 'Poisonous, toxic',
    regions: ['All Ireland'],
    sources: ['Standard Irish'],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.glossary.deleteMany();
  await prisma.species.deleteMany();

  // Seed species
  console.log('Seeding species...');
  for (const species of irishSpecies) {
    await prisma.species.create({
      data: species,
    });
  }
  console.log(`✅ Created ${irishSpecies.length} species`);

  // Seed glossary
  console.log('Seeding glossary...');
  for (const term of glossaryTerms) {
    await prisma.glossary.create({
      data: term,
    });
  }
  console.log(`✅ Created ${glossaryTerms.length} glossary terms`);

  // Add lookalikes relationships
  console.log('Adding lookalike relationships...');
  
  // Death Cap <-> Field Mushroom (deadly confusion!)
  const deathCap = await prisma.species.findUnique({ where: { slug: 'death-cap' } });
  const fieldMushroom = await prisma.species.findUnique({ where: { slug: 'field-mushroom' } });
  if (deathCap && fieldMushroom) {
    await prisma.species.update({
      where: { slug: 'death-cap' },
      data: { lookalikeIds: [fieldMushroom.id] },
    });
    await prisma.species.update({
      where: { slug: 'field-mushroom' },
      data: { lookalikeIds: [deathCap.id] },
    });
  }
  
  // False Morel <-> Common Morel (deadly confusion!)
  const falseMorel = await prisma.species.findUnique({ where: { slug: 'false-morel' } });
  const commonMorel = await prisma.species.findUnique({ where: { slug: 'common-morel' } });
  if (falseMorel && commonMorel) {
    await prisma.species.update({
      where: { slug: 'false-morel' },
      data: { lookalikeIds: [commonMorel.id] },
    });
    await prisma.species.update({
      where: { slug: 'common-morel' },
      data: { lookalikeIds: [falseMorel.id] },
    });
  }
  
  // Fool's Funnel <-> Field Mushroom (deadly confusion!)
  const foolsFunnel = await prisma.species.findUnique({ where: { slug: 'fools-funnel' } });
  if (foolsFunnel && fieldMushroom) {
    await prisma.species.update({
      where: { slug: 'fools-funnel' },
      data: { lookalikeIds: [fieldMushroom.id] },
    });
  }
  
  // Sickener <-> Chanterelle (color confusion)
  const sickener = await prisma.species.findUnique({ where: { slug: 'sickener' } });
  const chanterelle = await prisma.species.findUnique({ where: { slug: 'chanterelle' } });
  if (sickener && chanterelle) {
    await prisma.species.update({
      where: { slug: 'sickener' },
      data: { lookalikeIds: [chanterelle.id] },
    });
  }
  
  // Sulphur Tuft <-> Honey Fungus (cluster confusion)
  const sulphurTuft = await prisma.species.findUnique({ where: { slug: 'sulphur-tuft' } });
  const honeyFungus = await prisma.species.findUnique({ where: { slug: 'honey-fungus' } });
  if (sulphurTuft && honeyFungus) {
    await prisma.species.update({
      where: { slug: 'sulphur-tuft' },
      data: { lookalikeIds: [honeyFungus.id] },
    });
    await prisma.species.update({
      where: { slug: 'honey-fungus' },
      data: { lookalikeIds: [sulphurTuft.id] },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

