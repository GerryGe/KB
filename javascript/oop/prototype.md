# 原型继承


虽然JavaScript里一切皆对象，但为了理解原型链系统，我们需要将JavaScript的对象分为对象和函数两大类。在此基础上，JavaScript的原型链逻辑遵从以下通用规则：

### 通用规则
对象有__proto__属性，函数有prototype属性；
对象由函数生成;
生成对象时，对象的__proto__属性指向函数的prototype属性。
在没有手动修改__proto__属性的指向时，以上三条便是JavaScript默认原型链指向逻辑。


Object本身是一个函数，可以当作工具方法使用，将任意值转为对象。这个方法常用于保证某个值一定是对象。

--如果参数为空（或者为undefined和null），Object()返回一个空对象。例如 var obj = Object();，返回的就是{}对象
--var obj = new Object(); 可以当作构造函数使用，直接生成新对象。

比如说用法，Object(value)与new Object(value)两者的语义是不同的，Object(value)表示将value转成一个对象，new Object(value)则表示新生成一个对象，它的值是value。


```javascript
Function.__proto__ === Function.prototype //true

Function.prototype.__proto__ === Object.prototype //true

Object.prototype.__proto__ //null 这个是原型链的终点了
Object.getPrototypeOf(Object.prototype) // null

Object.prototype.constructor === Object //true
```

![prototype](/javascript/oop/imgs/prototype2.png)


> - https://www.jianshu.com/p/686b61c4a43d
> - https://www.zhihu.com/question/34183746
> - https://juejin.im/entry/5881fca52f301e006988b7dc
> - https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript
> - https://toutiao.io/posts/0r8q44/preview
> - https://github.com/creeperyang/blog/issues/9
> - http://www.mollypages.org/tutorials/js.mp