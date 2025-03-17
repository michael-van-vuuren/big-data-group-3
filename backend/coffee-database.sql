CREATE TABLE coffee_database.coffee_profile(
                                               coffee_id INT AUTO_INCREMENT PRIMARY KEY,
                                               bean_id INT NOT NULL,
                                               date_added DATE,
                                               roaster VARCHAR(255),
                                               roast_degree VARCHAR(255),
                                               country_of_origin VARCHAR(30),
                                               region VARCHAR(50),
                                               elevation VARCHAR(55),
                                               variety VARCHAR(50),
                                               processing VARCHAR(50),
                                               cupping_score DECIMAL(4, 1),
                                               general_tasting_notes TEXT
);

CREATE TABLE coffee_database.coffee_price (
                                              price_id INT AUTO_INCREMENT PRIMARY KEY,
                                              coffee_id INT NOT NULL,
                                              price DECIMAL(10, 2) NOT NULL,
                                              price_per_gram DECIMAL(10, 2),
                                              price_per_cup DECIMAL(10, 2),
                                              availability VARCHAR(7) NOT NULL,
                                              FOREIGN KEY (coffee_id) REFERENCES coffee_profile(coffee_id)
);

