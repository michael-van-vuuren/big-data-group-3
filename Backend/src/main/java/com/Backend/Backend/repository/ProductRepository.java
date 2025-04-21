package com.Backend.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Backend.Backend.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.roaster r " +
            "LEFT JOIN FETCH r.country " +
            "LEFT JOIN FETCH p.process " +
            "LEFT JOIN FETCH p.flavors " +
            "LEFT JOIN FETCH p.producers pr " +
            "LEFT JOIN FETCH pr.regions " +
            "LEFT JOIN FETCH pr.countries " +
            "WHERE p.id IN :ids")
    List<Product> findProductsWithDetailsByIds(@Param("ids") List<Long> ids);

    // AND match: Must have ALL the given flavors
    @Query("SELECT p.id FROM Product p JOIN p.flavors f " +
            "WHERE f.name IN :flavorNames " +
            "GROUP BY p.id " +
            "HAVING COUNT(DISTINCT f.name) = :flavorCount")
    List<Long> findProductIdsByAllFlavorNames(@Param("flavorNames") List<String> flavorNames,
                                              @Param("flavorCount") long flavorCount);

    // OR match: Can have ANY of the given flavors
    @Query("SELECT DISTINCT p.id FROM Product p JOIN p.flavors f WHERE f.name IN :flavorNames")
    List<Long> findProductIdsByAnyFlavor(@Param("flavorNames") List<String> flavorNames);

    // Find by Roaster name
    @Query("SELECT DISTINCT p.id FROM Product p " +
            "JOIN p.roaster r " +
            "WHERE LOWER(r.name) = LOWER(:roasterName)")
    List<Long> findProductIdsByRoasterName(@Param("roasterName") String roasterName);

    // Find by Roaster country
    @Query("SELECT DISTINCT p.id FROM Product p " +
            "JOIN p.roaster r JOIN r.country c " +
            "WHERE LOWER(c.name) = LOWER(:countryName)")
    List<Long> findProductIdsByRoasterCountry(@Param("countryName") String countryName);

    // Find by user's favorites
    @Query("SELECT p.id FROM Account a JOIN a.favoriteProducts p WHERE a.id = :accountId")
    List<Long> findFavoriteProductIds(@Param("accountId") Long accountId);


    // Check for existing products using composite key:
    // roasterName and productName
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p " +
            "WHERE p.name = :productName AND p.roaster.name = :roasterName")
    boolean compositeKeyExists(@Param("roasterName") String roasterName,
                               @Param("productName") String productName);


    /* DO NOT USE, SLOW due to not pre-joining tables */
    // AND match: Must have ALL the given flavors
    @Query("SELECT p FROM Product p JOIN p.flavors f " +
            "WHERE f.name IN :flavorNames " +
            "GROUP BY p " +
            "HAVING COUNT(DISTINCT f.name) = :flavorCount")
    List<Product> findProductsByAllFlavors(@Param("flavorNames") List<String> flavorNames,
                                           @Param("flavorCount") long flavorCount);
    /* SLOW due to not pre-joining tables */
    // OR match: Can have ANY of the given flavors
    @Query("SELECT DISTINCT p FROM Product p JOIN p.flavors f " +
            "WHERE f.name IN :flavorNames")
    List<Product> findProductsByAnyFlavor(@Param("flavorNames") List<String> flavorNames);
}


