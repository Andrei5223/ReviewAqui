CREATE DATABASE reviewaki;

\c reviewaki

CREATE TABLE pessoa (
email VARCHAR(51) NOT NULL PRIMARY KEY,  
nome VARCHAR(51) NOT NULL,
senha VARCHAR(251) NOT NULL
);

--insert into pessoa (nome, email, senha) values ('Andrei', 'andrei.teste@gmail.com', '1234');