// let obj = new Object();
// let str = new String();
// let num = new Number();
// let bln = new Boolean();
// let arr = new Array();
// let date = new Date();

var person = {};

//自定义属性和方法
person._name = "Gerry";
console.log(person._name);

//自定义方法
person.sayHi = function () {
  console.log(`Hi ${person._name}`);
}
person.sayHi();

//组合创建对象
let obj = {
  name: "Gerry",
  sayHi: function () {
    console.log(`Hi ${obj.name}`);
  }
}

let obj2 = {
  name: "Ge",
  sayHi: function () {
    console.log(`Hi ${obj.name}`);
  }
}

console.log(obj.name);
obj.sayHi();

/**
 * 
 * 问题： 如果创建多个具有相同属性的对象，这种创建方式的效率太低
 * 
 * 
 */


