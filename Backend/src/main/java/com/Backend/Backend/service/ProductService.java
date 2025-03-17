package com.Backend.Backend.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend.Backend.dto.ProductFlavorLink;
import com.Backend.Backend.dto.ProductRoasterLink;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.repository.FlavorRepository;
import com.Backend.Backend.repository.ProductRepository;
import com.Backend.Backend.repository.RoasterRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FlavorRepository flavorRepository;
    private final RoasterRepository roasterRepository;

    public ProductService(ProductRepository productRepository, FlavorRepository flavorRepository, RoasterRepository roasterRepository) {
        this.productRepository = productRepository;
        this.flavorRepository = flavorRepository;
        this.roasterRepository = roasterRepository;
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
                    .map(flavorMap::get)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            product.setFlavors(flavors);
            productRepository.save(product);
        }
    }

    @Transactional
    public void linkProductRoasters(List<ProductRoasterLink> links) {
        for (ProductRoasterLink link : links) {
            Product product = productRepository.findByBeanId(link.getBeanId());
            if (product == null) {
                continue;
            }

            Roaster roaster = roasterRepository.findByName(link.getRoasterName());
            if (roaster == null) {
                continue;
            }

            product.setRoaster(roaster);
            productRepository.save(product);
        }
    }



    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
