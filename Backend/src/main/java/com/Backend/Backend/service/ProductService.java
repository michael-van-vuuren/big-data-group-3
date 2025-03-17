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
    public void saveProducts(List<ProductDTO> productDTOs) {
        // Extract all beanIds from the incoming productDTOs
        Set<String> beanIds = productDTOs.stream()
                .map(ProductDTO::getBeanId)
                .collect(Collectors.toSet());

        // Batch fetch all existing products by beanIds
        Set<String> existingBeanIds = productRepository.findByBeanIdIn(beanIds).stream()
                .map(Product::getBeanId)
                .collect(Collectors.toSet());

        // Filter out productDTOs that already exist in the database
        List<ProductDTO> newProductDTOs = productDTOs.stream()
                .filter(dto -> !existingBeanIds.contains(dto.getBeanId()))
                .toList();

        // No new products
        if (newProductDTOs.isEmpty()) {
            return;
        }

        // Process new products
        List<Product> newProducts = new ArrayList<>();
        for (ProductDTO dto : newProductDTOs) {
            Product product = new Product();
            product.setName(dto.getName());
            product.setBeanId(dto.getBeanId());

            // Find or create the Roaster
            Roaster roaster = roasterRepository.findByName(dto.getRoasterName())
                    .orElseGet(() -> {
                        Roaster newRoaster = new Roaster();
                        newRoaster.setName(dto.getRoasterName());
                        return roasterRepository.save(newRoaster);
                    });
            product.setRoaster(roaster);

            // Find or create Flavors
            Set<Flavor> flavors = dto.getFlavorNames().stream()
                    .map(name -> flavorRepository.findByName(name)
                            .orElseGet(() -> {
                                Flavor newFlavor = new Flavor();
                                newFlavor.setName(name);
                                return flavorRepository.save(newFlavor);
                            }))
                    .collect(Collectors.toSet());
            product.setFlavors(flavors);

            newProducts.add(product);
        }

        // Batch insert new products
        productRepository.saveAll(newProducts);
    }


}
