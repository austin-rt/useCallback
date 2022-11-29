In this lesson, we will learn how and when to use React's `useCallback` hook and how to avoid a mistake made by most Junior React Developers.

# Getting Started

- `fork and clone`
- `npm i`
- `cd client`
- `npm start`

# Referential Equality

Referential Equality is a foundational concept in both JavaScript and Computer Science as a whole. So let's start with a demonstration of referential equality in action.

You can simply read along or run `referrentialEquality.js` to observe the output.

```js
console.log(1 === 1);
// prints true
```

When evaluating whether the `integer 1` is strictly equal to the `integer 1`, the console prints `true`. This is because, well... the `integer 1` **is** strictly equal to the `integer 1`.

We see the same result when evaluating two strings.

```js
console.log('Referential Equality' === 'Referential Equality');
// prints true
```

This will always be the case for two [primative data types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) of the same value.

Now, what about data structures? For example, two object literals with the same key/value pairs? What output should we see?

```js
console.log({ a: 1 } === { a: 1 });
// prints false
```

Why would this print `false`? When comparing whether these two object literals are strictly equal, JavaScript uses their respective **_memory addresses_**.

In other words, these two objects may contain the same **values**, but they're not **referencing the same object**.

They _look_ the same but occupy two **_different_** spaces in memory.

The same applies whether you're comparing two object literals, two array literals (even if they're empty), or two functions!

```js
console.log({} === {});
// prints false

console.log([1, 2, 3] === [1, 2, 3]);
// prints false

console.log([] === []);
// prints false
```

To demonstrate this further, we will define a function `func`, which returns an anonymous function that, in turn, returns something else (think something like a JSX element).

```js
const func = () => {
  return () => 'This is a pretend component';
};
```

We will then assign two different functions, `firstRender` and `secondRender`, equal to the value returned by `func`.

```js
const firstRender = func();

const secondRender = func();
```

Think of `func` as your React functional component, while `firstRender` is a function _inside_ of it on the first render, and `secondRender` is a function _inside_ of it on the second render.

Even though `firstRender` and `secondRender` look the same, return the same value, and are even assigned their value from the same definition, they do not have **_referrential equality_**. As a result, every time the parent component renders, it redefines this function.

```js
console.log(firstRender === secondRender);
// false
```

Unfortunately, in JavaScript, it isn't easy to print these memory addresses (like it would be in Python), but for a slightly more in-depth explanation of reference vs. value, take a look at [this article](https://www.freecodecamp.org/news/how-to-get-a-grip-on-reference-vs-value-in-javascript-cba3f86da223/).

This topic can get dense, and you don't need to teach a class on it tonight. So for now, just remember

- primitive data type `===` primitive data type
- data structure `!==` data structure.

With referential equality out of the way, let's dive into our React code and see why this is relevant.

# Starter Code

Start by looking through the provided code, then open your dev tools. We're going to be using the browser's console in a bit.

After we spin up our app, open the `BookDetails.jsx` page, and save, the first thing we may notice when we look at our React server's logs is a common React warning that young developers tend to ignore. As you hit the workforce and start writing code for production, your linters will most likely be even more strict. `WARNINGS` will turn to `ERRORS`, and some linters won't even allow you to push without addressing them.

And brace yourself; most linters won't allow `console.logs` in your code. So the earlier you learn the proper way, the better. So, on to this `WARNING`.

```
WARNING in [eslint]
src/components/BookDetails.jsx
  Line 18:6:  React Hook useEffect has a missing dependency: 'getBookDetails'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

webpack compiled with 1 warning
```

**_NOTE: we must first save the file to recreate this `WARNING`_**

If you dig into the [React Docs](https://beta.reactjs.org/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies), the few solutions this semi-confusing `WARNING` is suggesting are:

---

Take a moment to think through the consequences of each option.

<details>
<summary>
1. include the function definition inside of the <code>useEffect</code>
 </summary>
<blockquote>
We cannot call this function elsewhere unless we redefine it.
</blockquote>
 </details>

</br>

<details>
<summary>
2. remove the dependency array
</summary>
<blockquote>
This will trigger the <code>useEffect</code> <strong>every time</strong> the state or props change, typically causing an infinite re-render, and in our case, it will overload our API endpoint with infinite requests.
</blockquote>
</details>

</br>

<details>
<summary>
3. remove the function call from the <code>useEffect</code>
</summary>
<blockquote>
The function won't get called.
</blockquote>
</details>

</br>

<details>
<summary>
4. include the function in the dependency array
</summary>
<blockquote>
The first time the component renders, it will define our function, which will trigger the useEffect, which will cause the component to re-render, which will redefine the function, which will trigger the useEffect, which will cause the component to re-render, which will redefine the function...
</blockquote>
</details>
</br>

So... _what's a developer to do?_

---

The simplest and preferred solution would be to 'include it,' i.e., move the `getBookDetails` function definition inside the `useEffect`. This adheres to an Object-Oriented Programming principal known as [Encapsulation](https://stackify.com/oop-concept-for-beginners-what-is-encapsulation/).

What if we need to call the function elsewhere? Should we redefine it later? That's not very DRY of us. So let's see React's other suggestion in the above warning.

Let's change our dependency array to include our function reference. Your `useEffect` should now look like this.

```js
useEffect(() => {
  getBookDetails();
}, [getBookDetails]);
```

And `getBookDetails` remains defined above, before the `useEffect`.

```js
const getBookDetails = async () => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  setBook(res.data);
  console.log(res.data);
};
```

Now we have a new `WARNING`:

```
WARNING in [eslint]
src/components/BookDetails.jsx
  Line 10:9:  The 'getBookDetails' function makes the dependencies of useEffect Hook (at line 18) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'getBookDetails' in its own useCallback() Hook  react-hooks/exhaustive-deps

webpack compiled with 1 warning
```

# Enter the `useCallback` Hook

In short, the `useCallback` hook allows you to cache, or ‘momo-ize’ a function between re-renders of your component. It performs a similar task to `useMemo`.

Again from the React docs, we learn:

<blockquote>
The difference is in what they’re letting you cache.
</br>
</br>
<code>useMemo</code> caches the result of calling your function.
</br>
</br>
<code>useCallback</code> caches the function itself. 
</blockquote>
</br>

If the nitty-gritty of this interests you, you can read more about it in the [React docs](https://beta.reactjs.org/apis/react/useCallback).

# `useCallback` Syntax

`useCallback` syntax is very similar to the `useEffect` syntax, which we already know. Look at the skeletons of each.

```js
useEffect(() => {}, []);

useCallback(() => {}, []);
```

The slight difference is this. With a `useEffect`, we tell the anonymous function to execute our function, while with a `useCallback`, we set the return value equal to a reference.

It's okay if that sounds like nonsense. Just follow along, and we'll compare the two at the end.

First, we will import `useCallback` from `'react'`.

```js
import { useState, useEffect, useCallback } from 'react';
```

Now that we've imported it, we can assign `getBookDetails` to the value returned from a `useCallback` function call.

```js
const getBookDetails = useCallback();
```

Then we add all the syntax for `useCallback`. Remember your dependency array!

```js
const getBookDetails = useCallback(() => {}, []);
```

Next, we add `async` before our parameters.

```js
const getBookDetails = useCallback(async () => {}, []);
```

And finally, we add the logic of our function into the code block.

```js
const getBookDetails = useCallback(async () => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  setBook(res.data);
  console.log(res.data);
}, []);
```

Once we save, we get… another `WARNING`.

```
WARNING in [eslint]
src/components/BookDetails.jsx
  Line 14:6:  React Hook useCallback has a missing dependency: 'id'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

webpack compiled with 1 warning
```

Let's think through this for a moment.

<details>
<summary>
Why should our dependency array track the <code>id</code> variable?
</summary>
<blockquote>
If the value of <code>id</code> changes, `getBookDetails` needs to hit a different endpoint, so React should redefine it. 
</blockquote>
</details>
</br>

After we add `id` to our dependency array, our finished `getBookDetails` and `useEffect` functions should look like this. Just look closely at the differences.

```js
const getBookDetails = useCallback(async () => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  setBook(res.data);
  console.log(res.data);
}, [id]);

useEffect(() => {
  getBookDetails();
}, [getBookDetails]);
```

And finally, we see green in our React logs. A happy linter is a happy Senior developer. And a happy Senior developer is a happy you.

# Resources

- [useCallback](https://beta.reactjs.org/apis/react/useCallback)
- [JavaScript Primitive Data Types vs. Data Structures](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
- [Referential Equality](https://www.freecodecamp.org/news/how-to-get-a-grip-on-reference-vs-value-in-javascript-cba3f86da223/)
- [React Docs](https://beta.reactjs.org/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)
- [Encapsulation](https://stackify.com/oop-concept-for-beginners-what-is-encapsulation/)
