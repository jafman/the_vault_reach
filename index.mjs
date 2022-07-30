import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const accAlice = await stdlib.newTestAccounts(stdlib.parseCurrency(6000))
const accBob = await stdlib.newTestAccounts(stdlib.parseCurrency(100));
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const getBalance = async (who) => stdlib.formatCurrency(await stdlib.balanceOf(who));

console.log(`Alice's balance before is: ${getBalance(accAlice)}`);
console.log(`Bob's balance before is: ${getBalance(accBob)}`);

console.log('Starting backends...');

const commonInteract = () => ({
  showTime: (t) => {
    console.log(`Remaining time for is ${t} seconds ...`);
  }
})

await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    inherit: stdlib.parseCurrency(5000),
    ...commonInteract(),
    getChoice: () => {
      const choice = Math.floor(Math.random() * 2);
      const choiceMessage = !!choice ? 'I am still here!' : 'I am not here!'
      console.log(`Choice is: ${choiceMessage}`);
      //return !!choice;
      return true;
    }
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    ...commonInteract(),
    acceptTerms: (amount) => {
      console.log(`Bob has accepted the terms for a value of ${stdlib.formatCurrency(amount)}.`)
      return true;
    }
    // implement Bob's interact object here
  }),
]);

console.log(`Alice's account balance after is: ${getBalance(accAlice)}`);
console.log(`Bob's account balance after is: ${getBalance(accBob)}`);
console.log('Goodbye, Alice and Bob!');
