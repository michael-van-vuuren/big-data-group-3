package com.Backend.Backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.services.secretsmanager.model.SecretsManagerException;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    // Inject values from application.properties
    @Value("${aws.secretsmanager.secret-name}")
    private String secretName;

    @Value("${aws.secretsmanager.region}")
    private String region;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    public DataSource dataSource() {
        AwsCredentials credentials = getSecrets();

        return DataSourceBuilder.create()
                .url(datasourceUrl)
                .driverClassName(driverClassName)
                .username(credentials.username)
                .password(credentials.password)
                .build();
    }

    private AwsCredentials getSecrets() {
        // Create Secrets Manager client
        Region awsRegion = Region.of(region);
        try (SecretsManagerClient secretsClient = SecretsManagerClient.builder()
                .region(awsRegion)
                .build()) {

            GetSecretValueRequest valueRequest = GetSecretValueRequest.builder()
                    .secretId(secretName)
                    .build();

            GetSecretValueResponse valueResponse = secretsClient.getSecretValue(valueRequest);
            String secretString = valueResponse.secretString();

            if (secretString == null) {
                throw new RuntimeException("Secret string is null for secret: " + secretName);
            }

            // Parse JSON secret string
            JsonNode secretJson = objectMapper.readTree(secretString);
            String username = secretJson.get("username").asText();
            String password = secretJson.get("password").asText();

            return new AwsCredentials(username, password);

        } catch (SecretsManagerException e) {
            System.err.println("AWS Secrets Manager Error: " + e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Could not retrieve secret " + secretName + " from AWS Secrets Manager", e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not parse secret JSON for secret: " + secretName, e);
        }
    }

    private static class AwsCredentials {
        final String username;
        final String password;

        AwsCredentials(String username, String password) {
            this.username = username;
            this.password = password;
        }
    }
}