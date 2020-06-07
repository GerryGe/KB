//原型继承

//__proto__
function Animal(eats) {
  this.eats = eats;
  this.run = function () {
    console.log('animal can run...')
  }
}

function Rabbit(jump) {
  this.jump = jump;
}

let animal = new Animal('grass');
let rabbit = new Rabbit('jump');

rabbit.__proto__ = animal;
console.log(rabbit.eats);
rabbit.run();

/**
 *
 * __proto__: 不支持IE浏览器，其它的浏览器可以正常使用
 * prototype: 处理了兼容问题
 *
 */