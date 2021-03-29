module.exports = {
  title: 'Knowledge Base',
  description: '知识分享',
  // dest: 'public', //default build path is ".vuepress/dist/"
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN',
    },
    '/en/': {
      lang: 'en-US',
    }
  },
  themeConfig: {
    type: 'blog',
    logo: '/logo.png',
    authorAvatar: '/avatar.png',
    subSidebar: 'auto',
    locales: {
      '/en/': {
        // text for the language dropdown
        selectText: 'Languages',
        // label for this locale in the language dropdown
        label: 'English',
        // Aria Label for locale in the dropdown
        ariaLabel: 'Languages',
        // text for the edit-on-github link
        editLinkText: 'Edit this page on GitHub',
        // algolia docsearch options for current locale
        algolia: {},
        nav: [
          { text: 'Home', link: '/', icon: 'reco-home' },
          { text: 'Time Line', link: '/timeline/', icon: 'reco-date' },
          { text: 'Blogs', link: '/categories/abp/' },
          {
            text: 'Contact',
            icon: 'reco-message',
            items: [
              { text: 'GitHub', link: 'https://github.com/gerryge', icon: 'reco-github' }
            ]
          }
        ],
        // sidebar: {
        //   '/': [/* ... */],
        //   '/nested/': [/* ... */]
        // }
      },
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          { text: '首页', link: '/', icon: 'reco-home' },
          { text: '时间线', link: '/timeline/', icon: 'reco-date' },
          { text: '博客', link: '/categories/abp/' },
          {
            text: '联系',
            icon: 'reco-message',
            items: [
              { text: 'GitHub', link: 'https://github.com/gerryge', icon: 'reco-github' }
            ]
          }
        ],
        algolia: {},
        // sidebar: {
        //   '/zh/': [/* ... */],
        //   '/zh/nested/': [/* ... */]
        // }
      }
    },
    sidebar: {
      '/architecture/2021/': [
        '',     /* /foo/ */
        'abp',  /* /foo/one.html */
        'ddd'   /* /foo/two.html */
      ],

      '/bar/': [
        '',      /* /bar/ */
        'three', /* /bar/three.html */
        'four'   /* /bar/four.html */
      ],

      '/baz/': 'auto', /* automatically generate single-page sidebars */

      // // fallback
      // '/': [
      //   '',        /* / */
      //   'contact', /* /contact.html */
      //   'about'    /* /about.html */
      // ]
    },
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    friendLink: [
      {
        title: 'dyabp',
        desc: 'Empowering Your Abp Development',
        avatar: "https://dyabp.github.io/logo.png",
        link: 'https://dyabp.github.io'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ],
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    // sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Gerry Ge',
    // 作者头像
    authorAvatar: '/avatar.png',
    // 备案号
    // record: 'ICP 备案文案',
    // recordLink: 'ICP 备案指向链接',
    cyberSecurityRecord: '苏公网安备 32059002002321号',
    cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32059002002321',
    // 项目开始时间
    startYear: '2020',
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment https://valine.js.org)
     */

    valineConfig: {
      appId: 'bHmo0i902HKNBRJawFHbQanC-gzGzoHsz',
      appKey: '7BhtmrN68Mwi7tpI0AgGVSCD',
      //showComment: true,
      placeholder: 'To leave a comment. Styling with Markdown is supported.', //# comment box placeholder
      avatar: 'robohash', // (''/mp/identicon/monsterid/wavatar/robohash/retro/hide)
      // meta: nick,mail,link # custom comment header
      // pageSize: 10 # pagination size
      lang: 'zh-CN', //zh-CN,en
      visitor: true, //# Article reading statistic https://valine.js.org/visitor.html

    },
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
      body: [
        {
          type: 'title',
          content: '欢迎加入QQ交流群 🎉🎉🎉',
          style: 'text-aligin: center;'
        },
        {
          type: 'image',
          src: '/qqgroup.png'
        }
      ],
      footer: [
        {
          type: 'button',
          text: '打赏',
          link: '/donate'
        },
        {
          type: 'button',
          text: '打赏',
          link: '/donate'
        }
      ]
    }]
  ],
}  
