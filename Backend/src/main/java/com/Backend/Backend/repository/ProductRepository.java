package com.Backend.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Backend.Backend.entity.Product;

import java.util.Collection;
import java.util.Optional;
import java.util.List;
import java.util.Set;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByBeanId(Long beanId);

    List<Product> findAllByNameIn(Collection<String> names);
}

