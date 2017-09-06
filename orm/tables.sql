create table `project`(
	`id` int unsigned not null auto_increment,
	`name` varchar(50) not null,
	`type` varchar(20) not null,
	primary key(`id`)
);

create table `user`(
	`id` int unsigned not null auto_increment,
	`name` varchar(50) not null,
	`gender` char(1) not null,
	`birthday` datetime,
	`phone` varchar(50),
	`project_id` int unsigned,
	primary key(`id`),
	constraint `fk_project_id` foreign key (`project_id`) references `project`(`id`)
);
