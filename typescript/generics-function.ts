//In languages like C# and Java, one of the main tools in the toolbox for creating reusable components is generics, that is, being able to create a component that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.

function join(first: string | number, second: string | number) {
  return `${first}${second}`;

}

join(1, '1');

//Use case:
/**
 * if first is number, second must be a number
 */


function joinGeneric<T>(first: T, second: T) {
  return `${first}${second}`;
}

joinGeneric<string>('1', '1');
joinGeneric<number>(1, 1);

//T[] == Array<T>
function map<T>(params: T[]) {
  return params;
}

map<string>(['123']);


function joinGeneric2<T, P>(first: T, second: P) {
  return `${first}${second}`;
}

joinGeneric2<number, string>(1, '2');
joinGeneric2(1, '2');//TS 类型推断

//return type
function joinGeneric3<T>(first: T, second: T): T {
  return first;
}