package com.Backend.Backend.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.util.StringUtils;

@Service
public class ProductFactory {
    private final FlavorService flavorService;
    private final RoasterService roasterService;

    public ProductFactory(FlavorService flavorService, RoasterService roasterService) {
        this.flavorService = flavorService;
        this.roasterService = roasterService;
    }

    // If update is true, update existing rows and add new rows for beanIds that do not exist yet
    // If update is false, only add new rows for beanIds that do not exist yet
    public Product makeProduct(ProductDTO dto, Map<String, Product> existingProductsMap, boolean update) {
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
        product.setName(StringUtils.safeGet(dto.getName()));
        product.setRoastDegree(StringUtils.safeGet(dto.getRoastDegree()));
        // Roaster is many-to-one
        product.setRoaster(roasterService.addOrUpdateRoaster(dto.getRoaster(), dto.getRoasterCountry()));
        // Flavors are many-to-many
        product.setFlavors(flavorService.addOrUpdateFlavors(dto.getFlavors()));

        return product;
    }
}
