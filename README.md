#### 网格系统
　现实生产管理场景中需要一定的空间区域进行严格管理．要求知道这个空间内发什么时间什么地点什么人什么物发生了什么事等信息．网格系统是使用信息技手段实特区域或空间进行信息化管理，以提高信息管理决策．

#### 概念说明

##### 网格

网格是对现实中指定空间或区域的抽像描述，是网格信息管理系统所处理的信息抽象对象．系统中其他核心概念都是把管理区域网格化之后随之延伸产生的概念．

##### 网格的特征描术

网格是管空间的信息化管理描述，所以网格的特征描述也是对应管理空间的抽象描述．首先管理的网格（在不指明的条件下下文指定出现的网络等价于现实中要管理的空间区域)要有边界，网格可以被可视化被系统用户可以感知区分不同的网格．网格管理主要是对网格内的人，事（消息事件），物(设备)进行管理．所以系统也要能提供网格内人，事，物的可视化表征描述．

网络的静态可视化描术在系统设计中称为网格场景图.网格场景图可以用2D或3D技术来实现可视化.目前只实现2D网格场景图．

##### 静态场景图,动态场景图
网格的静态场景图是指，在网络区域内没有产生信息流时的状态表示．相对的有网格的动态场景图是指，在实间轴上用户可以可视化的区分感知网络内部对消息事件的动态表示（网格的静态场景图，动态态场景图技术上怎么实现？）

###### 静态场景图的数据结构：

场景图的可视化数据结构采用svg标准作为基础。为了对场景中的网格进行定义需要在svg基础之上进行进一步开发。首先要解决的时怎么作svg来表示一个场景信息？

全场景图以45度角来展空间区域上的建筑，道路，设备等事物的相对位置关系。这些事物（网格对象实体）使用svg数据标中的图形元素来表示。对于静态事件可以用多个图无组件组成一与个分组(对应svg中的组)，表示空间区域网格内发生事件提示进，可以地svg中相应的图形元素进行改变填充色fill属性来实现。

图形元素内部包括组标签的属性数据如：id等均可做为网格对象的属性信息。提取这个些信息前端可以通过svg的api进行操作。前一端分离了之后上传数据前端先解析再提交。提交后的网格场景要展示就得结合后端数据库，实时数据等与前端进行交互。如：后端响应到了智能设备的的实时消息数据之后，要以设备id，场景id等推送给相应的前端场景。这本过程还要求对svg做一直规范的构建要求。如：同实例对象(同一个网格)的设备。

 SVG文档的元素基本可以分为以下几类：

- 动画元素：animate, animateColor, animateMotion, animateTransform, set；可以用来作时序动画
- 解释元素：desc, metadata, title；
- 图形元素：circle, ellipse, line, path, polygon, polyline, rect；
- 结构元素：defs, g, svg, symbol, use；
- 渐变元素：linearGradient, radialGradient；
- 其他元素：a,altGlyphDef,clipPath,color-profile,cursor,filter,font,font-face,foreignObject,image,marker,mask,pattern,script,style,switch,text,view等。

​      其中图形元素，渐变元素，文本，图像元素和组合等都介绍过了，下面介绍另外几个与结构相关的元素。

**svg元素**

​      可以在svg元素中以任何顺序放置任何的其他元素，包括嵌套svg元素。
      svg元素支持的属性常用的也就是id,class,x,y,width,height,viewBox,preserveAspectRatio,以及fill和stroke的相关属性。
       svg元素支持的事件也是常用的onload, onmouseover, onmousemove, onmousedown,  onmouseup, onclick, onfocusin, onfocusout, onresize, onscroll,  onunload等。

**定义 - defs元素**        

SVG允许定义一组对象，然后**重用**这组对象(注意，不仅仅是图形对象)。最常见的例子如定义渐变色，然后再其他的图形对象中赋给fill属性。渐变色定义的时候是不会渲染的，所以这类型的对象可以放到任何地方。重用对于图形对象中也是经常存在的，而且我们也不希望定义的时候直接渲染，而是想在引用的地方渲染，这个可以用defs元素实现。

通常情况下，推荐的做法是：只要有可能，就把被引用的对象放到defs元素中。这些对象通常是：
- altGlyphDef,
- clipPath:裁剪路径元素
- cursor,
- filter:
- marker：标记元素，对多个顶点元素的顶点进行标记
- mask：
- pattern：颜色渲染模式
- linearGradient：线性渐变
- radialGradient：圆形渐变
- symbol：由多个图形组成的模板
- 图形对象等。

把这些对象定义在defs元素中很容易理解，所以就提高了可访问性。
  其实作为容器对象的g元素、symbol元素、defs元素都不同程度上提供了重用的作用，只不过每个元素的特性可能少有不同：比如:
- g元素是直接渲染的
- symbol和defs不会直接渲染，symbol含有viewBox属性，会创建新的视窗。
- defs使用时通常都会给在defs中定义的元素赋予id属性，并在用到的地方直接使用。

根据元素的不同，这些定义可以用到不同地方，比如下面的渐进色作为属性来使用了：
```svg
<svg width="8cm" height="25cm" xmlns="http://www.w3.org/2000/svg" version="1.1"
	xmlns:xlink="http://www.w3.org/1999/xlink">
  <desc>定义和引用URI'defs'中的元素.</desc>
  <defs>
    <linearGradient id="Gradient01">
      <stop offset="20%" stop-color="#39F" />
      <stop offset="90%" stop-color="#F3F" />
    </linearGradient>
	<rect id="MyRect" width="60" height="100"/>
  </defs>
  <rect x="1cm" y="1cm" width="6cm" height="1cm" fill="url(#Gradient01)" />
  <circle cx="160" cy="150" r="50" fill="url(#Gradient01)" />
  <!-- xlink要在svg中定义:xmlns:xlink -->
  <use x="20" y="200" xlink:href="#MyRect" fill="url(#Gradient01)" />
</svg>
```


**组合 - g元素**      

g元素是一种容器，它组合一组相关的图形元素成为一个整体；这样，我们就可以对这个整体进行操作。这个元素通常可以和desc和title元素配合使用，提供文档的结构信息。

 

- g元素是可以嵌套的。 

- 组合起来的图形元素就和单个的元素一样，可以给id值，这样，需要的时候(例如动画和重用一组元素)只用引用这个id值就可以了。 

- 组合一组图形元素可以统一设置这组元素的相关属性(fill,stroke,transform等)，这也是使用组合的一种场景。  

**模板 - symbol元素**

symbol元素用于定义图形模板(模板可以包含很多图形)，这个模板可以被use元素实例化。模板的功能与g元素很相似，都是提供一组图形对象，但是也有一些区别。与g元素不同的地方是：
- symbol元素本身是不会被渲染的，只有symbol模板的实例会被渲染。 
- symbol元素可以拥有属性viewBox和preserveAspectRatio，这些允许symbol缩放图形元素。

从渲染角度来说，与symbol元素相似的元素是marker(定义箭头和标号)和pattern(定义颜色渲染模式)元素；这些元素不会直接被渲染；他们的使用方式基本都是由use元素去实例化。正是这个原因，对于symbol来说，'display'属性是没有意义的。
下面这个修改过的代码显示了symbol的使用方式： 
```svg
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     version="1.1" width="5cm" height="5cm">
  <desc>分别用symbol和g元素分组，每组各有两个矩形</desc>
  <symbol id="group1" fill="red">
    <rect x="1cm" y="1cm" width="1cm" height="1cm"/>
    <rect x="3cm" y="1cm" width="1cm" height="1cm"/>
  </symbol>
  <g id="group2" fill="blue">
    <rect x="1cm" y="3cm" width="1cm" height="1cm"/>
    <rect x="3cm" y="3cm" width="1cm" height="1cm"/>
  </g>
  <use xlink:href="#group1" target="_blank" rel="nofollow" />

  <!-- 外连框矩形 -->
  <rect x=".02cm" y=".02cm" width="4.96cm" height="4.96cm"
        fill="none" stroke="blue" stroke-width=".02cm"/>
</svg>
```

**引用 - use元素**     

 任何svg, symbol, g, 单个的图形元素和use元素本质上都可以作为模板对象被use元素引用(例如初始化)。use引用的图形内容会在指定的位置渲染。与image元素不同，use元素不能引用整个文档。

use元素也有x, y, width和height属性，这些属性可以省略，如果不省略的话，会将被引用的图形内容坐标或长度映射到当前的用户坐标空间来。

 use元素的作用过程就相当于把被引用的对象深拷贝一份到独立的非公开的DOM树中；这棵树的父节点是use元素。虽然是非公开的DOM节点，但是本质上还是DOM节点，所以被引用对象的所有属性值、动画、事件、CSS的相关设置等都会拷贝多来并都还是会起作用，而且这些节点也会继承use元素和use祖先的相关属性(注意引用元素是深拷贝，这些拷贝过来的元素与原来的元素已经无关系了，所以这里不会继承被引用元素祖先节点的属性)，如果这些节点本身有相关(CSS)属性，还会覆盖继承来的属性，这些与普通的DOM节点是一致的，所以对use元素使用"visibility:hidden"时要小心，并不一定会起作用。但是由于这部分节点是非公开的，在DOM操作中，也只能看到use元素，所以也只能操作到use元素。

 从视觉效果来看，use元素更像是占位符，渲染完成后的视觉效果就和直接用被引用对象渲染是一样的：
- use元素引用一个symbol元素       
 这种情况下，视觉效果就相当于： 
 (1) 把use元素换成g元素； 
 (2) 把use的除x,y,width,height,xlink:href外的属性全部移到g元素； 
 (3) 把use的x,y属性变成translate(x,y)，追加到g元素的transform属性最后； 
 (4) 把引用的symbol元素换成svg元素，这个svg元素会显式使用use元素的width和height属性(use元素没有这些属性则是100%)； 
 (5) 把引用的symbol元素的图形内容深拷贝到替换的svg中。 
- use元素引用一个svg元素
  这种情况下，视觉效果就相当于： 
  (1) 把use元素换成g元素； 
  (2) 把use的除x,y,width,height,xlink:href外的属性全部移到g元素； 
  (3) 把use的x,y属性变成translate(x,y)，追加到g元素的transform属性最后； 
  (4) 把引用的svg元素包括内容拷贝过来，这个svg元素会显式使用use元素的width和height属性(use元素没有这些属性则使用原来的值)； 
- 其他情况
  这些情况下的视觉效果就相当于： 
  (1) 把use元素换成g元素； 
  (2) 把use的除x,y,width,height,xlink:href外的属性全部移到g元素； 
  (3) 把use的x,y属性变成translate(x,y)，追加到g元素的transform属性最后； 
  (4) 把引用元素拷贝过来；
  
  看下面例子的视觉效果： 
```svg
<svg width="10cm" height="3cm" viewBox="0 0 100 30" version="1.1"
     xmlns="http://www.w3.org/2000/svg" 
	 xmlns:xlink="http://www.w3.org/1999/xlink">
  <desc>'use'带表平移变换'transform'属性</desc>
  <defs>
    <rect id="MyRect" x="0" y="0" width="60" height="10"/>
  </defs>
  <rect x=".1" y=".1" width="99.8" height="29.8"　fill="none" stroke="blue" stroke-width=".2" />
  <use xlink:href="#MyRect"　transform="translate(20,2.5) rotate(10)" />
</svg>
```
**解释性元素 - desc元素与title元素**      

每个容器元素(可以包含其他容器元素或者图形元素的元素，例如：a,defs,glyph,g,marker,mask,missing-glyph,pattern,svg,switch和symbol)和图形元素都可以包含desc和title元素，这两个元素都是辅助性的元素，用于解释相关情境；它们的内容都是文本。当SVG文档被渲染的时候，这2个元素不会被渲染到图形中。这个2个元素之间差别不是太大，title在有些实现中是作为提示信息出现的，所以通常title是放到父元素的第一个位置上。 

desc和title元素元素可以作为辅助用来描述网格信息。

**标记 - marker元素**      

标记定义了附加到一个或者多个顶点(path,line,polyline或者polygon的顶点)上的图形元素(箭头和多点标记)。箭头可以通过把一个标记附加到path,line或者polyline的起点或者终点上。多点标记可以把一个标记附加到path,line,polyline或者polygon的所有顶点上。       标记是由marker元素定义的，然后在path,line,polyline或者polygon中设置相关的属性(marker,marker-start,marker-mid,和marker-end)就可以了。看个例子：

```svg
<svg width="4in" height="2in" 
     viewBox="0 0 4000 2000" version="1.1"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="Triangle"
      viewBox="0 0 10 10" refX="0" refY="5" 
      markerUnits="strokeWidth"
      markerWidth="4" markerHeight="3"
      orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  </defs>
  <desc>将箭头放在路径path元素的末端.</desc>
  <path d="M 1000 750 L 2000 750 L 2500 1250"
        fill="none" stroke="black" stroke-width="100" 
        marker-end="url(#Triangle)"  />
</svg>
```

-  marker是容器元素，可以存放任意顺序的图形元素，容器元素，动画，渐变元素等。 

-   marker元素可以创建新的视窗：设置viewBox的值。 

-   marker比较重要的属性：   

   **markerUnits = "strokeWidth | userSpaceOnUse"**      

   这个属性定义了属性markerWidth,markerHeight和marker的内容使用的坐标系统。这个属性有2个值可选，第一个值strokeWidth是默认值，代表属性markerWidth,markerHeight和marker的内容使用的坐标系统的单位等于引用该marker的图形元素的stroke-width设置的值。

          例如上面的例子中，marker元素的width是400,height是300，不过千万不要混淆了，mark元素中的path使用的坐标是viewBox设置的新的用户坐标系。

          该属性另外一个取值userSpaceOnUse，代表属性markerWidth,markerHeight和marker的内容使用引用该marker的图形元素的坐标系统。

    **refX,refY**：

   定义了引用的点与marker对齐的位置坐标。例如上面的例子中，引用的点是终点，要把它对齐到marker的(0,5)位置。注意refX,refY使用的是经过viewBox变换过的最终用户坐标系。   **markerWidth,markerHeight**：

   marker视窗的宽和高，这个很好理解。

      **orient**：

   定义了marker旋转的角度。可以指定一个角度或者直接赋值auto。

      auto代表x轴正方向按照下列规则旋转：

      a. 如果marker所在的点只属于一个path，则marker的x轴正向与path走向相同。参看上面例子。

      b. 如果marker所在的点属于两个不同的path，则marker的x轴正向与两个path的夹角的角等分线走向一致。

-  图形元素的marker属性
	图形元素要引用一个marker则需要使用相关的属性，主要是这3个：marker-start(把引用的marker放到起点),  marker-mid(把引用的marker放到除起点和终点外的所有点),  marker-end(把引用的marker放到终点)。这3个属性的取值可能是none(代表不引用marker),marker的引用(引用某marker)，inherit()。 

**脚本与样式 - script元素与style元素**      

​    基本上所有的属性(对于所有元素，不仅是文本)都可以用CSS与一个元素关联，并且所有CSS属性都在SVG图像中可用。可以直接用样式属性设计元素的样式，或者引用样式表设计元素的样式。对XML文件来说不应该解析样式表(因为它们偶尔包含会引起问题的字符)，因此需要将它们置于XML CDATA节点。脚本也是同样的道理，需要放到XML CDATA节点中。
	在xml中CDATA内部的所有内容都会被解析器忽略。如果文本包含了很多的"<"字符和"&"字符——就象程序代码一样，那么最好把他们都放到CDATA部件中。一个 CDATA 部件以"<![CDATA[" 标记开始，以"]]>"标记结束
**自带CSS例子**  

```svg
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">   
  <desc>Text</desc>
  <defs>
    <style type="text/css">      
      <![CDATA[      
        .abbreviation { text-decoration: underline; }      
      ]]>                     
    </style> 
  </defs>   
  <g>      
    <text x="20" y="50" font-size="30">Colors can be specified</text>     
    <text x="20" y="100" font-size="30">by their        
      <tspan fill="rgb(255,0,0)" class="abbreviation">R</tspan>        
      <tspan fill="rgb(0,255,0)" class="abbreviation">G</tspan>        
      <tspan fill="rgb(0,0,255)" class="abbreviation">B</tspan>     values</text>     
    <text x="20" y="150" font-size="30">or by keywords such as</text>     
    <text x="20" y="200">        
       <tspan style="fill: lightsteelblue; font-size:30">lightsteelblue</tspan>,     
    </text>
  </g>
</svg>
```

**自带脚本的例子**
```svg
<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
 <desc>图形元素点击后执行脚本</desc>
 <defs>
    <script type="text/ecmascript"> 
    <![CDATA[
      function hideReveal(evt) {
        var imageTarget = evt.target;
        var theFill = imageTarget.getAttribute("fill");
        if (theFill == 'red')
          imageTarget.setAttribute("fill", "url(#notes)");
        else
          imageTarget.setAttribute("fill", "red");
      }
    ]]> 
    </script>  
    <pattern id="notes" x="0" y="0" width="50" height="75" patternTransform="rotate(15)" patternUnits="userSpaceOnUse">
         <ellipse cx="10" cy="30" rx="10" ry="5"/>
         <line x1="20" y1="30" x2="20" y2="0" stroke-width="3" stroke="black"/>
         <line x1="20" y1="0" x2="30" y2="5" stroke-width="3" stroke="black"/>
     </pattern>
   </defs>
 <desc>图形元素事件绑定</desc>
 <ellipse onclick="hideReveal(evt)" cx="175" cy="100" rx="125" ry="60" fill="url(#notes)" stroke="black" stroke-width="5"/>
</svg>
```

**条件处理 - switch元素**      

条件处理属性是能控制所在元素渲染与否的属性。基本上大多数的元素(特别是图形元素)都可以指定条件处理属性。条件处理属性有3个：
- requiredFeatures
- requiredExtensions
- systemLanguage  

这些属性就是一组测试，都允许指定一个值列表(前面两个属性是空格隔开的，systemLanguage这个属性是使用逗号隔开的)，默认值都为true。

       SVG的switch元素提供了按指定条件渲染的能力。switch元素是一个容器元素，可以包含图形元素，解释性元素，动画元素，a,  foreignObject,g,image,svg,switch,text,use等元素。switch元素会按顺序检查直接子元素的条件处理属性，然后渲染满足自身条件的的第一个子元素，其他的子元素都会被忽略。这些属性与display属性一样，只会影响直接使用这些属性的元素的渲染，不会影响引用的元素(比如use引用的元素)。简单的说，这3个属性会影响a, altGlyph, foreignObject, textPath, tref, tspan ,animate, animateColor,  animateMotion, animateTransform, set等元素，不会影响defs,cursor, mask, clipPath, pattern等元素(这些元素那么不是可渲染的，要么就是引用别的元素)。
       注意：子元素的display和visibility属性值并不影响switch元素条件判断的结果。
```svg
<svg xmlns="http://www.w3.org/2000/svg"
     version="1.1" width="50cm" height="50cm">
  <switch> 
    <text x='10' y='20' systemLanguage="de">de - HAHA</text> 
    <text x='10' y='20' systemLanguage="en">en - haha</text> 
  </switch> 
    <desc>使用的浏览器支持filter特性，那么就绘制矩形(带filter属性)，如果不支持filter特性，就绘制下面的矩形.</desc>  
    <rect requiredFeatures= "http://www.w3.org/TR/SVG11/feature#Filter "   
         x= "10 " y= "30 " width= "32 " height= "50 " opacity= "0.6 " 
         fill= "black " stroke= "red " filter= "url(#gblurshadow) "   /> 
    <rect x= "10 " y= "30 " width= "32 " height= "50 " opacity= "0.6 "
         fill= "red " stroke= "forestgreen" /> 
</svg>
</svg>
```

**动画**

 使用SVG的动画元素 
```svg
<svg width="8cm" height="3cm"  viewBox="0 0 800 300"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <desc>基本动画元素</desc>
  <rect x="1" y="1" width="798" height="298" 
        fill="none" stroke="blue" stroke-width="2" />
  <!-- 矩形位置和大小的动画 -->
  <rect id="RectElement" x="300" y="100" width="300" height="100"　fill="rgb(205,155,50)"  >
    <animate attributeName="x" attributeType="XML"　begin="0s" dur="9s" fill="freeze" from="300" to="0" />
    <animate attributeName="y" attributeType="XML"　begin="0s" dur="9s" fill="freeze" from="100" to="0" />
    <animate attributeName="width" attributeType="XML"　begin="0s" dur="9s" fill="freeze" from="300" to="800" />
    <animate attributeName="height" attributeType="XML"　begin="0s" dur="9s" fill="freeze" from="100" to="300" />
  </rect>
  <!-- 创建新的用户坐标空间，所以text是从新的(0,0)开始，后续的变换都是针对新坐标系的 -->
  <g transform="translate(100,100)" >
    <!-- 下面使用了set去动画visibility，然后使用animateMotion, animate和animateTransform执行其他类型的动画 -->
    <text id="TextElement" x="0" y="0"　font-family="Verdana" font-size="35.27" visibility="hidden"  > 
      It's alive!
      <set attributeName="visibility" attributeType="CSS" to="visible" begin="3s" dur="6s" fill="freeze" />
      <animateMotion path="M 0 0 L 100 100" begin="3s" dur="6s" fill="freeze" />
      <animate attributeName="fill" attributeType="CSS" from="rgb(0,0,255)" to="rgb(128,0,0)" begin="3s" dur="6s" fill="freeze" />
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="-30" to="0" begin="3s" dur="6s" fill="freeze" />
      <animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="3" additive="sum" begin="3s" dur="6s" fill="freeze" />
    </text>
  </g>
</svg>
```
**动画元素的属性**
- attributeName = "<attributeName>"
  这个属性指定了应用动画的属性。如果该属性有namespace的话(不要忘了，SVG本质是XML文档)，这个namespace也要加上

- attributeType = "CSS | XML | auto(默认值)"   
  这个属性指定了属性取值的命名空间，这几个值的含义如下： 
  CSS：代表attributeName指定的属性是CSS属性。 
  XML：代表attributeName指定的属性是XML默认命名空间下的属性(注意svg文档本质上是xml文档)。 
  auto：代表先在CSS属性中查找attributeName指定的属性，如果没找到，则在默认的XML命名空间下寻找该属性。

  **控制动画时间的属性**      
  下列属性都是动画时间属性；它们控制了动画执行的时间线，包括如何开始和结束动画，是否重复执行动画，是否保存动画的结束状态等。

- begin = "begin-value-list"  
  该属性定义了动画的开始时间。可以是分号分开的一系列时间值。也可以是一些其他触发动画开始的值。比如事件，快捷键等。

- dur = Clock-value | "media" | "indefinite"
  定义了动画的持续时间。可以设置为以时钟格式显示的值。也可以设置为下列两个值：
  media：指定动画的时间为内部多媒体元素的持续时间。
  indefinite：指定动画时间为无限。

- end = "end-value-list"
  定义了动画的结束时间。可以是分号分开的一系列值。 

- min = Clock-value | "media"  max = Clock-value | "media"
  设置了动画持续时间的最大最小值。

- restart = "always" | "whenNotActive" | "never"
  设置了动画能否随时重新开始。always代表动画可以随时开始。whenNotActive代表只能在没播放的时候重新开始，比如前一次播放结束了。never表示动画不能重新开始。

- repeatCount = numeric value | "indefinite
  设置了动画重复的次数。 indefinite代表无限重复。

- repeatDur = Clock-value | "indefinite"
  设置重复的总的动画时间。indefinite代表无限重复。

- fill = "freeze" | "remove(默认值)"
  设置了动画结束后元素的状态。freeze表示动画结束后元素停留在动画的最后状态。remove代表动画结束以后元素回到动画前的状态，这个是默认值。 

  **定义动画值的属性**
  这些属性定义了被执行动画的属性的取值情况。其实是定义了关键帧和插值的一些算法。
- calcMode = "discrete | linear(默认值) | paced | spline"*
  定义了动画插值的方式：
  discrete:离散的，不插值；
  linear：线性插值；
  paced：步长插值；
  spline:样条插值。默认是linear(线性插值)，但是如果属性不支持线性插值，则会采用discrete插值方式。
- values = "<list>"
  定义了以分号分隔的动画关键帧的值列表。支持向量值。
- keyTimes = "<list>"
  定义了以分号分隔的动画关键帧的时间列表。这个和values是一一对应的。这个值是受插值算法影响的，如果是线性(linear)和样条插值(spline)，则keyTimes的第一个值必须是0，最后一个值必须是1。对于离散(discrete)的不插值的方式，keyTimes的第一个值必须是0。对于步长插值方式，很显然是不需要keyTimes。而且如果动画的持续时间设置为indefinite，则忽略keyTimes。
- keySplines = "<list>"
  这个属性定义了样条插值(贝塞尔插值)时的控制点，显然只有在插值模式选择为spline才起作用。这个列表中的值取值范围是0到1。
- from = "<value>" to = "<value>" by = "<value>"
  定义动画属性的起始值，结束值和步长值。这里需要注意：如果values已经制定了相关的值，则任何的from/to/by值都会被忽略。 
  **控制动画是否是增量式的属性**
  有时候，如果相关的值设置的不是绝对值，而是增量值是非常有用的，使用additive属性可以达到这个目的。
- additive = "replace(默认值) | sum"
  这个属性控制了动画是否是增量式的。sum表示动画会较大相关的属性值或者其他低优先级的动画上。replace是默认值，表示动画会覆盖相关的属性值或者其他低优先级的动画。
  演示了矩形width和height递增的动画效果例子：
```svg
<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="800" height="300"  viewBox="0 0 800 300">
  <title>Demonstration of the resolution of namespaces for animation</title>
  <rect x="10" y="10" height="29.8" fill="red" stroke="blue" stroke-width="1.2">
	<animate attributeName="width" from="0" to="100" dur="10s" additive="sum"/>
	<animate attributeName="height" from="0" to="30" dur="10s" additive="sum" accumulate="sum" repeatCount="5"/>
  </rect>
</svg>
```
 有时候，如果重复的动画结果是叠加起来的，也非常有用，使用accumulate属性可以达到这个目的。
- accumulate = "none(默认值) | sum"
  这个属性控制了动画效果是否是累积的。none是默认值，表示重复的动画不累积。sum表示重复的动画效果是累积的。对于单次执行的动画，该属性没有意义。

  SVG提供了下列动画元素： 
- animate元素
  这个是最基本的动画元素，可以直接为相关属性提供不同时间点的值。 
- set元素
  这个是animate元素的简写形式，支持所有的属性类型，尤其是当对非数字型的属性(例如visibility)进行动画时很方便。set元素是非增量的，相关的属性对之无效。 to指定的动画结束值类型一定要符合属性的取值类型。
- animateMotion元素 
  路劲动画元素。这个元素大多数属性都和上面一样，只有下面几个稍微有点区别：
  - calcMode = "discrete | linear | paced | spline"
    这个属性的默认值不同，在该元素中默认的是paced。  
  - path = "<path-data>"
    动画元素移动的路径，格式与path元素的d属性的值的格式是一致的。
  - keyPoints = "<list-of-numbers>"
    这个属性的值是一系列分号给开的浮点数值，每个值的取值范围是0~1。这些值代表了keyTimes属性指定的对应时间点移动的距离，这里距离具体是多少是由浏览器自己决定的。
  - rotate = <number> | auto | auto-reverse"
    这个属性指定了元素移动时旋转的角度。默认值是0，数字代表旋转的角度，auto表示随着路劲的方向转动物体。auto-reverse表示转向与移动方向相反的方向。

  此外animateMotion元素的from,by,to,values的值都是坐标对组成的；x值与y值之间用逗号或空格分开，每个坐标对之间用分号隔开比如from="33,15"表示起点x坐标为33，y坐标为15。 指定运动路径的方式有两种：一种为直接给path属性赋值，一种为使用mpath元素作为animateMotionde的子元素指定路径。如果同时使用这两种方式，则使用mpath元素优先级高。这两种方式优先级都比values,from,by,to高。 
```svg
<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="800" height="300"  viewBox="0 0 800 300">
  <title>Demonstration of the resolution of namespaces for animation</title>
  <path id="path1" d="M100,250 C 100,50 400,50 400,250" fill="none" stroke="blue" stroke-width="7.06" />
  <path d="M0,12.5 L25,12.5 L 0,87.5 z" fill="yellow" stroke="red" stroke-width="7.06" >
	<animateMotion dur="6s" repeatCount="indefinite" rotate="auto" >
       <mpath xlink:href="#path1"/>
    </animateMotion>
  </path>
  <path d="M-25,-12.5 L25,-12.5 L 0,-87.5 z" fill="red" stroke="deepskyblue" stroke-width="7.06" >
	<animateMotion dur="6s" repeatCount="indefinite" rotate="auto" >
       <mpath xlink:href="#path1"/>
    </animateMotion>
  </path>
  <rect x="10" y="150" height="29.8" fill="red" stroke="blue" stroke-width="1.2">
	<animate attributeName="width" from="0" to="100" dur="10s" additive="sum"/>
	<animate attributeName="height" from="0" to="30" dur="10s" additive="sum" accumulate="sum" repeatCount="5"/>
  </rect>
</svg>
```

- animateTransform元素
  变换动画元素。看看特殊的一些属性:
  - type = "translate | scale | rotate | skewX | skewY"
    这个属性指定了变换的类型，translate是默认值。
	from,by和to的值相应的都是对应变换的参数，这个还是与前面讲的变换是一致的。values则是一组分号隔开的这样的值系列。 

**支持动画效果的元素和属性**
   基本上所有图形元素(path,rect,ellipse,text,image...)，
   容器元素(svg, g, defs, use, switch, clipPath, mask...)
   都支持动画。基本上大多数的属性都支持动画效果。

##### 网格内的人

##### 网格内的物

##### 网格内的消息事件

消息：指当网络内发生了某一事件时，被网格内的实体感应得到，然后对系统进行交互，使得系统被感知．

事件用多种多样，还要看是从什么样的的角度来对事网格内的事件进行为类定义．

从事件的感应和处理实体来看，可以分为：

人(网格内的实体是人) 感应(如看到了某一件事，听到某一件事)，这个实体(人)可以通过系统相应的界面报告这个事件．

设备（网格内的实体是某一信息处理设备）感应得到了某一物理，化学，生物等信息发生改变（事件源使设备的属性发生改变）从而设备通过网络通讯技术与系统进行交互

从消息发生源来分：

人与人之间发生事件，人与环境如位置的改变等位置事件，人与物之前发生事件如：人操作某设备


#### 事件的特征

事件有时序性，也就是说在时间上是有先后的，为了更好的处理这种特征方便后面对事件的分析检索回放等，事件的信息保存可以考虑用时序数据来进行存储

事件的空间性，事件的发生必然有其发生的空间位置，这个空间位置可以是网格内的，也可以是网格外的．

事件的被感知性，事件发生必要有感知实体感应得到并把事件信息交由系统进行处理，感知事件的实体有人，有物，但只有能与系统进行交互的感知实体才能报告给系统（与系统进行信息的交互）系统才能感知得到