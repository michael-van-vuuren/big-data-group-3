package com.Backend.Backend.service;

import com.Backend.Backend.entity.Product;
import com.Backend.Backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void saveProducts(List<Product> products) {
        List<Product> newProducts = products.stream()
                                            .filter(product -> productRepository.findByBeanId(product.getBeanId()) == null)
                                            .toList();
        productRepository.saveAll(newProducts);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
