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
  const deathCap = await prisma.species.findUnique({
    where: { slug: 'death-cap' },
  });
  const fieldMushroom = await prisma.species.findUnique({
    where: { slug: 'field-mushroom' },
  });

  if (deathCap && fieldMushroom) {
    await prisma.species.update({
      where: { slug: 'death-cap' },
      data: {
        lookalikeIds: [fieldMushroom.id],
      },
    });
    await prisma.species.update({
      where: { slug: 'field-mushroom' },
      data: {
        lookalikeIds: [deathCap.id],
      },
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

