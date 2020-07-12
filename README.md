# vue to uni-app

> 用于公司内部项目的文件转换

把 Vue 组件文件放到 source 文件夹中，输出到 result 文件中转换好的可用在 uni-app 的组件文件

主要转换的方面有如下几个：

- template 标签转换：
  - div/li/ul 标签转换为 view
  - img 转换为 image，添加 mode='widthFix'属性
  - span 转换为 text 标签
  - 内部的 template 标签，转换为 block 标签
  - transition 标签，转换为 uni-transition 标签
- script 标签内部内容不转换
- style 标签内容，暂时只考虑 less
  - 对于 rem 单位，乘以 200 转换为 px 单位
  - 对于 px 单位，乘以 2 保持为 px 单位

转换后还要注意一下几个方面的改写：

1. 如果之前图片是作为 div 的背景图，那在 uni-app 里面是不支持的，需改成 image
2. 动态组件不支持，需改成多重展现判断
3. 如果是页面级别的组件，那生命周期和逻辑都要有针对的调整，可能无法很好的自动化
