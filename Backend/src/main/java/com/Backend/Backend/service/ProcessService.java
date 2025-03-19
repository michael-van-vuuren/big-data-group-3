package com.Backend.Backend.service;

import com.Backend.Backend.entity.Process;
import com.Backend.Backend.repository.ProcessRepository;
import org.springframework.stereotype.Service;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    // Find or create the Process (many-to-one)
    public Process addOrUpdateProcess(String processName, String tags) {
        if (processName == null) return null;

        return processRepository.findByName(processName)
                .map(existingProcess -> {
                    if (tags != null && !tags.equals(existingProcess.getTags())) {
                        existingProcess.setTags(tags);
                        return processRepository.save(existingProcess);
                    }
                    return existingProcess;
                })
                .orElseGet(() -> processRepository.save(new Process(processName, tags)));
    }
}
