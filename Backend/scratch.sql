create database coffee;

use coffee;
select * from product;
select * from flavor;
select * from product_flavor;

-- Select product id,name where flavor name is _
SELECT p.id, p.name
FROM product p
JOIN product_flavor pf ON p.id = pf.product_id
JOIN flavor f ON pf.flavor_id = f.id
WHERE f.name = 'Licorice';

-- Select flavor name where product beanId is _
SELECT f.id, f.name
FROM flavor f
JOIN product_flavor pf ON f.id = pf.flavor_id
JOIN product p ON pf.product_id = p.id
WHERE p.bean_id = '10286';

-- reset autoincrement
ALTER TABLE product
AUTO_INCREMENT = 1;

-- drop rows
delete from product where id < 9;