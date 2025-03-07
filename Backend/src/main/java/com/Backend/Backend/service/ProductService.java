package com.Backend.Backend.service;

import com.Backend.Backend.dto.ProductFlavorLink;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.FlavorRepository;
import com.Backend.Backend.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        for (ProductFlavorLink link : links) {
            Product product = productRepository.findByBeanId(link.getBeanId());

            if (product == null) {
                continue;
            }

            Set<Flavor> flavors = new HashSet<>();
            for (String flavorName : link.getFlavors()) {
                flavorRepository.findByName(flavorName).ifPresent(flavors::add);
            }
            product.setFlavors(flavors);
            productRepository.save(product);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
