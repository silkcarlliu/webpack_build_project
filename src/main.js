import count from "./js/count";
// import sum from "./js/sum";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";
import "./css/iconfont.css";

const res1 = count(2,1)
console.log(res1)

// const res2 = sum(1, 2, 3, 4, 5)
// console.log(res2)

document.getElementById("btn").onclick = function () {
  // 动态导入 --> 实现按需加载
  // 即使只被引用了一次，也会代码分割
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  // "math"将来就会作为[name]的值显示。
  import(/*webpackChunkName: "math" */ "./js/math.js").then(({ sum }) => {
    alert(sum(1, 2, 3, 4, 5));
  });
};