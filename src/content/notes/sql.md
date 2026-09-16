视频教程：[B站戴师兄SQL入门与刷题[课程2.0]](https://www.bilibili.com/video/BV1ZM4y1u7uF/?p=6&spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=1b0e3ee9253dd1b843ec4b7c52d01888)
练习网站：[sqlzoo](https://sqlzoo.net/wiki/SELECT_basics)

SQL语句不区分大小写，建议全部小写，这里为了突出部分关键字采用了大写

### 一、基础语句
SQL查询语句语法结构和运行顺序：
语法结构：SELECT-FROM-WHERE-GROUP BY-HAVING-ORDER BY-LIMIT
运行顺序：FROM-WHERE-GROUP BY-HAVING-ORDER BY-LIMIT-SELECT
##### SELECT FROM
**标准语法**：
[**SELECT  字段名 FROM 表名**]
[world表格例题链接](https://sqlzoo.net/wiki/SELECT_from_WORLD_Tutorial)  [nobel表格例题链接](https://sqlzoo.net/wiki/SELECT_from_Nobel_Tutorial)
```
-- 查询单个字段
SELECT population FROM world 
WHERE name='France';
  
-- 查询多个字段并显示别名;
SELECT population 人口, area 面积, gdp GDP FROM world; 

-- 使用distinct对重复数据进行去重
SELECT distinct continent, area FROM world;

-- SELECT中计算字段的应用
SELECT name,gdp,population,gdp/population 人均GDP FROM world;

--查询整个表格
SELECT * FROM world;
```
1.从单表world中查询多列，在select后指定要查询的字段名称，多个字段名之间用英文逗号(，)隔开，最后一个字段名后不需要加逗号
2.select和from关键字后不要忘记添加空格
3.查询结果的字段顺序，按照select后的字段名顺序显示
4.一段标准的查询语句的最后应当添加英文分号(;)向数据库声明这一段查询语句已结束，但是现在的数据库管理工具(向数据库传递SQL代码的软件)比较智能，可以不写分号依然能正常运行代码，甚至同时传递多段代码，依次输出多个查询结果(该功能取决于使用的数据库管理工具是否支持)
5.查询单列，在select后指定要查询的那一个字段名称即可，例如select name from world
6.可以在字段后面加as 别名，结果显示别名，as可以省略用空格代替
##### WHERE
**标准语法**：
[**SELECT 字段名 FROM 表名**]
[**WHERE 表达式**]
```
-- 1.比较运算符(=、>、<、>=、<=、<>、!=)与逻辑运算符(and/or/not)
SELECT name,population FROM world
WHERE continent='Asia' AND population>100000000;

-- 2.范围与集合筛选(between and/in)
SELECT name,gdp/population 人均GDP FROM world
WHERE gdp/population BETWEEN 5000 AND 10000 
  AND continent IN('Asia');

-- 3.判断空值(NULL)
SELECT name FROM world
WHERE gdp is NULL;
```
查询字段值等于某个值时使用等号=，当值为字符串文本需要用英文双引号''包裹，数字不需要

查询多个字段时可使用or或者in，in更为方便
```
-- 1.使用or查询瑞典、挪威和德国的人口
SELECT population FROM world
WHERE name='Sweden' OR name='Norway' OR name='Germany';

-- 2.使用in查询
SELECT population FROM world
WHERE name IN('Sweden','Norway','Germany');
```

模糊查询like，where 字段名 like '通配符+字符'
通配符：%：表示任何字符出现任意次数  占位符_：表示任何字符出现一次
```
-- 查询国家名中以c开头ia结尾的国家
SELECT name FROM world
WHERE name LIKE 'c%ia';

-- 查询国家名中第二个字符为"t"的国家
SELECT name FROM world
WHERE name LIKE '_t%';

-- 查询国家名中含有两个o且被两个字符隔开的国家
SELECT name FROM world
WHERE name LIKE '%o__o%';

-- 查询国家名中含有三个a且面积大于60万(600000)的国家及其面积，或者人口大于13亿(1300000000)且面积大于500万(5000000)的国家及其面积
SELECT name,area FROM world
WHERE (name LIKE '%a%a%a%' AND area>600000)
OR (population>1300000000 AND area>5000000);
```
指定字符位置、个数用占位符_代替，没有指定使用通配符%
另外，and优先级大于or，当需要先运行or时可以使用括号

使用between和and时可以使用!=来去掉其中1-2个边界
```
SELECT name,area FROM world
WHERE area BETWEEN 200000 AND 300000
AND area != 300000;

-- 等价于以下结果
SELECT name,area FROM world
WHERE area>=200000 AND area<300000;
```

| **运算符<br>**  | **描述<br>**        |
| ------------ | ----------------- |
| =            | 等于                |
| >            | 大于                |
| <            | 小于                |
| >=           | 大于等于              |
| <=           | 小于等于              |
| <>或!=        | 不等于               |
| between…and… | 在指定的两个值之间（包含这两个值） |
| in           | 条件范围筛选            |
| not in       | 不在该条件范围           |
| is null      | 为空值               |
| is not null  | 不为空值              |
| and          | 逻辑运算符：与           |
| or           | 逻辑运算符：或           |
| not          | 逻辑运算符：非（一般与其他连用）  |

##### ORDER BY
**标准语法**：
[**SELECT 字段名 FROM 表名**]
[**WHERE 表达式**]
[**ORDER BY 字段名 asc|desc**]
```
-- 查询名字以Sir开头的获奖者，年份从近到远排序，姓名按升序顺序
SELECT winner,yr,subject FROM nobel
WHERE winner LIKE 'Sir%'
ORDER BY yr desc,winner asc;

-- 按照特定顺序进行排序
SELECT winner,subject FROM nobel
WHERE yr = 1984
ORDER BY subject IN('chemistry','physics'),subject,winner;
```
[order by 字段名 asc|desc]，asc为升序，desc为降序，不写默认为升序，例如上面的asc可省略。
排序方式可以不按照表中的字段排序，如subject IN('chemistry','physics')，括号里的值记为1，不在括号里的记为0，按照0-1进行排序，即将括号里排在后面。

##### LIMIT
**标准语法**：
[**SELECT 字段名 FROM 表名**]
[**WHERE 表达式**]
[**ORDER BY 字段名 asc|desc**]
[**LIMIT [位置偏移量],行数**]
```
-- 查询面积排名前三的国家
SELECT name FROM world
ORDER BY area desc
LIMIT 3;

-- 查询人口数量第4到第7的国家和人口数量
SELECT name FROM world
ORDER BY population desc
LIMIT 3,4;

-- 查询第100行到第120行的数据
SELECT * FROM nobel
LIMIT 99,21;
```
limit [位置偏移量] 行数 用来限制查询结果集显示的行数
limit子句是可选项，行数是子句的必选参数，参数位置偏移量是可选参数
limit n返回查询结果前n行，limit x n则是从x+1行开始返回n行
limit子句写在查询语句最后一行

##### 聚合函数
聚合函数适用于需要获取数据的汇总信息，如某字段行数、字段平均值、字段中的最值等。函数需指定字段进行运算，无法使用通配符，并且会忽略空值
SUM() AVG() MAX() MIN() COUNT()
##### GROUP BY
**标准语法**：
[**SELECT 字段名 FROM 表名**]
[**WHERE 表达式**]
[**GROUP BY 字段名1**]
[**ORDER BY 字段名 asc|desc**]
[**LIMIT [位置偏移量],行数**]
```
-- 单独使用聚合函数 查询非洲总人口数量
SELECT SUM(population) FROM world
WHERE continent = 'Africa';

-- 计算表格行数
SELECT COUNT(*) 
FROM world;

-- 联合使用聚合函数和group by查询每个大洲和人口大于1千万的国家数量
SELECT continent,count(name) FROM world
WHERE population >= 10000000
GROUP BY continent;

-- 查询2013年-2015年每年每个科目的获奖人数，结果按年份和人口从大到小排序
SELECT yr,subject,count(winner) 获奖人数 FROM nobel
WHERE yr BETWEEN 2013 AND 2015
GROUP BY yr,subject
ORDER BY yr desc,subject,count(winner) desc;
```
group by 字段名 规定依据哪个字段分组集合，常和聚合函数联用
group by子句可以数据去重，但逻辑和distinct有所不同，distinct仅仅返回不同的行，而group by本质上是对指定字段相同值先进行分区，然后对字段进行去重分组。有多个字段时，按照顺序依次对数据分区。
使用group by子句时聚合函数和group by引用过的字段，否则会报错。

##### HAVING
**标准语法**：
[**SELECT 字段名 FROM 表名**]
[**WHERE 表达式**]
[**GROUP BY 字段名1**]
[**HAVING 表达式**]
[**ORDER BY 字段名 asc|desc**]
[**LIMIT [位置偏移量],行数**]
```
-- 查询总人口数量至少为1亿的大洲
SELECT continent FROM world
GROUP BY continent
HAVING SUM(population) >= 100000000;

-- 查询总人口数至少为3亿的大洲和其平均gdp，其中只有gdp高于200亿且人口数大于6000万或者gdp低于80亿且首都中含有三个a的国家的计入计算，最后按国家数从大到小排序，只显示第一行
SELECT continent,avg(gdp) FROM world
WHERE (gdp > 20000000000 AND population > 60000000) OR (gdp < 8000000000 AND capital like'%a%a%a%')
GROUP BY continent
HAVING SUM(population) > 300000000
ORDER BY count(name) desc
LIMIT 1;
```
having子句和where子句类似，但where是在聚合函数运算之前对原数据进行筛选，而having是在group by分组之后，因此可以使用聚合函数。
建议在对行数据进行筛选时使用where，对需要聚合函数的筛选表达式使用having。

**SQL运行原理**
**from--where--group by--having--order by-limit--select**
from语句从数据库中调取复制一份表格
where语句在复制的表格中筛选出符合条件的数据行
group by语句依据指定字段对筛选后的数据分区，将依据的字段去重分组，
相当于Excel建立了一个数据透视表，添加了行标签
having语句筛选满足条件的分组
order by语句对筛选后的数据进行排序
limit语句对排序后的数据限制显示的行
select语句提取最后要显示的字段

##### 部分常见函数
**数学函数**：
**round(x,y)——四舍五入函数**
round函数对x值进行四舍五入，精确到小数点后y位
y为负值时，保留小数点左边相应的位数为0，不进行四舍五入
例如:round(3.15,1)返回3.2,  round(14.15,-1)返回10

**字符串函数**：
**concat(s1,s2,...)——连接字符串函数**
任一参数为nul时，则返回null
concat函数返回连接参数s1、s2等产生的字符串
例如: concat('My','SQL')返回My SQL, concat('My','null','SQL')返回null

**replace(s,s1,s2)——替换函数**
replace函数使用字符串s2代替s中所有的s1
例:replace('MySQLMySQL','SQL','sql') 返回MysqlMysql

**left(s,n)、right(s,n)&substring(s,n,len)——截取字符串一部分的函数**
left函数返回字符串s最左边n个字符
right函数返回字符串s最右边n个字符
substring函数返回字符串s从第n个字符起取长度为len的子字符串，
n也可以为负值，则从倒数第n个字符起取长度为len的子字符串，
没有len值则取从第n个字符起到最后一位。
例: 
left('abcdefg',3)返回abc,   right('abcdefg',3)返回efg,
substring('abcdefg',2,3)返回bcd,  substring('abcdefg',-2,3)返回fg,
substring('abcdefg',2)返回bcdefg

**数据类型转化函数**：
**cast(x as type)——转换数据类型的函数**
cast函数将一个类型的x值转换为另一个类型的值
type参数可以填写char(n)、date、time、datetime、decimal等转换为对应的数据类型

**日期时间函数**：
**year(date)、month(date)&day(date)——获取年月日的函数**
date可以是年月日组成的日期，也可以是年月日时分秒组成的日期时间
例:year('2021-08-03'):2021, month('2021-08-03'):8, day('2021-08-03'):3

**date_add(date,interval expr type)&date_sub(date,interval expr type)——对指定起始时间进行加减操作**
date用来指定起始时间,expr用来指定从起始时间添加或减去的时间间隔
type指示expr被解释的方式，type可以可以是以下值(second、minute、hour、day、week、month、quarter、year等)
date_add函数对起始时间进行加操作，date_sub函数对起始时间进行减操作
例: date_add('2021-08-03 23:59:59',interval 1 second):2021-08-04 24:00:00, 
date_sub('2021-08-03 23:59:59',interval 2 month):2021-06-03 23:59:59

**datediff(date1,date2)——计算两个日期之间间隔的天数**
datediff函数由date1-date2计算出间隔的时间，只有date的日期部分参与计算，时间不参与
例:datediff('2021-06-08',2021-06-01’):7, datediff('2021-06-08 23:59:59','2021-06-01 21:00:00'):7, datediff('2021-06-01','2021-06-08'):7

**date_format(date,format)——将日期和时间格式化**
date_format函数根据format指定的格式显示date值，这里格式较多了解即可
例: date_format('2018-06-01 16:23:12','%b %d %Y %h:%i%p'):Jun 01 2018 04:23 PM
date_format('2018-06-0116:23:12','%Y/%d/%m'):2018/01/06

**条件判断函数**：
**if(expr,v1,v2)**
如果表达式expr是true返回值v1，否则返回v2
例:if(1<2,'Y','N')返回Y，if(1>2,'Y','N')返回N

**case when**
**1.case expr when v1 then r1 [when v2 then r2] ...[else rn] end**
例:case 2 when 1 then 'one' when 2 then 'two' else 'more'  end返回two
case后面的值为2，与第二条分支语句when后面的值相等相等，因此返回two

**2.case when v1 then r1 [when v2 then r2]...[else rn] end**
例:case when 1<0 then 'T' else 'F' end返回F
1<0的结果为false，因此函数返回值为else后面的F

**MySQL特有函数**：
**field()** 返回某个字符串在后续参数列表中的位置序号，最常用来自定义排序顺序
field(str,str1,str2,str3,...)  返回值为str在列表中是第几个(从1开始)，找不到返回0
例:
```
SELECT FIELD('b', 'a', 'b', 'c', 'd');
-- 返回 2（因为 'b' 在列表里排第 2 位）
SELECT FIELD('x', 'a', 'b', 'c');
-- 返回 0（'x' 不在列表里）
```

[covid表格例题链接](https://sqlzoo.net/wiki/Window_LAG) [world表格例题链接](https://sqlzoo.net/wiki/SELECT_from_WORLD_Tutorial) 
```
-- 使用case when函数判断累计治愈人数
SELECT recovered 累计治愈人数,
CASE WHEN recovered = 1 THEN 'one' 
     WHEN recovered >1 THEN 'more' ELSE '0' END
FROM covid
WHERE recovered > 0;

-- 使用year、month、day函数显示年月日
SELECT whn 更新时间,year(whn) 年,month(whn) 月,day(whn)日
FROM covid
WHERE recovered > 0;

-- 使用date_add函数进行日期运算
SELECT whn 更新时间,date_add(whn,interval 2 day) 加2天
FROM covid
WHERE recovered > 0;

-- 使用round和concat嵌套得到百分比数据
SELECT confirmed,deaths,recovered,recovered/confirmed,
concat(round((recovered/confirmed)*100,2),'%') 治愈率
-- 其中round表示将和100的乘积取两位小数
FROM covid
WHERE recovered/confirmed > 0.3;

-- 使用replace函数进行替换
SELECT distinct name,replace(name,'a','替换') 替换
FROM covid;

-- 使用substring函数进行截取
SELECT distinct name,substring(name,2,3),substring(name,2)
FROM covid
WHERE recovered/confirmed > 0.3;

-- 以下两题为world表格
-- 1.查找国家名称及首都名称首字母相同的国家及首都，但是不能完全相同
SELECT name,capital FROM world
WHERE left(name,1) = left(capital,1)
AND name != capital;

-- 2.查询首都和名称，其中首都需为国家名称的扩展。例如墨西哥城(Mexico City)是墨西哥(Mexico)的扩展，但不能完全相同，如卢森堡(Luxembourg)。
SELECT capital,name FROM world
WHERE capital like concat('%',name,'%')
AND capital != name;
```

### 二、高级语句(窗口函数 表连接 子查询)
##### 1.窗口函数
**标准语法**：函数名`OVER([PARTITION BY 字段名][ORDER BY 字段名 ASC|DESC])`
over()中partition by指定分区依据，order by指定排序依据
**排序窗口函数**：RANK()：并列排序不跳号 1 1 2 2 3
DENSE_RANK()：并列排序跳号  1 1 3 3 5
ROW_NUMBER()：行号绝对排序 1 2 3 4 5 
**偏移分析函数**：LAG(字段名,偏移量n,默认值)：取前n行数据，常用于环比、同比
LEAD(字段名,偏移量n,默认值) ：取后n行数据
FIRST_VASLUE(字段名)  ：取窗口内第一行的值
LAST_VASLUE(字段名) ：取窗口内最后一行的值

[ge表格例题链接](https://sqlzoo.net/wiki/Window_functions) [covid表格例题链接](https://sqlzoo.net/wiki/Window_LAG)
```
-- 例1.查询每一年S14000021选区中所有候选人所在的团体(party)和得票数(votes)，并对每一年中的所有候选人根据选票数的高低赋予名次，选票数最高则为1，第二名则为2，后续以此类推，最后根据团体(party)和年份(yr)排序
SELECT yr,party,votes,
RANK() OVER(PARTITION BY yr ORDER BY votes DESC) as posn
FROM ge
WHERE constituency = 'S14000021'
ORDER BY party,yr;

-- 例2.查询法国和德国1月每天新增确诊人数，最后显示国家名、标准日期(2020-01-27)、当天截至时间累计确诊人数、昨天截至时间累计确诊人数、每天新增确诊人数，按照截至时间排序
SELECT name 国家名,date_format(whn,'%Y-%m-%d') 标准日期,
-- 这里可以直接使用DATE(whn)来表示标准日期
confirmed 当天截至时间累计确诊人数,
LAG(confirmed,1) OVER(PARTITION BY name ORDER BY whn) 昨天截至时间累计确诊人数,
confirmed - LAG(confirmed,1) OVER(PARTITION BY name ORDER BY whn) 每天新增确诊人数
FROM covid
WHERE name IN('France','Germany') AND whn >= '2020-01-01' AND whn < '2020-02-01'
ORDER BY whn
-- 为什么不使用MONTH(whn) = 1，是因为部分数据库不支持该语法，如果使用MySQL是可以的;

-- 练习题ge表格链接标号2：查询2017年选区为'S14000024'的所有候选人所在团体(party)和其选票数(votes)、还有候选人得票数在选区内对应的的排名，结果按团队(party)排序
SELECT party,votes,RANK() OVER(ORDER BY votes DESC) posn
FROM ge
WHERE constituency = 'S14000024' AND yr = 2017
ORDER BY party;

-- 练习题covid表格链接标号6：查询截至时间为2020年4月20日的国家名，确诊人数，确诊人数排名，死亡人数，死亡人数排名按照确诊人数降序排名
SELECT name,confirmed,RANK() OVER(ORDER BY confirmed DESC) rk,
deaths,RANK() OVER(ORDER BY deaths DESC) deathrk
FROM covid
WHERE whn = '2020-04-20'
ORDER BY confirmed DESC;

-- 练习题covid表格链接标号4: 查询意大利每周新增确诊数(显示每周一的数值weekday(whn)=0)，最后显示国家名，标准日期(2020-01-27)，每周新增人数，按照截至时间排序
SELECT name 国家名,DATE(whn) 标准日期,
confirmed - LAG(confirmed,1) OVER(ORDER BY whn) 每周新增人数
FROM covid
WHERE name = 'Italy' AND WEEKDAY(whn) = 0
ORDER BY whn;
```

##### 2.表连接
内连接-INNER JOIN   左连接-LEFT JOIN   右连接-RIGHT JOIN 
交叉连接-CROSS JOIN    全外连接-FULL OUTER JOIN(MySQL不支持，需要左+右+UNION模拟)
**基础语法**：
```
SELECT 字段名 FROM 表1 [INNER/LEFT/RIGHT] JOIN 表2
ON 表1.字段A = 表2.字段B
```
其中内连接INNER为默认方式， 可省略
INNER JOIN去除所有没有连接上的字段，LEFT JOIN保留左边表格的字段，哪怕没有连接上右边表格，RIGHT JOIN相反，因此右连接可以用左连接代替。
FROM 表1 LEFT JOIN 表2 ON 表1.字段A = 表2.字段B 等价于
FROM 表2 RIGHT JOIN 表1 ON 表2.字段B = 表1.字段A

[球队比赛表格链接](https://sqlzoo.net/wiki/The_JOIN_operation)  [教师表格链接](https://sqlzoo.net/wiki/Using_Null) [演员表格链接](https://sqlzoo.net/wiki/More_JOIN_operations)
```
-- 查询有球员名叫Mario进球的比赛中队伍1(team1)，队伍2(team2)及球员姓名
SELECT team1,team2,player
FROM game JOIN goal ON game.id = goal.matchid
WHERE player like'Mario%';

-- 查询队伍1(team1)的教练是“Fernando Santos”的球队名称(teamname)、比赛日期(mdate)和赛事编号(id)
SELECT teamname,mdate,game.id 
FROM game JOIN eteam ON game.team1 = eteam.id
WHERE coach = 'Fernando Santos';

-- 使用合适的连接显示所有教师及其所教授的科目名要将dept表连接至teacher表才能显示教师名和科目名，连接键为dept.id= teacher.dept
SELECT teacher.name,dept.name
FROM teacher INNER JOIN dept ON teacher.dept = dept.id;

-- 练习题1.查询至少出演过第1主角30次的演员名
SELECT name
FROM casting c JOIN actor a ON c.actorid = a.id
WHERE ord = 1
GROUP BY name
HAVING COUNT(ord) >= 30;

-- 查询在比赛前十分钟有进球记录的球员，他的队伍编号(teamid),教练(coach),进球时间(gtime)
SELECT player,teamid,coach,gtime
FROM goal JOIN eteam ON goal.teamid = eteam.id
WHERE goal.gtime <= 10;

-- [经典例题！]查询ENG参与的每场比赛，每个球队的得分情况，照举办时间(mdate)、赛事编号(matchid)、队伍1(team1)和队伍2(team2)排序
SELECT mdate,team1,SUM(CASE WHEN teamid = team1 THEN 1 ELSE 0 END) score1,
team2,SUM(CASE WHEN teamid = team2 THEN 1 ELSE 0 END) score2
FROM game LEFT JOIN goal ON game.id = goal.matchid
-- 这里为避免JOIN将0-0这种没进球的比赛漏掉，因此使用左连接
WHERE team1 = 'ENG' OR team2 = 'ENG'
GROUP BY mdate,team1,team2
ORDER BY mdate,matchid,team1,team2;
```

##### 3.子查询
子查询本身就是一段完整的查询语句，然后用英文括号()包裹嵌套在主查询语句中，
子查询可以多层嵌套，最常用的子查询运用在from和where子句中

**where基于子查询条件筛选(比较运算符&in关键字)**
[world表格链接](https://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial)
 ```
 -- 例题1.查询出gdp高于欧洲所有国家的所有国家名，有些国家gdp值可能为NULL，请排除这些国家
 SELECT name FROM world
 WHERE gdp IS NOT NULL
 AND gdp > (
		 SELECT MAX(gdp)
		 FROM world
		 WHERE continent = 'Europe'
 )  -- 理论上来说可以不用判断空值，因为大于欧洲国家最大值;
 
 -- 例题2.查询跟阿尔及尼亚(Argentina)和澳大利亚(Australia)在同一大洲的所有国家名及其所属大洲，并按照国家名进行排序
 SELECT name,continent FROM world
 WHERE continent IN(
			 SELECT continent FROM world
			 WHERE name IN('Argentina','Australia')
 )
 ORDER BY name;

 ```
 1.子查询是可以自己正常独立运行的一段完整的查询语句，然后将子查询的查询结果作为主查询的一部分，因此子查询优先于主查询运行。
2.例题1是带比较运算符的子查询，要求子查询为标量子查询，即子查询结果为一行一列(相当于一个单元格)。
3.例题2是带in关键字的子查询，要求子查询为列子查询，即子查询结果为多行一列(单列)。
4.where子句中的子查询适用于查询条件无法一步到位，需要先进行一步查询得到结果，基于这个查询结果再进行条件判断的情况，相当于我们无法直达时，需要进行换乘。

**from基于子查询作为数据表**
[议员表格链接](https://sqlzoo.net/wiki/Window_functions) [world表格链接](https://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial) [covid表格链接](https://sqlzoo.net/wiki/Window_LAG)
```
-- 例题：查询2017年所有在爱丁堡的选区当选议员所在选区(constituency)及其团队(party)，已知爱丁堡选区编号为S14000021至S14000026，当选议员即各选区得票数最高的候选人
SELECT constituency,party FROM(
	SELECT constituency,party,votes,
	RANK() OVER(PARTITION BY constituency ORDER BY votes DESC) AS posn
	FROM ge
	WHERE yr = 2017 AND constituency BETWEEN 'S14000021' AND 'S14000026'
) AS rk
WHERE rk.posn = 1
-- 上面对括号中的嵌套语句进行了命名，如同给新生儿取名一样;

-- 练习题1.(world链接标号2)查询在欧洲(Europe)人均gdp大于英国(UnitedKingdom)的国家名
SELECT name FROM world
WHERE gdp/population > (
	SELECT gdp/population FROM world
	WHERE name = 'United Kingdom'
)
AND continent = 'Europe';

-- 练习题2.(world链接标号4)查询人口数(population)超过加拿大(Canada)但是少于波兰(Poland)的国家，结果显示这些国家名(name)和人口数(population)
SELECT name,population FROM world
WHERE population > (
	SELECT population FROM world
	WHERE name = 'Canada'
)
AND population < (
	SELECT population FROM world
	WHERE name = 'Poland'
);

-- 练习题3.(world链接标号9)查询所有国家人口均≤25000000的大洲，及其国家名(name)和人口(population)
-- 解法一：使用group by和having聚合函数
SELECT name,continent,population FROM world
WHERE continent IN(
	SELECT DISTINCT continent FROM world
	GROUP BY continent
	HAVING MAX(population) <= 25000000
)
ORDER BY continent;

-- 解法二：反向排除法，逻辑更为清晰，推荐使用
SELECT name,continent,population FROM world
WHERE continent NOT IN(
	SELECT continent FROM world
	WHERE population > 25000000
) 
AND population <= 25000000 -- 排除空值
ORDER BY continent,name;

-- 解法三：窗口函数
SELECT name,continent,population FROM(
	SELECT 
		name,
		continent,
		population,
		MAX(population) OVER(PARTITION BY continent) AS max_pop
	FROM world
) t -- 这里注意FROM子查询派生表必须有名字
WHERE max_pop <= 25000000
ORDER BY continent,name;

-- 解法四：ALL，暂时还没有使用过，仅供参考
SELECT name,continent,population FROM world x
WHERE 25000000 >= ALL(
	SELECT population FROM world y
	WHERE y.continent = x.continent
	AND population > 0 -- 排除空值
)
ORDER BY continent,name;

-- 练习题4.(world链接标号7)查找每个大陆(continent)中最大的国家(按区域area)，显示该大洲(continent)，国家名(name)和面积(area)
-- 我最初的解法如下，但如果有大洲最大面积相同或某国家面积刚好等于其他州最大值，则会出现错误
SELECT continent,name,area FROM world
WHERE area IN (
	SELECT MAX(area) FROM world
	GROUP BY continent
)
ORDER BY continent;

-- 使用表关联子查询，主查询遍历时，让子查询动态计算这一行所属大洲的最大面积
SELECT continent,name,area FROM world x
WHERE area = (
	SELECT MAX(area) FROM world y
	WHERE x.continent = y.continent -- 关联条件限定为同一个大洲
)
ORDER BY continent;

-- 练习题5.(covid链接标号2)查询德国和意大利每天新增治愈人数并从高到低排名，查询结果按国家名，截至日期(输出格式为'xxxx年xx月xx日')，新增治愈人数，按排名排序
SELECT name,标准日期,每日新增治愈人数,
RANK() OVER(PARTITION BY name ORDER BY 每日新增治愈人数 DESC) 排名
FROM(
	SELECT name,DATE_FORMAT(whn,'%Y年%m月%d日') 标准日期,
	recovered - LAG(recovered,1) OVER(PARTITION BY name ORDER BY whn) 每日新增治愈人数
	FROM covid
	WHERE name IN('Germany','Italy')
) r
ORDER BY 排名;
```

### 三、云端数据库配置

**云端数据库配置具有以下几个优点**
一、简单方便：数据库直接搭建在云端，不会在安装过程中出现任何因系统和环境导致的Bug整个安装过程只需要点点点，没有任何技术要求，大家都能实现；
二、性能更佳：小伙伴们电脑的配置不一，本地数据库极其消耗电脑的运算资源
放在云端，不占用大家的电脑性能，数据库和电脑都运行更快；
三、随时使用：云端数据库可以支持你在任何设备上连接运行，随时随地联系SQL；
四、真实还原：大多数的公司的数据库都搭建在云端，云端数据库能还原真实业务场景的数据环境连接云端数据库是每一位数据分析师的必修课；
五、拓展性强：可以使用Excel、Tableau和Python直接连接云端数据库进行分析；

下载链接可见[SQL入门课程笔记](https://yrzu9y4st8.feishu.cn/mindnotes/bmncn7s9I4IyCLgrrQCskdP7dRf) 

**1.从百度网盘下载Mysql文件夹**
链接:https://pan.baidu.com/s/1-jOwaXWArtv8h21B0-uWGg
提取码:wsra
注：
云端数据库配置所需文件在[MySQL云端数据库配置]文件夹下
需要导入云端数据库进行练习的数据在[数据库导入数据]文件夹下
后续Excel和Tableau连接数据库所需的驱动在[Excel&Tableau数据库连接驱动]文件夹下(也可使用Navicat连接云端数据库)
**2.云端数据库配置文档**
第一步:购买云数据库
第二步:配置云数据库账号、数据库、白名单
第三步:安装datagrip连接数据库
第四步:安装sublime存储和打开sql文件

**数据库简单尝试**
**场景一**：刚来公司的第一天，想康一下门店营业表有哪些字段
`describe ddm.shop `
可以下载为不同格式文件导出，若导出csv文件出现乱码，可选取记事本打开，另存为选择ANSI编码保存

**场景二**：运营需要查看旗下所有品牌和门店在2019年12月1日至7日在美团上的GMV和下单人数
```
select 品牌名称,门店名称,日期,GMV,下单人数  
FROM shop  
where 日期 between '2019-12-01' and '2019-12-07'  
and 平台 = 'meituan'
```
![](/notes/Pasted-image-20260831171241.png)
运行结果：
![](/notes/Pasted-image-20260831171442.png)

**场景三**：查询所有门店每天的GMV和CPC消耗
```
select 门店名称,s.日期,GMV,cpc总费用  
from shop s join cpc c on s.门店ID = c.门店ID  
and s.日期 = c.日期
```
![](/notes/Pasted-image-20260831172428.png)
运行结果：
![](/notes/Pasted-image-20260831172500.png)

**场景四**：业务提新需求了，要看旗下所有品牌各门店12月1日至7日期间在所有平台上的总GMV和总下单人数
```
select 品牌名称,门店名称,sum(GMV),sum(下单人数)  
from shop  
where 日期 between '2019-12-01' and '2019-12-07'  
group by 品牌名称,门店名称
```
![](/notes/Pasted-image-20260831173102.png)
运行结果：
![](/notes/Pasted-image-20260831172908.png)

**场景五**：业务看了眼刚才的数据，表示只想看累计GMV在3万以上，并且下单人数在200人以上的门店
```
select 品牌名称,门店名称,sum(GMV),sum(下单人数)  
from shop  
where 日期 between '2019-12-01' and '2019-12-07'  
group by 品牌名称,门店名称  
having sum(GMV) > 30000  
and sum(下单人数) > 200
```
![](/notes/Pasted-image-20260831173412.png)
运行结果：
![](/notes/Pasted-image-20260831173445.png)

**场景六**：查询2020年饿了么平台上每个门店GMV最高那天的日期和GMV
```
select 门店名称,日期,GMV  
from (  
    select 门店名称,日期,row_number() over(partition by shop.门店名称 order by GMV desc) r,GMV  
    from shop  
    where year(日期) = '2020'  
    and 平台 = 'eleme'  
     ) a  
where a.r = 1
```
![](/notes/Pasted-image-20260831202810.png)
运行结果：
![](/notes/Pasted-image-20260831202841.png)
