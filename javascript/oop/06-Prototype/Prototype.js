/**
 *
 * __proto__: 不支持IE浏览器，其它的浏览器可以正常使用
 * prototype: 处理了兼容问题
 *
 */

//1. 为一个构造函数实现扩展

function Person(name, age) {
  this.name = name;
  this.age = age;
}

//prototype
Person.prototype.sex = '男';
Person.prototype.print = function () {
  console.log('My name is ' + this.name + ", age is " +
    this.age + ", sex is " + this.sex)
}

//创建对象
// let person = new Person('Gerry', 18);
// person.print();

// person.name = "Lily";
// person.age = "20";
// person.sex = "female";
// person.print();


//2. 通过prototype实现继承
// function Student() {

// }

//Student.prototype = Person;//这样无法继承
// Student.prototype = new Person();//这样定义可以继承，但是无法传参数
// let stu = new Student();
// console.log(stu.sex);

function Student(name, age, sex, score) {
  this.p = Person;
  this.p(name, age);
  this.score = score;
}

Student.prototype = new Person();

//重写父类的方法
Student.prototype.print = function () {
  console.log('My name is ' + this.name +
    ", age is " + this.age +
    ", sex is " + this.sex +
    ", score is " + this.score);
}

let stu = new Student("Gerry", 29, 100)
stu.print();

//如果本类和父类有相同的属性和方法，本类的属性和方法优先级更高