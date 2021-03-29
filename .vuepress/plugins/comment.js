const comment = [
    'vuepress-plugin-comment',
    {
        choosen: 'gitalk',
        options: {
            clientID: '',
            clientSecret: '',
            repo: 'gerryge.github.io',
            owner: 'gerryge',
            admin: ['gerryge'],
            id: '<%- frontmatter.commentid || frontmatter.permalink %>',      // Ensure uniqueness and length less than 50
            distractionFreeMode: false,  // Facebook-like distraction free mode
            labels: ['Gitalk', 'Comment'],
            title: '「评论」<%- frontmatter.title %>',
            body: '<%- frontmatter.title %>：<%- window.location.origin %><%- window.location.pathname %>'
            // frontmatter.to.path
        }
    }
];

module.exports = comment;