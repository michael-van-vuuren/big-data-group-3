package com.Backend.Backend.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductFactory productFactory;

    public ProductService(ProductRepository productRepository, ProductFactory productFactory) {
        this.productRepository = productRepository;
        this.productFactory = productFactory;
    }

    @Transactional
    public void importProducts(List<ProductDTO> productDTOs, boolean update) {
        Set<Long> beanIds = extractBeanIds(productDTOs);
        Map<Long, Product> existingProductsMap = fetchExistingProducts(beanIds);

        List<Product> productsToSave = productDTOs.stream()
                .map(dto -> productFactory.makeProduct(dto, existingProductsMap, update))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (!productsToSave.isEmpty()) {
            productRepository.saveAll(productsToSave);
        }
    }

    // Extract all beanIds from the incoming productDTOs
    private Set<Long> extractBeanIds(List<ProductDTO> productDTOs) {
        return productDTOs.stream()
                .map(ProductDTO::getBeanId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    // Fetch all existing products from the database by beanIds
    private Map<Long, Product> fetchExistingProducts(Set<Long> beanIds) {
        return productRepository.findByBeanIdIn(beanIds).stream()
                .collect(Collectors.toMap(Product::getBeanId, product -> product));
    }
}
