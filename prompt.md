###### 项目结构

```
my-react-ts-app/
├── dist/                   # Webpack 打包后的生产环境文件
├── node_modules/           # 项目依赖
├── public/                 # 静态资源 (会被直接复制到 dist 目录)
│   ├── index.html          # 应用的 HTML 入口文件
│   ├── favicon.ico         # 网站图标
│   └── manifest.json       # PWA 配置文件
│   └── ...                 # 其他静态文件 (如 robots.txt, 图片等)
├── src/                    # 项目源码
│   ├── @types/             # (可选) 自定义类型声明或第三方库的类型补充
│   │   └── global.d.ts     # 全局类型声明 (例如，声明 CSS Modules, 图片导入等)
│   │   └── some-library.d.ts # 某个没有官方 @types 包的库的声明
│   ├── assets/             # 静态资源 (会被 Webpack 处理，如图片、字体等)
│   │   ├── images/
│   │   ├── fonts/
│   │   └── svgs/
│   ├── components/         # 可复用的 UI 组件 (展示型组件)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.scss  # CSS Modules (或 .css, .less, styled-components)
│   │   │   ├── Button.stories.tsx  # (可选) Storybook 文件
│   │   │   └── Button.test.tsx     # (可选) 单元测试文件
│   │   └── ...
│   ├── constants/          # 应用常量 (如 API 地址、事件名、固定配置等)
│   │   └── index.ts
│   ├── contexts/           # React Context API 相关文件
│   │   └── ThemeContext.tsx
│   ├── features/           # (可选，推荐用于中大型应用) 基于特性的模块组织
│   │   └── User/
│   │       ├── components/     # 此特性独有的组件
│   │       ├── hooks/          # 此特性独有的 Hooks
│   │       ├── services/       # 此特性的 API 请求 (例如 userService.ts)
│   │       ├── slices/         # (如果使用 Redux Toolkit) UserSlice.ts
│   │       ├── types/          # 此特性相关的 TypeScript 类型和接口
│   │       ├── utils/          # 此特性相关的工具函数
│   │       └── index.ts        # 特性模块的入口/导出文件
│   ├── hooks/              # 自定义 React Hooks (全局可复用)
│   │   └── useDebounce.ts
│   ├── layouts/            # 布局组件 (如页面头部、底部、侧边栏等)
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.tsx
│   │   │   └── MainLayout.module.scss
│   ├── pages/              # 页面级组件 (通常与路由对应，可作为容器型组件)
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.module.scss
│   │   ├── AboutPage/
│   │   │   ├── AboutPage.tsx
│   │   │   └── AboutPage.module.scss
│   │   └── ...
│   ├── services/           # API 请求服务 (全局配置或与特性无关的 API)
│   │   ├── apiClient.ts      # API 客户端实例 (如 axios 实例)
│   │   └── authService.ts
│   ├── store/              # 状态管理 (如 Redux, Zustand, Jotai)
│   │   ├── index.ts          # store 的入口和配置
│   │   ├── slices/         # (如果使用 Redux Toolkit)
│   │   │   └── counterSlice.ts
│   │   └── rootReducer.ts    # (如果使用原生 Redux)
│   ├── styles/             # 全局样式、主题、CSS变量等
│   │   ├── _variables.scss   # SCSS 变量、mixins (如果使用 SCSS)
│   │   ├── global.scss       # 全局样式
│   │   └── theme.ts          # 主题对象 (例如用于 styled-components 或 Material-UI)
│   ├── types/              # 全局共享的 TypeScript 类型和接口
│   │   └── index.ts
│   ├── utils/              # 工具函数 (全局可复用)
│   │   └── formatters.ts
│   ├── App.tsx               # 应用主组件 (通常包含路由配置)
│   ├── index.tsx             # 应用入口文件 (将 App 组件渲染到 DOM)
│   ├── reportWebVitals.ts    # (可选) 性能报告 (Create React App 默认包含)
│   └── setupTests.ts       # (可选) 测试环境配置文件 (如 Jest, React Testing Library)
├── webpack/                # (可选) 如果 Webpack 配置复杂，可以拆分到此目录
│   ├── webpack.common.js   # 通用配置
│   ├── webpack.dev.js      # 开发环境配置
│   ├── webpack.prod.js     # 生产环境配置
│   └── paths.js            # (可选) 路径常量
├── .babelrc                # Babel 配置文件 (或 babel.config.js, 或在 package.json 中配置)
├── .editorconfig           # 编辑器配置文件，用于统一代码风格
├── .env                    # (Git 会忽略此文件) 本地环境变量
├── .env.example            # 环境变量示例文件
├── .eslintignore           # ESLint 忽略检查的文件和目录
├── .eslintrc.js            # ESLint 配置文件 (或 .json, .yaml, .cjs)
├── .gitignore              # Git 忽略提交的文件和目录
├── .prettierrc.js          # Prettier 配置文件 (或 .json, .yaml, .toml)
├── jest.config.js          # (如果使用 Jest) Jest 测试框架配置文件
├── package.json            # 项目元数据和依赖管理
├── package-lock.json       # (或 yarn.lock, pnpm-lock.yaml) 依赖版本锁定文件
├── README.md               # 项目说明文档
├── tsconfig.json           # TypeScript 编译器配置文件
└── webpack.config.js       # Webpack 配置文件 (如果未拆分到 webpack/ 目录)
```

##### design

###### Empathize

* 不知道怎么展示自己
  * 性格
  * 爱好
  * 理想
* 背景选什么
  * 颜色
  * 图案
  * 贴纸
* 组件如何设计

###### Define

亲和图

###### Ideate

* profile组件, 展示自己的性格, 爱好, 理想

###### Prototype

###### Test

##### 页面

###### home

* 导航栏

* 自我介绍
  
  狼与香辛料, 绘制香辛料的小故事介绍自己的名字
  
  * 性格
    * 冷淡而真诚
  * 爱好
    * 游泳
    * 音乐
  * 志向
    * 拯救世界

###### about me

###### blog

###### love story

###### friends



#### api

###### get /api/posts

成功响应 200 OK

```json
{
  "success": true,
  "data": [
    {
      "_id": "mongooseObjectId1",
      "title": "文章标题1",
      "slug": "wen-zhang-biao-ti-1",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    {
      "_id": "mongooseObjectId2",
      "title": "文章标题2",
      "slug": "wen-zhang-biao-ti-2",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

错误响应

* 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "message": "服务器发生了一个意外错误。",
  }
}
```



###### get /api/posts/:slug

成功响应 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "mongooseObjectId",
    "title": "文章标题",
    "slug": "wen-zhang-biao-ti",
    "markdownContent": "这是文章的完整 Markdown 内容...",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

错误响应

* `404 Not Found`: 如果具有给定 `id` 或 `slug` 的文章不存在。

  ```json
  {
    "success": false,
    "error": {
      "message": "文章未找到。",
    }
  }
  ```
  
* 500 Internal Server Error

  ```json
  {
    "success": false,
    "error": {
      "message": "服务器发生了一个意外错误。",
    }
  }
  ```



###### post /api/posts(/md)

Request Body

```json
{
  "title": "你的文章标题",
  "markdownContent": "你的文章 Markdown 内容"
}
```

成功响应

状态码: `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "generatedObjectId",
    "title": "你的文章标题",
    "slug": "ni-de-wen-zhang-biao-ti",
    "markdownContent": "你的文章 Markdown 内容",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

错误响应

状态码: 

* 400 Bad Request 如果请求数据不符合要求（例如，`title` 或 `markdownContent` 缺失）。

  ```json
  {
    "success": false,
    "error": {
      "message": "请求数据不符合要求。",
    }
  }
  ```

* 500 Internal Server Error

  ```json
  {
    "success": false,
    "error": {
      "message": "服务器发生了一个意外错误。",
    }
  }
  ```

  

###### post /api/posts/zip

请求体

zip文件

成功响应

状态码: `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "generatedObjectId",
    "title": "你的文章标题",
    "slug": "ni-de-wen-zhang-biao-ti",
    "markdownContent": "你的文章 Markdown 内容",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

