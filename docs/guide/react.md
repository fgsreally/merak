# react

```tsx
import { MerakApp, MerakImport, MerakScope } from 'merak-react'
function App() {
  return <>
  {/* 应用模式 */}
    <MerakApp name="vite_vue" url="http://localhost:4004"></MerakApp>
    {/* 库模式 */}
    <MerakScope name="scope" fakeGlobalVar="block_scope">
      <Block label="scope"></Block>
    </MerakScope>

    <MerakImport
      name="import"
      fakeGlobalVar="block_import"
      source="http://localhost:5173/src/block.tsx"
      props={{ label: 'import' }}
    ></MerakImport>
  </>
}
```

> `MerakImport`/`MerakScope`是库模式，也就是`js`为入口（远程必须是一个组件！），只不过前者需要输入源`url`,而后者是在插槽中的异步组件

案例可见[example](https://github.com/fgsreally/merak/tree/main/examples/main-react)

参数可见[类型定义](../api/react.md)
