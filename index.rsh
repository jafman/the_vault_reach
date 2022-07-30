'reach 0.1';

const countDown = 20;
const commonInteract = {
  showTime: Fun([UInt], Null)
}
export const main = Reach.App(() => {
  const A = Participant('Alice', {
    // Specify Alice's interact interface here
    ...commonInteract,
    inherit: UInt,
    getChoice: Fun([], Bool)
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
    ...commonInteract,
    acceptTerms: Fun([UInt], Bool)
  });
  init();

  // The first one to publish deploys the contract
  A.only(() => {
    const value = declassify(interact.inherit);
  });
  A.publish(value).pay(value);
  commit();

  B.only(() => {
    const decision = declassify(interact.acceptTerms(value));
  });
  // The second one to publish always attaches
  B.publish(decision);
  commit();

  each([A, B], () => {
    interact.showTime(countDown)
  })
  A.only(() => {
    const stillHere = declassify(interact.getChoice());
  });
  A.publish(stillHere);

  if(stillHere) {
    transfer(value).to(A);
  } else {
    transfer(value).to(B);
  }

  commit();
  exit();
});
