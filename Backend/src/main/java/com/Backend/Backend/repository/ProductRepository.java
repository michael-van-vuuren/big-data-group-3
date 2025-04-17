package com.Backend.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Backend.Backend.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // AND match: Must have ALL the given flavors
    @Query("SELECT p FROM Product p JOIN p.flavors f " +
            "WHERE f.name IN :flavorNames " +
            "GROUP BY p " +
            "HAVING COUNT(DISTINCT f.name) = :flavorCount")
    List<Product> findProductsByAllFlavors(@Param("flavorNames") List<String> flavorNames,
                                           @Param("flavorCount") long flavorCount);

    // OR match: Can have ANY of the given flavors
    @Query("SELECT DISTINCT p FROM Product p JOIN p.flavors f " +
            "WHERE f.name IN :flavorNames")
    List<Product> findProductsByAnyFlavor(@Param("flavorNames") List<String> flavorNames);

    // Check for existing products using composite key:
    // roasterName and productName
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p " +
            "WHERE p.name = :productName AND p.roaster.name = :roasterName")
    boolean compositeKeyExists(@Param("roasterName") String roasterName,
                               @Param("productName") String productName);
}


