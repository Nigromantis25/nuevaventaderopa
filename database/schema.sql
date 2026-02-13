-- 1807.studio - Database Schema for Microsoft SQL Server
-- Script for creating tables and initial sample data

-- 1. Create Database (If not exists)
-- CREATE DATABASE [1807_Studio_DB];
-- GO
-- USE [1807_Studio_DB];
-- GO

-- 2. Drop existing tables if they exist (Order matters due to FK)
IF OBJECT_ID('OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
IF OBJECT_ID('Orders',    'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('Products',  'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Clients',   'U') IS NOT NULL DROP TABLE Clients;
IF OBJECT_ID('Users',     'U') IS NOT NULL DROP TABLE Users;

-- 3. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'vendedor', -- admin, vendedor
    Status BIT DEFAULT 1, -- 1: Active, 0: Inactive
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 4. Products Table
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Category NVARCHAR(50),
    Sku NVARCHAR(50) UNIQUE NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Stock INT DEFAULT 0,
    Description NVARCHAR(MAX),
    ImageURL NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 5. Clients Table
CREATE TABLE Clients (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    OrdersCount INT DEFAULT 0,
    TotalSpent DECIMAL(18,2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 6. Orders Table
CREATE TABLE Orders (
    Id NVARCHAR(20) PRIMARY KEY, -- Using custom string ID like ORD-123
    ClientId INT NULL,
    ClientName NVARCHAR(100), -- Snapshot if client not registered
    ClientEmail NVARCHAR(100),
    Total DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
    OrderDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ClientId) REFERENCES Clients(Id)
);

-- 7. Order Items Table
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId NVARCHAR(20),
    ProductId INT,
    ProductName NVARCHAR(200),
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- 8. Sample Data Seeds
INSERT INTO Users (Name, Email, Password, Role) VALUES 
('Administrador', 'admin@1807.studio', 'admin123', 'admin'),
('Vendedor 1', 'vendedor@1807.studio', 'vendedor123', 'vendedor');

INSERT INTO Products (Name, Category, Sku, Price, Stock, Description, ImageURL) VALUES 
('Elegance Classic Tote', 'Tote', 'ECT-001', 189.99, 15, 'Bolso tote de cuero genuino con acabados en oro.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3'),
('Urban Chic Crossbody', 'Bolso de mano', 'UCC-002', 129.99, 8, 'Crossbody moderno con diseño minimalista.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'),
('Executive Leather Bag', 'Cartera', 'ELB-003', 249.99, 3, 'Cartera ejecutiva premium en cuero italiano.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'),
('Mini Evening Clutch', 'Clutch', 'MEC-004', 89.99, 20, 'Clutch elegante para eventos especiales.', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d');

INSERT INTO Clients (Name, Email, Phone, Address, OrdersCount, TotalSpent) VALUES 
('María García', 'maria@email.com', '+1 234 567 890', 'Calle Principal 123', 5, 850.00),
('Carlos López', 'carlos@email.com', '+1 234 567 891', 'Av. Central 456', 3, 420.00);

-- Note: In a real app, you should use bcrypt for passwords.
-- This script provides the base connection structure for MSSQL.
