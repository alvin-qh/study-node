-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `project_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `gender` VARCHAR(10) NULL,
    `birthday` DATETIME(0) NULL,
    `phone` VARCHAR(50) NULL,
    `project_id` INTEGER NULL,

    INDEX `ix_user_name`(`name`),
    INDEX `user_project_id_fkey`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
