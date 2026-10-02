const fs = require("fs");
const code = fs.readFileSync("app.js", "utf8");

const engineCode = code.substring(0, code.indexOf("class App {"));
const fn = new Function(engineCode + `
  return {
    INITIAL_PATIENTS,
    INITIAL_RESOURCES,
    GreedyAllocationEngine
  };
`);

const { INITIAL_PATIENTS, INITIAL_RESOURCES, GreedyAllocationEngine } = fn();
const patientsCopy = JSON.parse(JSON.stringify(INITIAL_PATIENTS));
const resourcesCopy = JSON.parse(JSON.stringify(INITIAL_RESOURCES));

const result = GreedyAllocationEngine.runAllocation(patientsCopy, resourcesCopy);
const allocated = result.updatedPatients.filter(p => p.status === "Allocated");
const waiting = result.updatedPatients.filter(p => p.status === "Waiting");

console.log("ALGORITHM TEST SUCCESSFUL:");
console.log(`- Total Evaluated: ${result.updatedPatients.length}`);
console.log(`- Allocated: ${allocated.length}`);
console.log(`- Waiting: ${waiting.length}`);
console.log("- Result Keys:", Object.keys(result));
