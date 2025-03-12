package com.Backend.Backend.service;

import java.util.stream.Collectors;
import java.util.Map;
import java.util.Objects;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend.Backend.dto.ProductFlavorLink;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.FlavorRepository;
import com.Backend.Backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FlavorRepository flavorRepository;

    public ProductService(ProductRepository productRepository, FlavorRepository flavorRepository) {
        this.productRepository = productRepository;
        this.flavorRepository = flavorRepository;
    }

    @Transactional
    public void saveProducts(List<Product> products) {
        List<Product> newProducts = products.stream()
                .filter(product -> productRepository.findByBeanId(product.getBeanId()) == null)
                .toList();
        productRepository.saveAll(newProducts);
    }

    @Transactional
    public void linkProductFlavors(List<ProductFlavorLink> links) {
        List<Flavor> allFlavors = flavorRepository.findAll();

        Map<String, Flavor> flavorMap = allFlavors.stream()
                .collect(Collectors.toMap(Flavor::getName, flavor -> flavor));

        for (ProductFlavorLink link : links) {
            Product product = productRepository.findByBeanId(link.getBeanId());

            if (product == null) {
                continue;
            }

            Set<Flavor> flavors = link.getFlavors().stream()
                    .map(flavorMap::get)  // Direct lookup by name
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            product.setFlavors(flavors);
            productRepository.save(product);
        }
    }


    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
