console.log('1 === 1', 1 === 1); // true

console.log(
  '"Refferential Equality" === "Refferential Equality"',
  '"Refferential Equality"' === '"Refferential Equality"'
); // true

console.log('{a:1} === {a:1}', { a: 1 } === { a: 1 }); // false

console.log('{} === {}', {} === {}); // false

console.log('[1, 2, 3] === [1, 2, 3]', [1, 2, 3] === [1, 2, 3]); // false

console.log('[] === []', [] === []); // false

const functionalComponent = () => {
  return () => {
    'This is a function';
  };
};

const funcFirstRender = functionalComponent();

const funcSecondRender = functionalComponent();

console.log('funcFirstRender === funcSecondRender', funcFirstRender === funcSecondRender);
