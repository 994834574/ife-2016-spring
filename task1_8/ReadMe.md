
## 第一阶段任务八

#### 										by BetaLucky(tanhanjay)	

### 任务目的

​	使用 HTML 与 CSS 实现类似 BootStrap 的响应式 12 栏网格布局，根据屏幕宽度，元素占的栏数不同。

### 任务描述

​	需要实现如 效果图 所示，调整浏览器宽度查看响应式效果，效果图中的红色的文字是说明，不需要写在 HTML 中。

### 实现思路

通过css实现

​	利用CSS的媒体类型(@media)实现根据不同浏览器宽度做出响应

做的事情	

​	利用@media规定了类 col-md-x(col-sm-x)的样式：

1. 当min-width>=768px时应用col-md-x的样式

2. 当max-width<=766px时应用col-sm-x的样式

3. 通过test.html测试达到了任务中的效果

   ​

### 坑

第一次做完发现当第一行应该有3个class都为col-md-4的div，而实际却只有2个，最后一个挤到下面去了。后来发现，原来width的宽度不包含border,margin和padding，实际的宽度=width+border+margin+padding。而我直接指定[class*="col-"]的元素margin=10px；和border=1px；

所以后来把border和边距的实现放到了含类名“col”的div的里面得以解决。

​	不知道这样做符不符合要求

# 请组内大神过目

# THE END