package com.Backend.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Backend.Backend.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p WHERE p.name = :productName AND p.roaster.name = :roasterName")
    boolean compositeKeyExists(@Param("roasterName") String roasterName, @Param("productName") String productName);
}

