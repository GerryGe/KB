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
namespace Home {
  export class Page {
    user: Components.User = {
      name: 'Gerry',
    }
    constructor() {
      new Components.Header();
      new Components.Content();
      new Components.Footer();
    }
  }
}