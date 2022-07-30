import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000))
const accBob = await stdlib.newTestAccount(stdlib.parseCurrency(100));
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const getBalance = async (who) => stdlib.formatCurrency(await stdlib.balanceOf(who));

console.log(`Alice's balance before is: ${await getBalance(accAlice)}`);
console.log(`Bob's balance before is: ${await getBalance(accBob)}`);

console.log('Starting backends...');

const commonInteract = () => ({
  showTime: (t) => {
    console.log(`Countdown is ${parseInt(t)} ...`);
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
      return !!choice;
    }
    
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    ...commonInteract(),
    acceptTerms: (amount) => {
      console.log(`Bob has accepted the terms for a value of ${stdlib.formatCurrency(amount)}.`)
      return true;
    }
    
  }),
]);

console.log(`Alice's account balance after is: ${await getBalance(accAlice)}`);
console.log(`Bob's account balance after is: ${await getBalance(accBob)}`);
console.log('Goodbye, Alice and Bob!');
