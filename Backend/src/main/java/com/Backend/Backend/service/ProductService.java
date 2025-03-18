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
        // Extract all beanIds from the incoming productDTOs
        Set<String> beanIds = productDTOs.stream()
                .map(ProductDTO::getBeanId)
                .collect(Collectors.toSet());

        // Fetch all existing products from the database by beanIds
        Map<String, Product> existingProductsMap = productRepository.findByBeanIdIn(beanIds).stream()
                .collect(Collectors.toMap(Product::getBeanId, product -> product));

        List<Product> productsToSave = new ArrayList<>();

        for (ProductDTO dto : productDTOs) {
            Product product;

            if (existingProductsMap.containsKey(dto.getBeanId())) {
                // If the product already exists, update it
                product = existingProductsMap.get(dto.getBeanId());
                if (!update) continue; // If update is false, skip existing products
            } else {
                // Otherwise, create a new product
                product = new Product();
                product.setBeanId(dto.getBeanId());
            }

            // Update or set new product details
            product.setName(dto.getName());
            product.setRoastDegree(dto.getRoastDegree());

            // Find or create the Roaster (many-to-one)
            Roaster roaster = roasterRepository.findByName(dto.getRoaster())
                    .orElseGet(() -> {
                        Roaster newRoaster = new Roaster();
                        newRoaster.setName(dto.getRoaster());
                        return roasterRepository.save(newRoaster);
                    });
            product.setRoaster(roaster);

            // Find or create Flavors (many-to-many)
            if (dto.getFlavors() != null) {
                Set<Flavor> flavors = dto.getFlavors().stream()
                        .map(name -> flavorRepository.findByName(name)
                                .orElseGet(() -> {
                                    Flavor newFlavor = new Flavor();
                                    newFlavor.setName(name);
                                    return flavorRepository.save(newFlavor);
                                }))
                        .collect(Collectors.toSet());
                product.setFlavors(flavors);
            }
            else {
                product.setFlavors(null);
            }

            productsToSave.add(product);
        }

        // Save all new and updated products
        if (!productsToSave.isEmpty()) {
            productRepository.saveAll(productsToSave);
        }
    }


}
