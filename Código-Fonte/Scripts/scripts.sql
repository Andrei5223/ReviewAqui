CREATE DATABASE reviewaki;

\c reviewaki

CREATE TABLE pessoa (
    email VARCHAR(51) NOT NULL PRIMARY KEY,  
    nome VARCHAR(51) NOT NULL,
    senha VARCHAR(251) NOT NULL
);

CREATE TABLE produto (
    idp SERIAL PRIMARY KEY,  
    nome VARCHAR(51) NOT NULL
);

CREATE TABLE fonte (
    idf SERIAL PRIMARY KEY,  
    nome VARCHAR(51) NOT NULL,
    link VARCHAR(501) NOT NULL,
    idp INT,
    CONSTRAINT fk_produto FOREIGN KEY (idp) REFERENCES produto(idp)
);

CREATE TABLE imagem (
    idi SERIAL PRIMARY KEY,  
    link VARCHAR(501) NOT NULL,
    idp INT,
    CONSTRAINT fk_produto FOREIGN KEY (idp) REFERENCES produto(idp)
);
