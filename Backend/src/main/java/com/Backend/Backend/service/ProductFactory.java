package com.Backend.Backend.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.Backend.Backend.dto.ProductDTO;
import com.Backend.Backend.entity.Product;
import com.Backend.Backend.util.ProductValidate;

@Service
public class ProductFactory {
    private final FlavorService flavorService;
    private final RoasterService roasterService;
    private final ProcessService processService;
    private final ProducerService producerService;

    public ProductFactory(FlavorService flavorService, RoasterService roasterService, ProcessService processService, ProducerService producerService) {
        this.flavorService = flavorService;
        this.roasterService = roasterService;
        this.processService = processService;
        this.producerService = producerService;
    }

    // If update is true, update existing rows and add new rows for beanIds that do not exist yet
    // If update is false, only add new rows for beanIds that do not exist yet
    public Product makeProduct(ProductDTO dto, Map<Long, Product> existingProductsMap, boolean update) {
        // Skip null DTOs or DTOs missing a beanId
        if (dto == null || dto.getBeanId() == null) {
            return null;
        }

        Product product = existingProductsMap.getOrDefault(dto.getBeanId(), new Product());

        // Skip if update is false
        if (existingProductsMap.containsKey(dto.getBeanId()) && !update) {
            return null;
        }

        // Product details
        product.setBeanId(dto.getBeanId());
        product.setName(ProductValidate.validate(dto.getName()));
        product.setImage(ProductValidate.validate(dto.getImage()));
        product.setWebpage(ProductValidate.validate(dto.getWebpage()));
        product.setGram(ProductValidate.validate(dto.getGram()));
        product.setRoastDegree(ProductValidate.validate(dto.getRoastDegree()));
        product.setAvailability(ProductValidate.validateAvailability(dto.getAvailability()));

        // Pricing
        product.setPrice(ProductValidate.validate(dto.getPrice()));
        product.setPricePerCup(ProductValidate.validate(dto.getPricePerCup()));
        product.setBulkPricePerCup(ProductValidate.validate(dto.getBulkPricePerCup()));

        // Roaster (many-to-one)
        product.setRoaster(roasterService.addOrUpdateRoaster(
                dto.getRoaster(),
                dto.getRoasterCountry()
        ));

        // Process (many-to-one)
        product.setProcess(processService.addOrUpdateProcess(
                dto.getProcess(),
                dto.getProcessTag() // Process tags should technically be many-to-many with process, but this will do for now (sets tag to most recent import tag)
        ));

        // Flavors (many-to-many)
        product.setFlavors(flavorService.addOrUpdateFlavors(
                dto.getFlavors()
        ));

        // Producers (many-to-many) and their regions/countries
        product.setProducers(producerService.addOrUpdateProducer(
                dto.getProducer(),
                dto.getElevation(),
                dto.getProducerTag(),
                dto.getProducerRegion(),
                dto.getProducerCountry()
        ));

        return product;
    }
}
