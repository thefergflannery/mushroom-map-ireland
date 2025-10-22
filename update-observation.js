const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateObservationStatus() {
  try {
    const result = await prisma.observation.update({
      where: { id: 'cmh1od5yq0006jl04lp671u7h' },
      data: { status: 'CONSENSUS' },
    });
    
    console.log('Updated observation:', result);
  } catch (error) {
    console.error('Error updating observation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateObservationStatus();
