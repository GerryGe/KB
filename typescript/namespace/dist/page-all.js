"use strict";
var Components;
(function (Components) {
    var SubComponents;
    (function (SubComponents) {
        var Test = /** @class */ (function () {
            function Test() {
            }
            return Test;
        }());
        SubComponents.Test = Test;
    })(SubComponents = Components.SubComponents || (Components.SubComponents = {}));
    var Header = /** @class */ (function () {
        function Header() {
            var elem = document.createElement('div');
            elem.innerHTML = 'This is header.';
            document.body.appendChild(elem);
        }
        return Header;
    }());
    Components.Header = Header;
    var Content = /** @class */ (function () {
        function Content() {
            var elem = document.createElement('div');
            elem.innerHTML = 'This is content.';
            document.body.appendChild(elem);
        }
        return Content;
    }());
    Components.Content = Content;
    var Footer = /** @class */ (function () {
        function Footer() {
            var elem = document.createElement('div');
            elem.innerHTML = 'This is footer.';
            document.body.appendChild(elem);
        }
        return Footer;
    }());
    Components.Footer = Footer;
})(Components || (Components = {}));
// class Header {
//   constructor() {
//     const elem = document.createElement('div');
//     elem.innerHTML = 'This is header.';
//     document.body.appendChild(elem);
//   }
// }
// class Content {
//   constructor() {
//     const elem = document.createElement('div');
//     elem.innerHTML = 'This is content.';
//     document.body.appendChild(elem);
//   }
// }
// class Footer {
//   constructor() {
//     const elem = document.createElement('div');
//     elem.innerHTML = 'This is footer.';
//     document.body.appendChild(elem);
//   }
// }
// class Page {
//   constructor() {
//     new Header();
//     new Content();
//     new Footer();
//   }
// }
// namespace Home {
//   class Header {
//     constructor() {
//       const elem = document.createElement('div');
//       elem.innerHTML = 'This is header.';
//       document.body.appendChild(elem);
//     }
//   }
//   class Content {
//     constructor() {
//       const elem = document.createElement('div');
//       elem.innerHTML = 'This is content.';
//       document.body.appendChild(elem);
//     }
//   }
//   class Footer {
//     constructor() {
//       const elem = document.createElement('div');
//       elem.innerHTML = 'This is footer.';
//       document.body.appendChild(elem);
//     }
//   }
//   export class Page {
//     constructor() {
//       new Header();
//       new Content();
//       new Footer();
//     }
//   }
// }
///<reference path='./components.ts' />
var Home;
(function (Home) {
    var Page = /** @class */ (function () {
        function Page() {
            this.user = {
                name: 'Gerry',
            };
            new Components.Header();
            new Components.Content();
            new Components.Footer();
        }
        return Page;
    }());
    Home.Page = Page;
})(Home || (Home = {}));
