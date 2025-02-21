-- CREACION DE TABLAS
DROP DATABASE IF EXISTS insene;
CREATE DATABASE insene;
USE insene;

CREATE TABLE trabajador(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono CHAR(9),
    rol ENUM("Administrador", "Captador", "Comercial", "Coordinador", "Instalador", "Recursos_Humanos", "Tramitador"),
    equipo VARCHAR(30),
    subequipo VARCHAR(30),
    fecha_baja DATETIME, 
	fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE trabajador 
-- MODIFY COLUMN rol ENUM(
--     'Administrador', 'Captador', 'Comercial', 'Coordinador', 
--     'Instalador', 'Recursos_Humanos', 'Tramitador', 'Supervisor'
-- );
DESCRIBE trabajador;

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    telefono CHAR(9) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    dni CHAR(9) UNIQUE,
    iban VARCHAR(34),
    modo_captacion ENUM("Captador", "Telemarketing", "Referido", "Propia"),
    observaciones_cliente VARCHAR(500)
);

DESCRIBE cliente;

CREATE TABLE domicilio (
	id_domicilio INT PRIMARY KEY AUTO_INCREMENT,
    direccion VARCHAR(100) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    id_cliente INT,
    
    CONSTRAINT fk_domicilio_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

DESCRIBE domicilio;

CREATE TABLE financiacion(
	id_financiacion INT PRIMARY KEY AUTO_INCREMENT,
    importe_financiacion DECIMAL(10,2),
    financiera VARCHAR (100),
    numero_cuotas INT,
    importe_cuotas DECIMAL(10,2),
	id_cliente INT,
    
    CONSTRAINT fk_financiacion_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

DESCRIBE financiacion;

CREATE TABLE subvencion(
	id_subvencion INT PRIMARY KEY AUTO_INCREMENT,
    fecha_subvencion DATE, 
    n_habitaciones INT,
    n_aires_acondicionados INT,
    que_usa_ducha VARCHAR(30),
	id_cliente INT,
    
    CONSTRAINT fk_subvencion_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

DESCRIBE subvencion;

CREATE TABLE vivienda (
    id_vivienda INT PRIMARY KEY AUTO_INCREMENT,
    visitada ENUM("Si", "No", "Sin_datos"),
    n_personas INT,
    n_decisores INT,
    tiene_bombona ENUM("Si", "No", "Sin_datos"),
    tiene_gas ENUM("Si","No", "Sin_datos"),
    tiene_termo_electrico ENUM("Si","No", "Sin_datos"),
	tiene_placas_termicas ENUM("Si","No", "Sin_datos"),
	id_domicilio INT,
    instalacion_placas ENUM("Si", "No", "Sin_datos"),
    estructura ENUM('coplanar', 'triangulo', 'pergola', 'bancada', 'doble_triangulo', 'no', 'sinebloc30'),
    
    CONSTRAINT fk_vivienda_id_domicilio FOREIGN KEY (id_domicilio) REFERENCES domicilio(id_domicilio) ON DELETE CASCADE
);

DESCRIBE vivienda;

CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_trabajador INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha_firma DATE NOT NULL,
    forma_pago ENUM('Financiado', 'Transferencia', 'Efectivo') NOT NULL,
    certificado_energetico ENUM('En_cuotas', 'Por_transferencia', 'No') ,
    gestion_subvencion ENUM("Si", "No"),
    gestion_legalizacion ENUM("Si", "No"),
    fecha_legalizacion DATE,
    estado_venta ENUM('Instalada', 'Caída') NOT NULL,
    
    CONSTRAINT fk_venta_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_venta_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CHECK (gestion_legalizacion = "No" OR fecha_legalizacion IS NOT NULL)
);

DESCRIBE venta;

CREATE TABLE instalacion (
    id_instalacion INT PRIMARY KEY AUTO_INCREMENT,
    id_trabajador INT NOT NULL,
    id_vivienda INT NOT NULL,
    id_venta INT NOT NULL,
    fecha_instalacion DATE,
    n_placas INT NOT NULL,
	grua ENUM ("Si", "No"),
    importe_grua DECIMAL(10,2),
    instalador_tipo ENUM('Propio', 'Subcontrata') NOT NULL,
    instalacion_terminada ENUM ("Si", "No") NOT NULL,
    fecha_terminada DATE,
    otros_costes VARCHAR(100),
    observaciones VARCHAR(500),
    
    CONSTRAINT fk_instalacion_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_instalacion_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_instalacion_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    CHECK (grua = 'no' OR importe_grua IS NOT NULL)

);

DESCRIBE instalacion;

CREATE TABLE visita (
	id_visita INT PRIMARY KEY AUTO_INCREMENT,
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    resultado ENUM ("Visitado_pdte_contestación", "Visitado_no_hacen_nada", "Recitar", "No_visita", "Firmada_no_financiable", "Venta"),
	id_vivienda INT,
    id_trabajador INT,
    oferta VARCHAR(200),
    observaciones_visita VARCHAR(500),
    
    CONSTRAINT fk_visita_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_visita_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);

DESCRIBE visita;

CREATE TABLE factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    fecha_factura DATE NOT NULL,
    importe_factura DECIMAL(10,2) NOT NULL,
    id_venta INT NOT NULL,
    
    CONSTRAINT fk_factura_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

DESCRIBE factura;

CREATE TABLE recibo(
	id_recibo INT PRIMARY KEY AUTO_INCREMENT,
    importe_luz DECIMAL(6,2),
	importe_gas DECIMAL(6,2),
    id_vivienda INT,
    
    CONSTRAINT fk_recibo_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

DESCRIBE recibo; 

CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    producto_principal VARCHAR(50) NOT NULL,
    otro_producto VARCHAR(50),
    modelo_placas VARCHAR(20) ,
    cuadro_electrico ENUM('L1', 'M1') ,

    CONSTRAINT fk_producto_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

DESCRIBE producto;

CREATE TABLE caida (
    id_caida INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    motivo_caida ENUM('No_financiable', 'No_se_puede_instalar', 'Cliente_decide_no_instalar', 'Problemas_de_cobro') NOT NULL,
    tramitador_financiera VARCHAR(100),
    financiera VARCHAR(100),
    mes_firma VARCHAR (20),

    CONSTRAINT fk_informe_caida_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

DESCRIBE caida;

-- INSERTS

INSERT INTO trabajador (nombre, contrasena, telefono, rol, equipo, subequipo, fecha_baja, fecha_alta) VALUES
('Ana Pérez', 'clave123', '600123456', 'Coordinador', 'Ventas', 'Equipo Norte', NULL, '2023-01-15'),
('Carlos López', 'pass456', '610234567', 'Instalador', 'Instalaciones', 'Equipo Sur', NULL, '2023-02-20'),
('María Gómez', 'maria789', '620345678','Administrador', 'Administración', 'Oficina Central', '2024-01-10', '2022-12-05'),
('Juan Rodríguez', 'juan2023', '630456789','Captador', 'Ventas', 'Equipo Este', NULL, '2023-03-25'),
('Laura Fernández', 'laura321', '640567890','Instalador', 'Instalaciones', 'Equipo Oeste', NULL, '2023-04-10'),
('David Martínez', 'david000', '650678901','Comercial', 'Ventas', 'Equipo Centro', '2024-02-01', '2023-05-15'),
('Elena Ruiz', 'elena654', '660789012', 'Recursos_Humanos', 'Administración', 'Oficina Central', NULL, '2023-06-20'),
('Javier Sánchez', 'javpass1', '670890123','Instalador', 'Instalaciones', 'Equipo Norte', NULL, '2023-07-30'),
('Sofía Morales', 'sofia555', '680901234','Comercial', 'Ventas', 'Equipo Sur', NULL, '2023-08-12'),
('Pedro Ramírez', 'pedro000', '690123456','Instalador', 'Instalaciones', 'Equipo Este', '2023-12-31', '2023-09-05'),
('Lucía Herrera', 'lucia777', '600234567','Tramitador', 'Administración', 'Oficina Central', NULL, '2023-10-18'),
('Hugo Castro', 'hugo999', '610345678','Comercial', 'Ventas', 'Equipo Oeste', NULL, '2023-11-22'),
('Clara Díaz', 'clara888', '620456789','Instalador', 'Instalaciones', 'Equipo Centro', NULL, '2023-12-01'),
('Iván Moreno', 'ivan1234', '630567890','Comercial', 'Ventas', 'Equipo Norte', NULL, '2024-01-05'),
('Paula Vega', 'paula432', '640678901','Instalador', 'Instalaciones', 'Equipo Sur', NULL, '2024-02-14'),
('Miguel Ortega', 'miguel654', '650789012','Coordinador', 'Administración', 'Oficina Central', NULL, '2024-03-01'),
('Andrea Torres', 'andrea101', '660890123','Captador', 'Ventas', 'Equipo Este', '2024-01-20', '2023-01-20'),
('Diego Paredes', 'diego222', '670901234', 'Instalador', 'Instalaciones', 'Equipo Oeste', NULL, '2024-03-05'),
('Valeria Santos', 'valeria333', '680123456', 'Tramitador', 'Ventas', 'Equipo Centro', NULL, '2024-04-10'),
('Mario Núñez', 'mario444', '690234567', 'Recursos_Humanos', 'Administracion', 'Equipo Norte', NULL, '2024-04-25');

SELECT * FROM trabajador;

INSERT INTO cliente (nombre, telefono, correo, dni, iban, modo_captacion, observaciones_cliente) VALUES
('José Martínez', '611111111', 'jose@example.com', '12345678A', 'ES9121000418450200051332', 'Captador', 'Cliente interesado en energía solar.'),
('María López', '622222222', 'maria@example.com', '22345678B', 'ES9121000418450200051333', 'Telemarketing', 'Busca financiación.'),
('Carlos Ramírez', '633333333', 'carlos@example.com', '32345678C', 'ES9121000418450200051334', 'Referido', 'Cliente satisfecho.'),
('Ana Beltrán', '644444444', 'ana@example.com', '42345678D', 'ES9121000418450200051335', 'Propia', 'Quiere instalación urgente.'),
('Raúl Sánchez', '655555555', 'raul@example.com', '52345678E', 'ES9121000418450200051336', 'Captador', 'Tiene casa grande.'),
('Sofía Castro', '666666666', 'sofia@example.com', '62345678F', 'ES9121000418450200051337', 'Telemarketing', 'Interesada en energía solar.'),
('Diego Pérez', '677777777', 'diego@example.com', '72345678G', 'ES9121000418450200051338', 'Referido', 'Busca ahorro energético.'),
('Lucía Ruiz', '688888888', 'lucia@example.com', '82345678H', 'ES9121000418450200051339', 'Propia', 'Consulta de tarifas.'),
('Pablo Fernández', '699999999', 'pablo@example.com', '92345678I', 'ES9121000418450200051340', 'Captador', 'Interesado en financiación.'),
('Carmen Jiménez', '611000000', 'carmen@example.com', '01345678J', 'ES9121000418450200051341', 'Telemarketing', 'Quiere instalar placas.'),
('Fernando Ortega', '612000000', 'fernando@example.com', '11345678K', 'ES9121000418450200051342', 'Referido', 'Tiene una casa en el campo.'),
('Rosa Vargas', '613000000', 'rosa@example.com', '21345678L', 'ES9121000418450200051343', 'Propia', 'Consulta de instalación.'),
('Mario Medina', '614000000', 'mario@example.com', '31345678M', 'ES9121000418450200051344', 'Captador', 'Busca instalación rápida.'),
('Alicia Vega', '615000000', 'alicia@example.com', '41345678N', 'ES9121000418450200051345', 'Telemarketing', 'Cliente recurrente.'),
('David Castro', '616000000', 'david@example.com', '51345678O', 'ES9121000418450200051346', 'Referido', 'Consulta sobre subvenciones.'),
('Isabel Rojas', '617000000', 'isabel@example.com', '61345678P', 'ES9121000418450200051347', 'Propia', 'Cliente fiel.'),
('Manuel Díaz', '618000000', 'manuel@example.com', '71345678Q', 'ES9121000418450200051348', 'Captador', 'Interesado en bonos.'),
('Patricia Herrera', '619000000', 'patricia@example.com', '81345678R', 'ES9121000418450200051349', 'Telemarketing', 'Quiere financiación.'),
('Javier Gil', '620000000', 'javier@example.com', '91345678S', 'ES9121000418450200051350', 'Referido', 'Tiene segunda residencia.'),
('Eva Alonso', '621000000', 'eva@example.com', '01445678T', 'ES9121000418450200051351', 'Propia', 'Interesada en tarifas verdes.');

SELECT * FROM cliente;

INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES
('Calle Mayor 12', 'Madrid', 'Madrid', 1),
('Avenida Gran Vía 45', 'Barcelona', 'Barcelona', 2),
('Plaza España 5', 'Sevilla', 'Sevilla', 3),
('Calle Real 23', 'Valencia', 'Valencia', 4),
('Paseo del Prado 10', 'Madrid', 'Madrid', 5),
('Avenida Andalucía 7', 'Málaga', 'Málaga', 6),
('Calle Larios 15', 'Málaga', 'Málaga', 7),
('Paseo Marítimo 8', 'A Coruña', 'A Coruña', 8),
('Calle Feria 32', 'Sevilla', 'Sevilla', 9),
('Avenida Libertad 16', 'Zaragoza', 'Zaragoza', 10),
('Calle del Sol 21', 'Bilbao', 'Bizkaia', 11),
('Plaza Mayor 4', 'Salamanca', 'Salamanca', 12),
('Calle Cervantes 9', 'Alicante', 'Alicante', 13),
('Avenida Castilla 14', 'Toledo', 'Toledo', 14),
('Calle Mayor 18', 'Santander', 'Cantabria', 15),
('Calle Luna 3', 'Cádiz', 'Cádiz', 16),
('Avenida del Río 28', 'Granada', 'Granada', 17),
('Calle Jardines 6', 'Valladolid', 'Valladolid', 18),
('Avenida del Mar 30', 'Valencia', 'Valencia', 19),
('Calle Victoria 12', 'Murcia', 'Murcia', 20);

SELECT * FROM domicilio;

INSERT INTO financiacion (importe_financiacion, financiera, numero_cuotas, importe_cuotas, id_cliente) VALUES
(12000.50, 'SOYOU', 48, 250.10, 1),
(8500.00, 'CAIXA', 36, 236.11, 2),
(15000.75, 'CETELEM', 60, 310.50, 3),
(9500.20, 'SABADEL', 48, 210.42, 4),
(11000.00, 'ABANCA', 36, 305.55, 5),
(7000.45, 'BBVA', 24, 312.52, 6),
(13000.90, 'CAJA RURAL', 60, 216.78, 7),
(14500.30, 'SOYOU', 48, 302.45, 8),
(6200.75, 'CAIXA', 36, 185.23, 9),
(9800.10, 'CETELEM', 48, 204.17, 10),
(10500.00, 'SABADEL', 60, 180.25, 11),
(15500.50, 'ABANCA', 48, 325.40, 12),
(8900.80, 'BBVA', 36, 247.24, 13),
(12200.45, 'CAJA RURAL', 60, 203.34, 14),
(13500.70, 'SOYOU', 48, 281.45, 15),
(7500.60, 'CAIXA', 36, 208.34, 16),
(14200.90, 'CETELEM', 60, 236.68, 17),
(11800.10, 'SABADEL', 48, 245.83, 18),
(6800.30, 'ABANCA', 36, 188.89, 19),
(9900.25, 'BBVA', 24, 412.51, 20);

SELECT * FROM financiacion;

INSERT INTO subvencion (fecha_subvencion, n_habitaciones, n_aires_acondicionados, que_usa_ducha, id_cliente) VALUES
('2023-05-10', 3, 1, 'Gas', 1),
('2023-06-15', 4, 2, 'Eléctrico', 2),
('2023-07-20', 2, 1, 'Gas', 3),
('2023-08-05', 5, 3, 'Eléctrico', 4),
('2023-09-10', 3, 2, 'Gas', 5),
('2023-10-25', 4, 1, 'Eléctrico', 6),
('2023-11-30', 2, 1, 'Gas', 7),
('2023-12-15', 3, 3, 'Eléctrico', 8),
('2024-01-10', 4, 2, 'Gas', 9),
('2024-02-20', 3, 1, 'Eléctrico', 10),
('2024-03-25', 5, 3, 'Gas', 11),
('2024-04-05', 4, 2, 'Eléctrico', 12),
('2024-05-10', 3, 1, 'Gas', 13),
('2024-06-15', 2, 1, 'Eléctrico', 14),
('2024-07-20', 4, 3, 'Gas', 15),
('2024-08-25', 3, 2, 'Eléctrico', 16),
('2024-09-30', 5, 1, 'Gas', 17),
('2024-10-15', 4, 2, 'Eléctrico', 18),
('2024-11-20', 3, 1, 'Gas', 19),
('2024-12-05', 4, 3, 'Eléctrico', 20);

SELECT * FROM subvencion;

INSERT INTO vivienda (visitada, n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio, instalacion_placas, estructura) VALUES
('Si', 4, 2, 'No', 'Si', 'Sin_Datos', 'No', 1, 'Si', 'coplanar'),
('No', 3, 1, 'Si', 'No', 'Si', 'No', 2, 'No', 'triangulo'),
('Si', 5, 2, 'No', 'Si', 'No', 'Si', 3, 'Si', 'pergola'),
('Sin_datos', 2, 1, 'Si', 'No', 'Si', 'No', 4, 'No', 'bancada'),
('Si', 3, 2, 'No', 'Si', 'No', 'No', 5, 'Si', 'doble_triangulo'),
('No', 4, 2, 'Si', 'No', 'Si', 'Sin_Datos', 6, 'No', 'sinebloc30'),
('Si', 3, 1, 'No', 'Si', 'No', 'Si', 7, 'Si', 'coplanar'),
('Sin_datos', 2, 1, 'Si', 'No', 'Si', 'No', 8, 'No', 'triangulo'),
('Si', 5, 2, 'No', 'Si', 'No', 'Si', 9, 'Si', 'pergola'),
('No', 3, 1, 'Si', 'No', 'Si', 'No', 10, 'Sin_Datos', 'bancada');

SELECT * FROM vivienda;

INSERT INTO venta (id_trabajador, id_cliente, fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado_venta) VALUES
(1, 1, '2024-01-10', 'Financiado', 'En_cuotas', 'Si', 'Si', '2024-02-15', 'Instalada'),
(2, 2, '2024-02-05', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Caída'),
(3, 3, '2024-01-20', 'Efectivo', 'No', 'Si', 'Si', '2024-03-01', 'Instalada'),
(4, 4, '2024-03-08', 'Financiado', 'En_cuotas', 'Si', 'No', NULL, 'Instalada'),
(5, 5, '2024-04-12', 'Transferencia', 'Por_transferencia', 'No', 'Si', '2024-05-10', 'Caída'),
(6, 6, '2024-05-22', 'Financiado', 'En_cuotas', 'Si', 'Si', '2024-06-18', 'Instalada'),
(7, 7, '2024-06-10', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(8, 8, '2024-07-18', 'Transferencia', 'Por_transferencia', 'Si', 'Si', '2024-08-20', 'Instalada'),
(9, 9, '2024-08-25', 'Financiado', 'En_cuotas', 'No', 'No', NULL, 'Caída'),
(10, 10, '2024-09-05', 'Efectivo', 'No', 'Si', 'Si', '2024-10-15', 'Instalada'),
(11, 11, '2024-10-12', 'Transferencia', 'En_cuotas', 'No', 'No', NULL, 'Caída'),
(12, 12, '2024-11-19', 'Financiado', 'Por_transferencia', 'Si', 'Si', '2024-12-22', 'Instalada'),
(13, 13, '2023-12-28', 'Efectivo', 'No', 'No', 'Si', '2024-01-18', 'Instalada'),
(14, 14, '2024-01-15', 'Financiado', 'En_cuotas', 'Si', 'No', NULL, 'Caída'),
(15, 15, '2024-02-22', 'Transferencia', 'Por_transferencia', 'No', 'Si', '2024-03-15', 'Instalada'),
(16, 16, '2024-03-10', 'Financiado', 'En_cuotas', 'Si', 'Si', '2024-04-18', 'Instalada'),
(17, 17, '2024-04-25', 'Efectivo', 'No','No', 'No', NULL, 'Caída'),
(18, 18, '2024-05-30', 'Transferencia', 'Por_transferencia', 'Si', 'Si', '2024-06-25', 'Instalada'),
(19, 19, '2024-06-12', 'Financiado', 'En_cuotas','No', 'No', NULL, 'Caída'),
(20, 20, '2024-07-05', 'Efectivo', 'No', 'Si', 'Si', '2024-08-15', 'Instalada');

SELECT * FROM venta;

INSERT INTO instalacion (id_trabajador, id_vivienda, id_venta, fecha_instalacion, n_placas, grua, importe_grua, instalador_tipo, instalacion_terminada, fecha_terminada, otros_costes, observaciones) VALUES
(1, 1, 1, '2024-02-20', 12, 'No', NULL, 'Propio', 'Si' , '2024-02-25', '1000.00', 'Instalación completada sin incidencias'),
(2, 2, 3, '2024-03-10', 10, 'Si', 850.00, 'Subcontrata', 'Si', '2024-03-15', '1500.00', 'Necesario uso de grúa'),
(3, 3, 4, '2024-04-05', 14, 'No', NULL, 'Propio', 'Si', '2024-04-10', '0.00', 'Instalación rápida'),
(4, 4, 6, '2024-05-15', 8, 'Si', 750.00, 'Subcontrata', 'Si', '2024-05-20', '600.00', 'Problemas con la estructura'),
(5, 5, 8, '2024-06-18', 16, 'No', NULL, 'Propio', 'Si', '2024-06-25', '0.00', 'Cliente satisfecho'),
(6, 6, 10, '2024-07-01', 9, 'Si', 1200.00, 'Subcontrata', 'Si', '2024-07-10', '1300.00', 'Instalación en azotea complicada'),
(7, 7, 12, '2024-08-12', 11, 'No', NULL, 'Propio', 'Si', '2024-08-18', '0.00', 'Todo en orden'),
(8, 8, 13, '2024-09-20', 13, 'Si', 900.00, 'Subcontrata', 'Si', '2024-09-28', '700.00', 'Uso de grúa imprescindible'),
(9, 9, 15, '2024-10-05', 7, 'No', NULL, 'Propio', 'Si', '2024-10-12', '0.00', 'Sin incidencias'),
(10, 10, 16, '2024-11-15', 12, 'Si', 850.00, 'Subcontrata', 'Si', '2024-11-20', '1100.00', 'Cliente contento con el resultado');

SELECT * FROM instalacion; 

INSERT INTO factura (numero_factura, fecha_factura, importe_factura, id_venta) VALUES
('FAC-2024-001', '2024-02-28', 12500.75, 1),
('FAC-2024-002', '2024-03-12', 9500.50, 3),
('FAC-2024-003', '2024-04-08', 15000.00, 4),
('FAC-2024-004', '2024-05-22', 10200.25, 6),
('FAC-2024-005', '2024-06-25', 9800.75, 8),
('FAC-2024-006', '2024-07-12', 14500.90, 10),
('FAC-2024-007', '2024-08-18', 11000.00, 12),
('FAC-2024-008', '2024-09-28', 13900.60, 13),
('FAC-2024-009', '2024-10-12', 10750.45, 15),
('FAC-2024-010', '2024-11-20', 15800.25, 16);

SELECT * FROM factura;

INSERT INTO producto (id_venta, producto_principal, otro_producto, modelo_placas, cuadro_electrico) VALUES
(1, 'Inversor Solar', 'Batería 5kWh', 'SP-450W', 'L1'),
(3, 'Paneles Monocristalinos', NULL, 'SP-500W', 'M1'),
(4, 'Inversor Híbrido', 'Monitorización', 'SP-460W', 'L1'),
(6, 'Microinversor', 'Batería 10kWh', 'SP-480W', 'M1'),
(8, 'Panel Policristalino', NULL, 'SP-400W', 'L1');

SELECT * FROM factura;

INSERT INTO caida (id_venta, motivo_caida, tramitador_financiera, financiera, mes_firma) VALUES
(2, 'No_financiable', 'Juan Pérez', 'CAIXA', 'Febrero'),
(5, 'Cliente_decide_no_instalar', 'Ana_Gómez', 'SOYOU', 'Abril'),
(7, 'Problemas_de_cobro', 'Carlos_Ruiz', 'BBVA', 'Junio'),
(9, 'No_se_puede_instalar', 'Laura_Díaz', 'CETELEM', 'Agosto'),
(11, 'No_financiable', 'Mario_Sánchez', 'ABANCA', 'Octubre');

SELECT * FROM caida;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;