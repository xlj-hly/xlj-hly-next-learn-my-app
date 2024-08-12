// 声明了一个名为 Dashboard 的函数，并使用 export default 将其导出。
// 这意味着 Dashboard 函数是该模块的默认导出，可以在其他文件中导入并使用
export default function Dashboard() {
    // 此函数返回一个包含标题“Hello”的简单页面
    // JSX 语法（一种在 JavaScript 中写 HTML 的方式）来构建一个简单的页面结构
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}