## 基础设施

* http请求工具 `request`, [superagent](https://github.com/visionmedia/superagent)

* 解析工具 [cheerio](https://github.com/cheeriojs/cheerio)

## 使用说明

1. 在`case`目录下新建一个案件`Test`，继承于`Case`，并实现`interrogate`与`criminate`方法。
2. 在`chessboard`中构造一个`test`实例，使用`test.gather()`搜集需要爬取的网站地址
3. 使用`test.start()`启动
4. 使用 `test.onerror = (error)=>{}` 监听错误
5. 使用 `test.onend = ()=>{}` 监听结束

## 类

#### 案件： Case

###### 构造器

*   name 案件名称
*   opts 案件设置
    -   opts.domain 公共domain
    -   opts.sleepTime 对每个情报执行时间间隔，默认0
    -   opts.force 在发生错误时是否忽略错误强制执行下面情报，默认false
    
###### 属性

*   name 案件名称
*   intelligences 待执行的情报
*   police 情报执行者
*   domain 公共domain
*   sleepTime 对每个情报执行时间间隔，默认
*   force 在发生错误时是否忽略错误强制执行下面情报，默认fals

###### 方法

*   gather(Intelligence intell) 情报搜集
*   virtual interrogate(String culprit) 数据清洗 
*   virtual criminate(Object evidence) 数据处理 
*   onerror(Error err) 错误
*   onend() 结束

#### 执行器 Police

###### 构造器

*   case 需要执行的案件实例

###### 属性

*   case 需要执行的案件实例
*   slammer 数据结果集合

###### 方法

*   collar() 根据情报进行抓取

#### 情报 Intelligence

###### 构造器

*   opts 配置
    -   opts.domain
    -   opts.path
    -   opts.url path 与 url 必须存在一个

###### 属性

*   domain 
*   path
*   url 如果为null 则由domain与path自动构建url
