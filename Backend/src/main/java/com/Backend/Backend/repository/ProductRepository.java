package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Product findByBeanId(String beanId);
}
