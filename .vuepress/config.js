// const comment = require('./plugins/comment');

module.exports = {
  title: "Knowledge Base",
  description: '知识分享',
  // dest: 'public', //default build path is ".vuepress/dist/"
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig: {
    mode: 'auto', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: true, // 默认 true，false 不显示模式调节按钮，true 则显示
    huawei: true,
    nextLinks: true,// 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    prevLinks: true,// 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    subSidebar: 'auto',//在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'Time Line', link: '/timeline/', icon: 'reco-date' },
      // { text: 'Docs', 
      //   icon: 'reco-message',
      //   items: [
      //     { text: 'vuepress-reco', link: '/docs/theme-reco/' }
      //   ]
      // },
      {
        text: 'Contact',
        icon: 'reco-message',
        items: [
          { text: 'GitHub', link: 'https://github.com/gerryge', icon: 'reco-github' }
        ]
      }
    ],
    //https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
    sidebar: {
      '/blogs/2021/Implementing_Domain_Driven_Design/': [
        ['./01_Introduction', '简介'],
        ['./02_What_Is_DDD', 'DDD是什么'],
        ['./03_Implementation_The_Big_Picture', '实现：全景图']
      ],
      //Multiple Sidebars
      '/bar/': [
        '',      /* /bar/ */
        'three', /* /bar/three.html */
        'four'   /* /bar/four.html */
      ],
    },
    type: 'blog',
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
    logo: '/logo.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    // sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'gerryge',
    // 作者头像
    authorAvatar: '/avatar.png',
    // 备案
    record: '苏ICP备18063100号-1',
    recordLink: 'https://beian.miit.gov.cn/',
    cyberSecurityRecord: '苏公网安备 32059002002321号',
    cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32059002002321',
    // 项目开始时间
    startYear: '2019',
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
    "vuepress-plugin-flowchart",
    ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
      width: '300px', // 默认 260px
      title: '消息提示',
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
        // {
        //   type: 'button',
        //   text: '打赏',
        //   link: '/donate'
        // },
        // {
        //   type: 'button',
        //   text: '打赏',
        //   link: '/donate'
        // }
      ]
    }]
  ]
}
