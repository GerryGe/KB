/*
 * 构造函数
 * 构造函数名约定首母大写，用来区分普通函数
 * 不需要return一个对象了
 * 
 */


function Person(name, age) {
  this.name = name;
  this.age = age;
  this.print = function () {
    console.log(`my name is ${this.name}, age is ${this.age}`)
  }
}

let zhangsan = new Person('zhangsan', 18);
zhangsan.print();

let lisi = new Person('lisi', 18);
lisi.print();



/**
 * 构造函数对于js面向对象非常重要，相当于是构造出一个类，再对这个类进行实例化
 *
 * function + 函数名(首字母大写) { 属性 + 方法 }
 *
 * this关键字：当new实例化一个对象时，那么构造函数中的this就指向了这个对象
 *
 * 构造函数的默认返回值：this(实例化出来的对象)
 *
 */