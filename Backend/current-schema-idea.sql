USE example_coffee;

-- Table: Country
CREATE TABLE Country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Table: Region
CREATE TABLE Region (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES Country(id) ON DELETE CASCADE
);

-- Table: Variety
CREATE TABLE Variety (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    species VARCHAR(255),
    genetic_description TEXT,
    lineage TEXT,
    description TEXT,
    breeder VARCHAR(255),
    optimal_altitude VARCHAR(255),
    quality_potential VARCHAR(255),
    yield_potential VARCHAR(255)
);

-- Table: Coffee Bean Product
CREATE TABLE CoffeeBeanProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bean_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_added DATE,
    variety_id INT,
    roast_degree VARCHAR(255),
    price DECIMAL(10,2),
    gram INT,
    price_per_cup DECIMAL(10,2),
    bulk_price_per_cup DECIMAL(10,2),
    availability ENUM('YES', 'NO'),
    webpage VARCHAR(512),
    image VARCHAR(512),
    process VARCHAR(255),
    producer VARCHAR(255),
    elevation INT,
    roaster VARCHAR(255),
    roaster_country VARCHAR(255),
    FOREIGN KEY (variety_id) REFERENCES Variety(id) ON DELETE SET NULL
);

-- Table: Flavor
CREATE TABLE Flavor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Junction Table: Coffee Bean & Flavor (Many-to-Many)
CREATE TABLE CoffeeBean_Flavor (
    coffee_bean_id INT NOT NULL,
    flavor_id INT NOT NULL,
    PRIMARY KEY (coffee_bean_id, flavor_id),
    FOREIGN KEY (coffee_bean_id) REFERENCES CoffeeBeanProduct(id) ON DELETE CASCADE,
    FOREIGN KEY (flavor_id) REFERENCES Flavor(id) ON DELETE CASCADE
);

-- Junction Table: Coffee Bean & Region (Many-to-Many)
CREATE TABLE CoffeeBean_Region (
    coffee_bean_id INT NOT NULL,
    region_id INT NOT NULL,
    PRIMARY KEY (coffee_bean_id, region_id),
    FOREIGN KEY (coffee_bean_id) REFERENCES CoffeeBeanProduct(id) ON DELETE CASCADE,
    FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
);

-- Junction Table: Coffee Bean & Variety (Many-to-Many)
CREATE TABLE CoffeeBean_Variety (
    coffee_bean_id INT NOT NULL,
    variety_id INT NOT NULL,
    PRIMARY KEY (coffee_bean_id, variety_id),
    FOREIGN KEY (coffee_bean_id) REFERENCES CoffeeBeanProduct(id) ON DELETE CASCADE,
    FOREIGN KEY (variety_id) REFERENCES Variety(id) ON DELETE CASCADE
);
