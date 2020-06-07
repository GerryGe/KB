//工厂模式

// function factory() {
//   let obj = {};

//   obj.name = "Gerry";
//   obj.age = 18;
//   obj.sayHi = function () {
//     console.log(`Hi ${obj.name}, your age is ${obj.age}`)
//   }
//   return obj;
// }

// let zhangsan = factory();
// console.log(zhangsan.name);

function factory(name, age) {
  let obj = {};

  obj.name = name;
  obj.age = age;
  obj.sayHi = function () {
    console.log(`Hi ${obj.name}, your age is ${obj.age}`)
  }
  return obj;
}

let zhangsan = factory('zhangsan', 20);
console.log(zhangsan.name);
zhangsan.sayHi();

let lisi = factory('lisi', 20);
lisi.sayHi();