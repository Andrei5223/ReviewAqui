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

-- Inserindo dados na tabela produto
INSERT INTO produto (nome) VALUES 
('Counter-Strike 2'),
('DRAGON BALL: Sparking! ZERO'),
('EA SPORTS FC™ 25'),
('ELDEN RING'),
('GTA V');

-- Inserindo dados na tabela fonte
INSERT INTO fonte (nome, link, idp) VALUES 
('STEAM', 'https://store.steampowered.com/app/730/CounterStrike_2/', 1),
('STEAM', 'https://store.steampowered.com/app/1790600/DRAGON_BALL_Sparking_ZERO/', 2),
('STEAM', 'https://store.steampowered.com/app/2669320/EA_SPORTS_FC_25/', 3),
('STEAM', 'https://store.steampowered.com/app/1245620/ELDEN_RING/', 4),
('AMAZON', 'https://www.amazon.com.br/Elden-Ring-Padr%C3%A3o-Playstation-5/dp/B097J32ZM9/', 4),
('AMAZON', 'https://www.amazon.com.br/TAKE-TWO-GTA-V/dp/B0B12DV64Y/', 5);

-- Inserindo dados na tabela imagem
INSERT INTO imagem (link, idp) VALUES 
('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1719426374', 1),
('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1790600/header.jpg?t=1728369000', 2),
('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg?t=1727470248', 3),
('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1726158298', 4),
('https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg?t=1726606628', 5);
