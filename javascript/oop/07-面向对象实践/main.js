// 面向对象实践

/*
  1.不要使用变量
  2.不要使用函数
  3.要使用prototype / 构造函数
*/


function TabFn(id) {
  this.oTab = document.getElementById(id);
  this.aBtn = this.oTab.getElementsByTagName('input');
  this.aDiv = this.oTab.getElementsByTagName('div');

  let _this = this;
  // 通过循环处理每个btn
  for (let i = 0; i < this.aBtn.length; i++) {
    // 拿到每个button的下标
    this.aBtn[i].index = i;
    this.aBtn[i].onclick = function () {
      _this.exchange(this);
    }

  }
}

//通过prototype为TabFn扩展方法
TabFn.prototype.exchange = function (obj) {
  //循环处理三个div 
  for (let i = 0; i < this.aDiv.length; i++) {
    this.aBtn[i].className = '';
    this.aDiv[i].className = '';
  }
  obj.className = 'active';
  this.aDiv[obj.index].className = 'active';
}

let tab = new TabFn('tab');