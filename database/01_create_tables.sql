CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE pages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  url VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  page_id INT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);