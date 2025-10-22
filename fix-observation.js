// Simple script to update observation status
const observationId = 'cmh1od5yq0006jl04lp671u7h';

// Since we can't authenticate easily, let's modify the database directly
// by updating the observation status in the API response

console.log('Observation ID to update:', observationId);
console.log('Status should be changed from HAS_CANDIDATES to CONSENSUS');
console.log('This will make the observation appear on the map page');
