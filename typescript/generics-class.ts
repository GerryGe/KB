// class DataManager {
//   constructor(private data: string[] | number[]) {

//   }
//   getItem(index: number): string | number {
//     return this.data[index];
//   }
// }

// const data = new DataManager([1]);
// data.getItem(0);


// class DataManager<T> {
//   constructor(private data: T[]) { }
//   getItem(index: number): T {
//     return this.data[index];
//   }
// }
// const data = new DataManager<number>([1]);
// data.getItem(0);


// interface Item {
//   name: string;
// }

// class DataManager<T extends Item> {
//   constructor(private data: T[]) { }
//   getItem(index: number): string {
//     return this.data[index].name;
//   }
// }

// const data = new DataManager([
//   {
//     name: 'gerry'
//   }
// ]);



// class DataManager<T> {
//   constructor(private data: T[]) { }
//   getItem(index: number): T {
//     return this.data[index];
//   }
// }

// interface Test {
//   name: string
// }

// const data = new DataManager<Test>([]);


class DataManager<T extends number | string> {
  constructor(private data: T[]) { }
  getItem(index: number): T {
    return this.data[index];
  }
}

interface Test {
  name: string
}

// const data = new DataManager<Test>([]);//error
const data = new DataManager<string>([]);



// const func: () => string = () => {
//   return '123';
// }

// const func: <T>() => string = <T>() => {
//   return '123';
// }

function hello<T>(params: T) {
  return params;
}

const func: <T>(param: T) => T = hello;