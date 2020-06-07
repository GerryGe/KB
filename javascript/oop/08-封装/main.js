// 封装

//原始方法
/* let hide = document.getElementById('hide');
let show = document.getElementById('show');
let image = document.getElementById('image');

hide.onclick = function () {
  image.style.display = 'none';
}

show.onclick = function () {
  image.style.display = 'block';
} */

/*
  仿JQ第一步：document.getElementById()方法太长，所以改
  封装的好处：
    1.简化代码
    2.实现DRY
    3.尽量不要暴露你的代码
*/

/* let $ = function (id) {
  return document.getElementById(id);
}

$('hide').onclick = function () {
  $('image').style.display = 'none';
}

$('show').onclick = function () {
  $('image').style.display = 'block';
} */

//HTMLElement扩展
/* let $ = function (id) {
  return document.getElementById(id);
}

HTMLElement.prototype.hide = function () {
  this.style.display = 'none';
}

HTMLElement.prototype.show = function () {
  this.style.display = 'block';
}

$('hide').onclick = function () {
  $('image').hide() = 'none';
}

$('show').onclick = function () {
  $('image').show() = 'block';
} */


/*
  仿JQ第二步：HTMLElement对象，IE不支持，所以需要继续改
*/

//Prototype
/* let F = function (id) {
  this.element = document.getElementById(id);
}

F.prototype.hide = function () {
  this.element.style.display = 'none';
}

F.prototype.show = function () {
  this.element.style.display = 'block';
}

document.getElementById('hide').onclick = function () {
  new F('image').hide();
}
document.getElementById('show').onclick = function () {
  new F('image').show();
} */


/*
  仿JQ第三步：document.getElementById()又出来了，所以需要继续改
*/

// 封装选择器
/* let F = function (id) {
  //return this.getElementById(id);
  this.getElementById(id);//return可以省略
}

F.prototype.getElementById = function (id) {
  this.element = document.getElementById(id);
  return this;
}

F.prototype.hide = function () {
  this.element.style.display = 'none';
}

F.prototype.show = function () {
  this.element.style.display = 'block';
}
document.getElementById('hide').onclick = function () {
  new F('image').hide();
}
document.getElementById('show').onclick = function () {
  new F('image').show();
} */


/*
  仿JQ第四步：document.getElementById()还在，所以需要继续改
*/

// 封装获取多种类型的选择器

//贴换掉document.getElementById()方法
/* let F = function (id) {
  //return this.getElementById(id);
  this.getElementById(id);//return可以省略
}

F.prototype.getElementById = function (id) {
  this.element = document.getElementById(id);
  return this;
}

F.prototype.hide = function () {
  this.element.style.display = 'none';
}

F.prototype.show = function () {
  this.element.style.display = 'block';
}
new F('hide').element.onclick = function () {
  new F('image').hide();
}
new F('show').element.onclick = function () {
  new F('image').show();
} */

//将html中的show从id变成class
let F = function (selector) {
  this.getNodeList(selector);
}

F.prototype.getNodeList = function (selector) {
  this.element = document.querySelectorAll(selector);
  //return this;
}

F.prototype.hide = function () {
  for (let i = 0; i < this.element.length; i++) {
    this.element[i].style.display = 'none';
  }
}

F.prototype.show = function () {
  for (let i = 0; i < this.element.length; i++) {
    this.element[i].style.display = 'block';
  }
}

let $ = function (selector) {
  return new F(selector);
}

// $('#hide').element[0].onclick = function () {
//   $('#image').element[0].style.display = 'none';
// }
$('#hide').element[0].onclick = function () {
  $('#image').hide();
}

$('.show').element[0].onclick = function () {
  $('#image').show();
}