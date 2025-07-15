-- Create the course database if it doesn't exist
CREATE DATABASE IF NOT EXISTS course;
USE course;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Create the 'courses' table
CREATE TABLE courses (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  price DECIMAL(10,2),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert demo course data
INSERT INTO courses (title, description, author, price, image) VALUES
('Bopha Svay Rieng', 'Thailand', 'Norrint', 0.00, '/img/1750907689276-f1060ad5cd323c4b4e3af9c32c642507.jpg'),
('Kjsdak', 'sajkkfs', 'asjhsaf', 2.00, '/img/1750907793987-f1060ad5cd323c4b4e3af9c32c642507.jpg'),
('jashas', 'kashgsf', 'kajdgfjk', 1.00, '/img/1750907813515-f1060ad5cd323c4b4e3af9c32c642507.jpg'),
('lajkaf', 'ajkhg', 'laklfsj', 2.00, '/img/1750910235587-f1060ad5cd323c4b4e3af9c32c642507.jpg');

-- Create the 'users' table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  googleId VARCHAR(1000),
  facebookId VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert demo users (with different emails to avoid UNIQUE conflict)
INSERT INTO users (firstname, lastname, email, password) VALUES
('Theng', 'Norrint', 'norrint123@gmail.com', '123'),
('Theng', 'Norrint', 'norrint456@gmail.com', '123');
