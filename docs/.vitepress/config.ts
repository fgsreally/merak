import { defineConfig } from 'vitepress'
const ogDescription = '基于编译，剑走偏锋的微前端方案'

const base = process.env.NODE_ENV === 'production' ? '/merak/' : ''

export default defineConfig({
  title: '天璇',
  description: ogDescription,
  base,
  head: [
    ['link', { rel: 'icon', href: `${base}merak.png` }],

  ],

  // vue: {
  //   reactivityTransform: true,
  // },
  lastUpdated: true,
  themeConfig: {
    logo: '/merak.png',
    editLink: {
      pattern: 'https://github.com/fgsreally/merak/tree/master/docs/:path',
      text: '编辑本页',
    },
    lastUpdatedText: '最近更新时间',
    socialLinks: [{ icon: 'github', link: 'https://github.com/fgsreally/merak' }],

    footer: {
      message: 'Released the MIT License.',
    },

    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      {
        text: 'API',
        link: '/api/main',
        activeMatch: '/api/',
      },
      { text: '常见问题', link: '/question/', activeMatch: '/question/' },
      { text: '博客', link: '/blog/start', activeMatch: '/blog/' },

    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          collapsible: true,
          items: [
            {
              text: '介绍',
              link: '/guide/',
            },

            {
              text: '快速上手',
              link: '/guide/quick-start',
            },
          ],
        },

        {
          text: '指南',
          collapsible: true,
          items: [

            {
              text: '基础功能',
              link: '/guide/base',
            },
            {
              text: '生命周期',
              link: '/guide/lifecycle',
            },
            {
              text: '销毁',
              link: '/guide/deactive',
            },
            {
              text: '特殊模式',
              link: '/guide/mode',
            },
            {
              text: '加载器',
              link: '/guide/loader',
            },
            {
              text: '性能',
              link: '/guide/perf',
            },
            {
              text: 'Vue',
              link: '/guide/vue',
            },
            {
              text: 'React',
              link: '/guide/react',
            },
            {
              text: '依赖与嵌套',
              link: '/guide/nest',
            },
            {
              text: '隔离变量',
              link: '/guide/var',
            },
            {
              text: '热更新',
              link: '/guide/hmr',
            },
          ],
        },

        {
          text: '改造',
          collapsible: false,
          items: [
            {
              text: '改造须知',
              link: '/guide/reform/index',
            },
            {
              text: '继承',
              link: '/guide/reform/extend',
            },
            {
              text: '沙箱改造',
              link: '/guide/reform/proxy',
            },

          ],
        },
      ],
      '/api/': [
        {
          text: '主应用',
          collapsible: true,
          items: [
            {
              text: 'Merak',
              link: '/api/main',
            },

            {
              text: '生命周期',
              link: '/api/lifecycle',
            },

            {
              text: 'vue',
              link: '/api/vue',
            },
          ],
        },
        {
          text: '子应用',
          collapsible: true,
          items: [
            {
              text: 'helper',
              link: '/api/helper',
            },
            {
              text: 'vite',
              link: '/api/vite',
            },
            {
              text: 'webpack',
              link: '/api/webpack',
            },
            {
              text: 'cli',
              link: '/api/cli',
            },
            {
              text: 'esbuild',
              link: '/api/esbuild',
            },
          ],
        },
      ],
      '/question': [],
      '/blog/': [
        {
          text: '记录',
          collapsible: false,
          items: [
            {
              text: '开始之前',
              link: '/blog/start',
            },
            {
              text: '问题来源',
              link: '/blog/question-from',
            },
            {
              text: '目标',
              link: '/blog/goal',
            },
            {
              text: '核心',
              link: '/blog/core',
            },
            {
              text: '比较',
              link: '/blog/compare',
            },
            {
              text: '歧义性',
              link: '/blog/action',
            },
            {
              text: '延申',
              link: '/blog/genre',
            },
          ],
        },
      ],
    },
  },
})
