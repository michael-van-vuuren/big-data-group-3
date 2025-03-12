package com.Backend.Backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.service.FlavorService;

@RestController
@RequestMapping("/api/flavors")
public class FlavorController {

    private final FlavorService flavorService;

    public FlavorController(FlavorService flavorService) {
        this.flavorService = flavorService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importFlavors(@RequestBody List<String> flavors) {
        flavorService.saveFlavors(flavors);
        return ResponseEntity.ok("Flavors imported successfully!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllFlavors() {
        List<String> flavors = flavorService.getAllFlavors()
                .stream()
                .map(Flavor::getName)
                .toList();
        return ResponseEntity.ok(flavors);
    }
}
