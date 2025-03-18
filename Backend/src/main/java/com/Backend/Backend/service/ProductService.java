package com.Backend.Backend.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.repository.FlavorRepository;
import com.Backend.Backend.repository.ProductRepository;
import com.Backend.Backend.repository.RoasterRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final RoasterRepository roasterRepository;
    private final FlavorRepository flavorRepository;

    public ProductService(ProductRepository productRepository, RoasterRepository roasterRepository, FlavorRepository flavorRepository) {
        this.productRepository = productRepository;
        this.roasterRepository = roasterRepository;
        this.flavorRepository = flavorRepository;
    }

    @Transactional
    public void saveProducts(List<ProductDTO> productDTOs, boolean update) {
        Set<String> beanIds = extractBeanIds(productDTOs);
        Map<String, Product> existingProductsMap = fetchExistingProducts(beanIds);

        List<Product> productsToSave = productDTOs.stream()
                .map(dto -> processProduct(dto, existingProductsMap, update))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (!productsToSave.isEmpty()) {
            productRepository.saveAll(productsToSave);
        }
    }

    // Extract all beanIds from the incoming productDTOs
    private Set<String> extractBeanIds(List<ProductDTO> productDTOs) {
        return productDTOs.stream()
                .map(ProductDTO::getBeanId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    // Fetch all existing products from the database by beanIds
    private Map<String, Product> fetchExistingProducts(Set<String> beanIds) {
        return productRepository.findByBeanIdIn(beanIds).stream()
                .collect(Collectors.toMap(Product::getBeanId, product -> product));
    }

    // If update is true, update existing rows and add new rows for beanIds that do not exist yet
    // If update is false, only add new rows for beanIds that do not exist yet
    private Product processProduct(ProductDTO dto, Map<String, Product> existingProductsMap, boolean update) {
        // Skip null DTOs or DTOs missing a beanId
        if (dto == null || dto.getBeanId() == null) {
            return null;
        }

        Product product = existingProductsMap.getOrDefault(dto.getBeanId(), new Product());

        // Skip if update is false
        if (existingProductsMap.containsKey(dto.getBeanId()) && !update) {
            return null;
        }

        product.setBeanId(dto.getBeanId());
        product.setName(safeGet(dto.getName()));
        product.setRoastDegree(safeGet(dto.getRoastDegree()));
        product.setRoaster(findOrCreateRoaster(dto.getRoaster(), dto.getRoasterCountry()));
        product.setFlavors(findOrCreateFlavors(dto.getFlavors()));

        return product;
    }

    // Find or create the Roaster (many-to-one)
    private Roaster findOrCreateRoaster(String roasterName, String country) {
        if (roasterName == null) return null;

        return roasterRepository.findByName(roasterName)
                .map(existingRoaster -> {
                    if (country != null && !country.equals(existingRoaster.getCountry())) {
                        existingRoaster.setCountry(country);
                        return roasterRepository.save(existingRoaster);
                    }
                    return existingRoaster;
                })
                .orElseGet(() -> roasterRepository.save(new Roaster(roasterName, country)));
    }

    // Find or create Flavors (many-to-many)
    private Set<Flavor> findOrCreateFlavors(List<String> flavorNames) {
        if (flavorNames == null) return null;

        return flavorNames.stream()
                .filter(Objects::nonNull)
                .map(name -> flavorRepository.findByName(name)
                        .orElseGet(() -> flavorRepository.save(new Flavor(name))))
                .collect(Collectors.toSet());
    }

    // Check null after getting value but before setting
    private String safeGet(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
