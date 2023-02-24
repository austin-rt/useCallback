console.log('1 === 1', 1 === 1); // true

console.log(
  '"referential equality" === "referential equality"',
  '"referential equality"' === '"referential equality"'
); // true

console.log('{ a : 1 } === { a : 1 }', { a: 1 } === { a: 1 }); // false

console.log('{} === {}', {} === {}); // false

console.log('[1, 2, 3] === [1, 2, 3]', [1, 2, 3] === [1, 2, 3]); // false

console.log('[] === []', [] === []); // false

const func = () => {
  return () => {
    'This is a pretend functional component.';
  };
};

const funcFirstRender = func();

const funcSecondRender = func();

console.log(
  'funcFirstRender === funcSecondRender',
  funcFirstRender === funcSecondRender
);
