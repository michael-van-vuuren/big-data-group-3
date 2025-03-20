package com.Backend.Backend.service;

import com.Backend.Backend.entity.Process;
import com.Backend.Backend.repository.ProcessRepository;
import com.Backend.Backend.util.ProductValidate;
import org.springframework.stereotype.Service;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    // Find or create a Process
    public Process addOrUpdateProcess(String processName, String tags) {
        final String validName = ProductValidate.validate(processName);
        final String validTags = ProductValidate.validate(tags);

        if (validName == null) return null;

        return processRepository.findByName(validName)
                .map(existingProcess -> {
                    if (existingProcess.getTags() == null || !existingProcess.getTags().equals(validTags)) {
                        existingProcess.setTags(validTags);
                        return processRepository.save(existingProcess);
                    }
                    return existingProcess;
                })
                .orElseGet(() -> processRepository.save(new Process(validName, validTags)));
    }
}
