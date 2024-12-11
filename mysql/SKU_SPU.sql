CREATE TABLE `sd_product` (
  `productId` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `product_name` varchar(64) DEFAULT NULL COMMENT 'spu name',
  `product_desc` varchar(256) DEFAULT NULL COMMENT 'spu desc',
  `product_status` tinyint(4) DEFAULT NULL COMMENT '0: out of stock, 1: in stock ',
  `product_attrs` json DEFAULT NULL COMMENT 'json attributes',
  `product_shopId` bigint(20) DEFAULT NULL COMMENT 'id shop',
  `is_deleted` tinyint(1) unsigned DEFAULT '0' COMMENT '0:delete 1:null',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'created timestamp',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'updated timestamp',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';


-- tb_sku
CREATE TABLE `sku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_name` varchar(50) DEFAULT NULL COMMENT 'sku_name',
  `sku_description` varchar(256) DEFAULT NULL COMMENT 'sku_description',
  `sku_type` tinyint(4) DEFAULT NULL COMMENT 'sku_type',
  `status` tinyint(4) NOT NULL COMMENT 'status',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku'

-- tb_sku_attr

CREATE TABLE `sku_attr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `sku_attrs` json DEFAULT NULL COMMENT 'sku_attrs',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku_attr'


-- tb_sku_specs

CREATE TABLE `sku_attr` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `spu_specs` json DEFAULT NULL COMMENT 'attributes',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';


-- tb_spu_to_sku

CREATE TABLE `spu_to_sku` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `sku_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'sku id',
  `spu_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'spu id',

  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '0:deleted 1:nul',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_spu_to_sku` (`spu_no`,`sku_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='spu_to_sku';