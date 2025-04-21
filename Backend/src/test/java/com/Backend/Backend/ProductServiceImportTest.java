package com.Backend.Backend;

import com.Backend.Backend.dto.*;
import com.Backend.Backend.repository.*;
import com.Backend.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImportTest {

    @Mock ProductRepository productRepository;
    @Mock RoasterRepository roasterRepository;
    @Mock ProcessRepository processRepository;
    @Mock FlavorRepository flavorRepository;
    @Mock CountryRepository countryRepository;
    @Mock ProducerRepository producerRepository;
    @Mock RegionRepository regionRepository;

    ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        productService = new ProductService(
                productRepository,
                roasterRepository,
                processRepository,
                flavorRepository,
                producerRepository,
                countryRepository,
                regionRepository
        );
    }

    @Test
    void testImportProduct_withNullName_shouldReject() {
        ProductDTO badProduct = new ProductDTO();
        badProduct.setRoaster(new RoasterDTO("Test Roaster", new CountryDTO("Test Country")));

        ProductImportResult result = productService.importProducts(List.of(badProduct));

        assertEquals(0, result.getAcceptedProducts().size());
        assertEquals(1, result.getRejectedProducts().size());
        assertEquals("Product name is required", result.getRejectionReasons().getFirst());
    }

    @Test
    void testImportProduct_withExistingCompositeKey_shouldReject() {
        ProductDTO duplicateProduct = new ProductDTO();
        duplicateProduct.setName("Dark Roast");
        duplicateProduct.setRoaster(new RoasterDTO("Roast Co", new CountryDTO("Test Country")));

        when(productRepository.compositeKeyExists("Roast Co", "Dark Roast")).thenReturn(true);

        ProductImportResult result = productService.importProducts(List.of(duplicateProduct));

        assertEquals(0, result.getAcceptedProducts().size());
        assertEquals(1, result.getRejectedProducts().size());
        assertEquals("Product already exists", result.getRejectionReasons().get(0));
    }

    @Test
    void testImportProduct_validSingle_shouldAccept() {
        ProductDTO product = new ProductDTO();
        product.setName("Light Roast");
        product.setRoaster(new RoasterDTO("Roast Co", new CountryDTO("Test Country")));

        when(productRepository.compositeKeyExists(any(), any())).thenReturn(false);
        when(productRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(roasterRepository.findAllByNameIn(any())).thenReturn(List.of());
        when(countryRepository.findAllByNameIn(any())).thenReturn(List.of());

        ProductImportResult result = productService.importProducts(List.of(product));

        assertEquals(1, result.getAcceptedProducts().size());
        assertEquals(0, result.getRejectedProducts().size());
        assertTrue(result.getMessage().startsWith("1 products accepted"));
    }
}
