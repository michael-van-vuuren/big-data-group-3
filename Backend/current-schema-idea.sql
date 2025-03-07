CREATE
DATABASE example_coffee_v2;
USE
example_coffee_v2;

-- Table: Country
CREATE TABLE Country
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
-- Table: Region
CREATE TABLE Region
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    countryId INT          NOT NULL,
    FOREIGN KEY (countryId) REFERENCES Country (id) ON DELETE CASCADE
);
-- Table: Producer
CREATE TABLE Producer
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    regionId  INT          NOT NULL,
    elevation INT,
    FOREIGN KEY (regionId) REFERENCES Region (id) ON DELETE CASCADE
);
-- Table: Process
CREATE TABLE Process
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tags VARCHAR(255) NOT NULL
);
-- Table: Roaster
CREATE TABLE Roaster
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(255)        NOT NULL,
    country VARCHAR(255) UNIQUE NOT NULL
);
-- Table: Product
CREATE TABLE Product
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    beanId          VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(255)        NOT NULL,
    roastDegree     VARCHAR(255),
    price           DECIMAL(10, 2),
    gram            INT,
    pricePerCup     DECIMAL(10, 2),
    bulkPricePerCup DECIMAL(10, 2),
    availability    ENUM('YES', 'NO'),
    webpage         VARCHAR(512),
    image           VARCHAR(512)
);
-- Table: Flavor
CREATE TABLE Flavor
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Join Table: Product_Process
CREATE TABLE Product_Process
(
    productId INT NOT NULL,
    processId INT NOT NULL,
    PRIMARY KEY (productId, processId),
    FOREIGN KEY (productId) REFERENCES Product (id) ON DELETE CASCADE,
    FOREIGN KEY (processId) REFERENCES Process (id) ON DELETE CASCADE
);
-- Join Table: Product_Flavor
CREATE TABLE Product_Flavor
(
    productId INT NOT NULL,
    flavorId  INT NOT NULL,
    PRIMARY KEY (productId, flavorId),
    FOREIGN KEY (productId) REFERENCES Product (id) ON DELETE CASCADE,
    FOREIGN KEY (flavorId) REFERENCES Flavor (id) ON DELETE CASCADE
);
-- Join Table: Product_Roaster
CREATE TABLE Product_Roaster
(
    productId INT NOT NULL,
    roasterId INT NOT NULL,
    PRIMARY KEY (productId, roasterId),
    FOREIGN KEY (productId) REFERENCES Product (id) ON DELETE CASCADE,
    FOREIGN KEY (roasterId) REFERENCES Roaster (id) ON DELETE CASCADE
);

-- Join Table: Product_Producer
CREATE TABLE Product_Producer
(
    productId  INT NOT NULL,
    producerId INT NOT NULL,
    PRIMARY KEY (productId, producerId),
    FOREIGN KEY (productId) REFERENCES Product (id) ON DELETE CASCADE,
    FOREIGN KEY (producerId) REFERENCES Producer (id) ON DELETE CASCADE
);




