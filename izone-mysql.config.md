## 创建数据库，数据库名称为 ‘zone’


## 添加数据表

每张表charset 最好为：utf8mb4


### register 表

用途：用于处理用户注册以及登录其它问题

表名：register

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|account    |VARCHAR(45) |           |    √    | √    |      |        |         |               |         |        |
|sex        |   CHAR(1)  |           |    √    |      |      |        |         |               |         |        |
|nickname   |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|birthday   |BIGINT(20)  |           |    √    |      |      |        |         |               |         |        |
|password   |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|ctime      |BIGINT(20)  |           |    √    |      |      |        |         |               |         |        |
|imgpath    |VARCHAR(256)|           |    √    |      |      |        |         |               |         |        |
|fans       |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|region     |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|city       |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |



### dynamic 表

用途：用于处理用户说说

表名：dynamic

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|account    |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|content    |TEXT        |           |         |      |      |        |         |               |         |   NULL |
|ctime      |BIGINT(20)  |           |    √    |      |      |        |         |               |         |        |
|views      |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|talks      |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|praise     |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|region     |VARCHAR(256)|           |    √    |      |      |        |         |               |         |        |
|city       |VARCHAR(256)|           |    √    |      |      |        |         |               |         |        |



### dynamic_img
用途：用于存放每篇说说的图片

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|dynamic_id |INT(11)     |           |    √    |      |      |        |         |               |         |        |
|path       |TEXT        |           |    √    |      |      |        |         |               |         |        |
|size       |INT(11)     |           |    √    |      |      |        |         |               |         |        |
|filename   |TEXT        |           |    √    |      |      |        |         |               |         |        |
|originalname|TEXT       |           |    √    |      |      |        |         |               |         |        |



### praise_table

用途：用于每篇说说的点赞

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|account    |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|dynamic_id |INT(11)     |           |    √    |      |      |        |         |               |         |        |


### attention_table

用途：用于关注

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|originAccount|VARCHAR(45) |         |    √    |      |      |        |         |               |         |        |
|targetAccount|VARCHAR(45) |         |    √    |      |      |        |         |               |         |        |
|ctime      |BIGINT(25)    |         |    √    |      |      |        |         |               |         |        |


### talks_table
用途：说说评论

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|dynamic_id |INT(11)     |           |    √    |      |      |        |         |               |         |        |
|parentAccount |VARCHAR(45)|         |         |      |      |        |         |               |         |        |
|parentNickname|VARCHAR(45)|         |    √    |      |      |        |         |               |         |        |
|content    |VARCHAR(256)  |         |    √    |      |      |        |         |               |         |        |
|ctime      |BIGINT(20)    |         |    √    |      |      |        |         |               |         |        |
|imgpath    |VARCHAR(256)  |         |    √    |      |      |        |         |               |         |        |


### reply_table
用途： 回复说说评论


|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|dynamic_id |INT(11)     |           |    √    |      |      |        |         |               |         |        |
|talks_id   |INT(11)     |           |    √    |      |      |        |         |               |         |        |
|parentAccount |VARCHAR(45)|         |         |      |      |        |         |               |         |        |
|parentNickname|VARCHAR(45)|         |    √    |      |      |        |         |               |         |        |
|parentImgpath |VARCHAR(256)|        |    √    |      |      |        |         |               |         |        |
|childAccount  |VARCHAR(45)|         |         |      |      |        |         |               |         |        |
|childNickname |VARCHAR(45)|         |    √    |      |      |        |         |               |         |        |
|content    |VARCHAR(256)  |         |    √    |      |      |        |         |               |         |        |
|ctime      |BIGINT(20)    |         |    √    |      |      |        |         |               |         |        |


### diary_table
用途：用于成长日记

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|content    |TEXT        |           |    √    |      |      |        |         |               |         |        |
|ctime      |BIGINT(20)  |           |    √    |      |      |        |         |               |         |        |


### production_table
用途：操作其它案例

|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|name       |VARCHAR(45) |           |    √    |      |      |        |         |               |         |        |
|author     |TEXT        |           |         |      |      |        |         |               |         |        |
|description|TEXT        |           |    √    |      |      |        |         |               |         |        |
|score      |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|ctime      |BIGINT(20)  |           |    √    |      |      |        |         |               |         |        |
|downloadNum|INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|shareNum   |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|views      |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |
|imgpath    |TEXT        |           |    √    |      |      |        |         |               |         |        |
|packagePath|TEXT        |           |    √    |      |      |        |         |               |         |        |
|url        |TEXT        |           |         |      |      |        |         |               |         |  NULL  |
|evaluate   |INT(11)     |           |    √    |      |      |        |         |               |         |    0   |


### admin_table
用途：后台管理员注册表


|Column Name|Datatype    |Primary Key| Not Null|Unquie|Binary|Unsigned|Zero Fill| Auto Increment|Generated| Default|
|:---------:|:----------:|:---------:|:------: |:----:|:----:|:------:|:------: |:-------------:|:-------:|:------:|
|id         |INT(11)     |  √        |    √    | √    |      |        |         |       √       |         |        |
|admin_account| VARCHAR(45) |        |    √    |      |      |        |         |               |         |        |
|admin_password| VARCHAR(45)|        |    √    |      |      |        |         |               |         |        |
