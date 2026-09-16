题目链接：[牛客网SQL入门题](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=199)
### SQL快速入门
##### 1.基础查询
user_profile表格如下所示：

| id  | device_id | gender | age | university | province |
| --- | --------- | ------ | --- | ---------- | -------- |
| 1   | 2138      | male   | 21  | 北京大学       | Beijing  |
| 2   | 3214      | male   |     | 复旦大学       | Shanghai |
| 3   | 6543      | female | 20  | 北京大学       | Beijing  |
| 4   | 2315      | female | 23  | 浙江大学       | ZheJiang |
| 5   | 5432      | male   | 25  | 山东大学       | Shandong |
*基础查询*
**SQL1-查询所有列**：
题目：现在运营想要查看用户信息表中所有的数据，请你取出相应结果。
``select * from user_profile``
**SQL2-查询多列**：
题目：现在运营同学想要用户的设备id对应的性别、年龄和学校的数据，请你取出相应数据。
``select device_id,gender,age,university from user_profile``
*简单处理查询结果*
**SQL3-查询结果去重**：
题目：现在运营需要查看用户来自于哪些学校，请从用户信息表中取出学校的去重数据。
``select distinct university from user_profile``
**SQL4-查询结果限制返回行数**：
题目：现在运营只需要查看前2个用户明细设备ID数据，请你从用户信息表 user_profile 中取出相应结果。
```
select device_id from user_profile
limit 2
```
**SQL5-将查询后的列重新命名**：
题目：现在你需要查看前2个用户明细设备ID数据，并将列名改为 'user_infos_example',，请你从用户信息表取出相应结果。
```
select device_id user_infos_example from user_profile
limit 2
```
##### 2.条件查询
*基础排序*
**SQL6-查找后排序**：
题目：现在运营想要取出用户信息表中的用户设备ID和用户年龄，请取出相应数据，并按照年龄升序排序。
```
select device_id,age from user_profile
order by age
```
**SQL7-查找后多列排序**：
题目：现在运营想要取出用户信息表中的device_id、年龄和gpa数据，并先按照gpa升序排序，再按照年龄升序排序输出，请取出相应数据。
```
select device_id,gpa,age from user_profile
order by gpa,age
```
**SQL8-查找后降序排列**：
题目：现在运营想要取出用户信息表中对应的数据，并先按照gpa降序排列、gpa相同的按照年龄降序排序输出，请取出相应数据。
```
select device_id,gpa,age from user_profile
order by gpa desc,age desc
```
*基础操作符*
**SQL9-查找学校是北大的学生信息**：
题目：现在运营想要筛选出所有北京大学的学生进行用户调研，请你从用户信息表中取出满足条件的数据，结果返回设备id和学校。
```
select device_id,university
from user_profile
where university = '北京大学'
```
**SQL10-查找年龄大于24岁的用户信息**：
题目：现在运营想要针对24岁以上的用户开展分析，请你取出满足条件的设备ID、性别、年龄、学校。
```
select device_id,gender,age,university
from user_profile
where age > 24
```
**SQL11-查找某个年龄段的用户信息**：
题目：现在运营想要针对20岁及以上且23岁及以下的用户开展分析，请你取出满足条件的设备ID、性别、年龄。
```
select device_id,gender,age
from user_profile
where age between 20 and 23
```
**SQL12-查找除复旦大学的用户信息**：
题目：现在运营想要查看除复旦大学以外的所有用户明细包括的字段有 device_id、gender、age、university，请你取出相应数据。
```
select device_id,gender,age,university
from user_profile
where university <> '复旦大学'
```
**SQL13-用where过滤空值练习**：
题目：现在运营想要对用户的年龄分布开展分析，在分析时想要剔除没有获取到年龄的用户，请你取出所有年龄值不为空的用户的设备ID，性别，年龄，学校的信息。
```
select device_id,gender,age,university
from user_profile
where age is not null and age <> ''
-- age is not null排除null，age <> ''排除空字符串，int类型数据通常不会出现空字符串，因此这里不需要age <> ''，但如果是其他类型则可能需要排除空字符串
```
*高级操作符*
**SQL14-高级操作符练习(1)**：
题目：现在运营想要找到male且GPA在3.5以上(不包括3.5)的用户进行调研，请你取出相关数据。
```
select device_id,gender,age,university,gpa
from user_profile
where gender = 'male' and gpa > 3.5
```
**SQL15-高级操作符练习(1)**：
题目：现在运营想要找到学校为北大**或**GPA在3.7以上(不包括3.7)的用户进行调研，请你取出相关数据（使用OR实现）
```
select device_id,gender,age,university,gpa
from user_profile
where university = '北京大学' or gpa > 3.7
```
**SQL16-Where in和Not in**：
题目：现在运营想要找到学校为北大、复旦和山大的同学进行调研，请你取出相关数据。
```
select device_id,gender,age,university,gpa
from user_profile
where university in ('北京大学','复旦大学','山东大学')
```
**SQL17-操作符混合运用**：
题目：现在运营想要找到gpa在3.5以上(不包括3.5)的山东大学用户 或 gpa在3.8以上(不包括3.8)的复旦大学同学进行用户调研，请你取出相应数据,取出的数据按照device_id升序排列。
```
select device_id,gender,age,university,gpa
from user_profile
where (gpa > 3.5 and university = '山东大学') or (gpa > 3.8 and university = '复旦大学')
```
**SQL18-查看学校名称中含北京的用户**：
题目：现在运营想查看所有大学中带有"北京"的用户的信息(device_id,age,university)，请你取出相应数据。
```
select device_id,age,university
from user_profile
where university like '%北京%'
```
匹配串中可包含如下四种通配符：  
_ :匹配任意一个字符；  
%：匹配0个或多个字符；  
[]：匹配[]中的任意一个字符(若要比较的字符是连续的，则可以用连字符“-”表达)；  
[^ ]：不匹配[ ]中的任意一个字符。
由于like语句不支持[]正则语法，可使用regexp或rlike来实现：
```
-- 假设device_id是四位数的纯数字
select device_id from user_profile
where device_id regexp '^[0-9]{4}$' -- ^表示开头，$表示结尾，{4}表示重复4次
```
*正则表达式*
**SQL40-电话号码格式校验**：
题目：在一张contacts表中，存储了用户的联系信息。请查询出所有符合以下条件的电话号码，并按id升序输出所有字段：
1. 电话号码必须是 10 位数字。
2. 电话号码的第一位不能以 0 开头。
3. 电话号码的格式可以是连续的 10 位数字，或以-分隔的格式（如123-456-7890）

| id | name | phone_number |
|----|------|--------------|
| 1 | Alice | 1234567890 |
| 2 | Bob | 0123456789 |
| 3 | Charlie | 123-456-7890 |
| 4 | David | 123-4567-890 |
| 5 | Eve | 9876543210 |
```
select * from contacts
where phone_number regexp '^[1-9][0-9]{9}$|[1-9][0-9]{2}-[0-9]{3}-[0-9]{4}'
```
``[1-9][0-9]{9}``表示首位不为0，并且后面为0-9的数字出现9次
如果不限制123-456-7890的格式，可以这样写：
```
select * from contacts
where phone_number regexp '^[1-9]([0-9]-*){9}$'
-- '-*'表示'-'这个符号可以出现任意次，即每个数字后面可以跟任意个，这样的组合会出现9次
```
##### 3.高级查询
*计算函数*
**SQL19-查找GPA最高值**：
题目：运营想要知道复旦大学学生gpa最高值是多少，请你取出相应数据
```
-- 方法一
select gpa from user_profile
where university =  '复旦大学'
order by gpa desc
limit 1
-- 方法二
select max(gpa) gpa from user_profile
where university =  '复旦大学'
```
**SQL20-计算男生人数以及平均GPA**：
题目：现在运营想要看一下男性用户有多少人以及他们的平均gpa是多少，用以辅助设计相关活动，请你取出相应数据。
```
select count(id) male_num,avg(gpa) avg_gpa
from user_profile
where gender = 'male'
```
*分组查询*
以下题目所用到的用户信息表：user_profile
30天内活跃天数字段（active_days_within_30）
发帖数量字段（question_cnt）
回答数量字段（answer_cnt

| id | device_id | gender | age | university | gpa | active_days_within_30 | question_cnt | answer_cnt |
|----|-----------|--------|-----|------------|-----|-----------------------|--------------|------------|
| 1  | 2138      | male   | 21  | 北京大学   | 3.4 | 7                     | 2            | 12         |
| 2  | 3214      | male   |     | 复旦大学   | 4.0 | 15                    | 5            | 25         |
| 3  | 6543      | female | 20  | 北京大学   | 3.2 | 12                    | 3            | 30         |
| 4  | 2315      | female | 23  | 浙江大学   | 3.6 | 5                     | 1            | 2          |
| 5  | 5432      | male   | 25  | 山东大学   | 3.8 | 20                    | 15           | 70         |
| 6  | 2131      | male   | 28  | 山东大学   | 3.3 | 15                    | 7            | 13         |
| 7  | 4321      | male   | 26  | 复旦大学   | 3.6 | 9                     | 6            | 52         |
**SQL21-分组计算练习题**：==有点不熟练==
题目：现在运营想要对每个学校不同性别的用户活跃情况和发帖数量进行分析，请分别计算出每个学校每种性别的用户数、30天内平均活跃天数和平均发帖数量。
你的查询返回结果需要对性别和学校分组，示例如下，结果保留1位小数，1位小数之后的四舍五入,查询出来的结果按照gender、university升序排列。

| gender | university | user_num | avg_active_day | avg_question_cnt |
|--------|------------|----------|----------------|------------------|
| female | 北京大学   | 1        | 12.0           | 3.0              |
| female | 浙江大学   | 1        | 5.0            | 1.0              |
| male   | 北京大学   | 1        | 7.0            | 2.0              |
| male   | 复旦大学   | 2        | 12.0           | 5.5              |
| male   | 山东大学   | 2        | 17.5           | 11.0             |
```
select gender,university,count(id) user_num,
avg(active_days_within_30) avg_active_day,
avg(question_cnt) avg_question_cnt
from user_profile
group by gender,university
order by gender,university
```
**SQL22-分组过滤练习题**：==注意having的用法==
题目：现在运营想查看每个学校用户的平均发贴和回帖情况，寻找低活跃度学校进行重点运营，请取出平均发贴数低于5的学校或平均回帖数小于20的学校。
根据示例，你的查询应返回以下结果，注意返回的字段名需要保持一致，同时保留3位小数(系统后台也会自动校正)，3位之后四舍五入。

| university | avg_question_cnt | avg_answer_cnt |
| ---------- | ---------------- | -------------- |
| 北京大学       | 2.500            | 21.000         |
| 浙江大学       | 1.000            | 2.000          |
```
select university,
       avg(question_cnt) avg_question_cnt,
       avg(answer_cnt) avg_answer_cnt
from user_profile
group by university
having avg(question_cnt) < 5 or avg(answer_cnt) < 20
```
**SQL23-分组排序练习题**：
题目：现在运营想要查看不同大学的用户平均发帖情况，并期望结果按照平均发帖情况进行升序排列，请你取出相应数据。  
根据示例，你的查询应返回以下结果：

| university | avg_question_cnt |
|------------|------------------|
| 浙江大学   | 1.0000           |
| 北京大学   | 2.5000           |
| 复旦大学   | 5.5000           |
| 山东大学   | 11.0000          |
```
select university,
avg(question_cnt) avg_question_cnt
from user_profile
group by university
order by avg_question_cnt 
#这里使用别名表明order by在select运行之后运行
```
##### 4.多表查询
这里涉及到多表连接，其中question_practice_detail如下所示，答题情况明细表 question_practice_detail，其中question_id是题目编号，result是答题结果。

| **id** | **device_id** | **question_id** | **result** |
| ------ | ------------- | --------------- | ---------- |
| 1      | 2138          | 111             | wrong      |
| 2      | 3214          | 112             | wrong      |
| 3      | 3214          | 113             | wrong      |
| 4      | 6543          | 114             | right      |
| 5      | 2315          | 115             | right      |
| 6      | 2315          | 116             | right      |
| 7      | 2315          | 117             | wrong      |

*子查询*
**SQL24-浙江大学用户题目回答情况**：
题目：现在运营想要查看所有来自浙江大学的用户题目回答明细情况，请你取出相应数据。
根据示例，你的查询应返回以下结果，查询结果根据question_id升序排序：

| **device_id<br>** | **question_id<br>** | **result** |
| ----------------- | ------------------- | ---------- |
| 2315              | 115                 | right      |
| 2315              | 116                 | right      |
| 2315              | 117                 | wrong      |
```
select q.device_id,q.question_id,result #select后的字段记得加上表头
from question_practice_detail q join user_profile u
on q.device_id = u.device_id
where u.university = '浙江大学'
```
*链接查询*
**SQL25- 统计每个学校的答过题的用户的平均答题数**： 
题目：运营想要了解每个学校答过题的用户平均答题数量情况，请你取出数据。
请你写SQL查找每个学校用户的平均答题数目(说明：某学校用户平均答题数量计算方式为该学校用户答题总次数除以答过题的不同用户个数)根据示例，你的查询应返回以下结果（结果保留4位小数），注意：结果按照university升序排序！！！

| **university** | **avg_answer_cnt** |
| -------------- | ------------------ |
| 北京大学           | 1.0000             |
| 复旦大学           | 2.0000             |
| 山东大学           | 2.0000             |
| 浙江大学           | 3.0000             |
```
select university,count(question_id)/count(distinct q.device_id) avg_answer_cnt
#想了半天没想到distinct的用法是在count里面啊家人们！
from user_profile u join question_practice_detail q
on u.device_id = q.device_id
group by university
order by university
```
**SQL26- 统计每个学校各难度的用户平均刷题数**： **==不会！==**
题目：运营想要计算一些**参加了答题**的不同学校、不同难度的用户平均答题量，请你写SQL取出相应数据。这里增加了一个题目难度表：

| **id** | **question_id** | **difficult_level** |
| -- | -- | -- |
| 1  | 111             | hard                |
| 2  | 112             | medium              |
| 3  | 113             | easy                |
| 4  | 115             | easy                |
| 5  | 116             | medium              |
| 6  | 117             | easy                |
请你写一个SQL查询，计算不同学校、不同难度的用户平均答题量，根据示例，你的查询应返回以下结果(结果在小数点位数保留4位，4位之后四舍五入)。
```
select up.university,qd.difficult_level,round(count(qpd.question_id)/count(distinct up.device_id),4) avg_answer_cnt
#小数点这个是真忘了
from question_practice_detail qpd #这里要注意选择哪个表连接
left join question_detail qd on qpd.question_id = qd.question_id
left join user_profile up  on qpd.device_id = up.device_id
group by up.university,qd.difficult_level	
order by up.university,qd.difficult_level	
#多表连接时要注意字段名前面加表名，因为多个表含相同字段名 
```
**SQL27- 统计每个用户的平均刷题数**：
题目：运营想要查看**参加了答题**的山东大学的用户在不同难度下的平均答题题目数，请取出相应数据。
请你写一个SQL查询，计算山东、不同难度的用户平均答题量，根据示例，你的查询应返回以下结果(结果在小数点位数保留4位，4位之后四舍五入)。
```
select up.university,qd.difficult_level,
round(count(qpd.question_id)/count(distinct up.device_id),4) as avg_answer_cnt
from user_profile up #这里需注意主表和子表的顺序
inner join question_practice_detail qpd on up.device_id = qpd.device_id
join question_detail qd on qd.question_id = qpd.question_id
where up.university = '山东大学'
group by up.university,qd.difficult_level
order by qd.difficult_level
```
*组合查询*
**SQL28-查找山东大学或者性别为男生的信息**：==union all==
题目：现在运营想要分别查看学校为山东大学或者性别为男性的用户的device_id、gender、age和gpa数据，请取出相应结果，结果不去重。
（注意输出的顺序，先输出学校为山东大学再输出性别为男生的信息）
```
select device_id,gender,age,gpa from user_profile
where university = '山东大学' 

union all

select device_id,gender,age,gpa from user_profile
where gender = 'male'
```
##### 5.必会的常用函数
*条件函数*
**SQL29-计算25岁以上和以下的用户数量**： ==自定义字段名==
题目：现在运营想要将用户划分为25岁以下和25岁及以上两个年龄段，分别查看这两个年龄段用户数量。
```
-- 使用union all
select '25岁以下' age_cut,count(*) number from user_profile
where age < 25 or age is null

union all

select '25岁及以上' age_cut,count(*) number from user_profile
where age >= 25
-- 官方题解
select case when age >= 25 then '25岁及以上' else '25岁以下'
       end age_cut,count(*) number
from user_profile
group by age_cut
-- 由于group by执行在select前面，通常不能使用别名，这里group by使用别名是MySQL的特性，若使用其他数据库需要写group by case when age >= 25 then '25岁及以上' else '25岁以下' end
-- 如果想严格自定义顺序，可添加 order by field(age_cut,'25岁以下','25岁及以上')
```
**SQL30-查看不同年龄段的用户明细**：
题目：现在运营想要将用户划分为20岁以下，20-24岁，25岁及以上三个年龄段，分别查看不同年龄段用户的明细情况，请取出相应数据。(注：若年龄为空请返回其他。)
```
select device_id,gender,
       case when age < 20 then '20岁以下'
            when age between 20 and 24 then '20-24岁'
            when age >= 25 then '25岁及以上'
            else '其他' end age_cut
from user_profile
```
*日期函数*
**SQL31-计算用户8月每天的练题数量**：
题目：现在运营想要计算出2021年8月每天用户练习题目的数量，请取出相应数据。
```
select day(date) day,count(question_id) question_cnt
from question_practice_detail
where month(date) = '08'
group by date
```
**SQL32-计算用户的平均次日留存率**：  **==困难==**
题目：现在运营想要查看用户在某天刷题后第二天还会再来刷题的留存率。请你取出相应数据。
```

```
*文本函数*
**SQL33-统计每种性别的人数**：

**SQL34-提取博客URL中的用户名**：

**SQL35-截取出年龄**：

*窗口函数*
**SQL36-找出每个学校GPA最低的同学**：

*聚合函数与窗口函数的结合使用*
**SQL41- 计算每日累计利润**：

*数学函数*
**SQL42- 基本数学函数**：
##### 6.综合练习
**SQL37- 统计复旦用户8月练题情况**：

**SQL38-浙大不同难度题目的正确率**：

**SQL39-21年8月份练题数**：

**需要二刷的题目**：
21 22 25 26 27 29 32
