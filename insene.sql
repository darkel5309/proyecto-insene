-- CREACION DE TABLAS
DROP DATABASE IF EXISTS insene;
CREATE DATABASE insene;
USE insene;

CREATE TABLE trabajador(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono CHAR(9),
    puesto ENUM("Administrador", "Administrativo", "Captador", "CEO", "Comercial", "Coordinador", "Ingeniero", "Instalador", "Limpiador", "Mozo_almacen", "RRHH", "Tramitador"),
    departamento ENUM("Administracion", "Comercial", "Gerencia", "Instalaciones", "Limpieza", "RRHH"),
    equipo VARCHAR(100) NULL, 
	fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_baja DATETIME
);

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    telefono CHAR(9) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    dni CHAR(9) UNIQUE,
    iban VARCHAR(34),
    modo_captacion ENUM("Captador", "Telemarketing", "Referido", "Propia"),
    observaciones_cliente VARCHAR(500),
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE domicilio (
	id_domicilio INT PRIMARY KEY AUTO_INCREMENT,
    direccion VARCHAR(100) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    id_cliente INT,
    
    CONSTRAINT fk_domicilio_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE financiacion(
	id_financiacion INT PRIMARY KEY AUTO_INCREMENT,
    importe_financiacion DECIMAL(10,2),
    financiera VARCHAR (100),
    numero_cuotas INT,
    importe_cuotas DECIMAL(10,2),
	id_cliente INT,
    
    CONSTRAINT fk_financiacion_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE subvencion(
	id_subvencion INT PRIMARY KEY AUTO_INCREMENT,
    fecha_subvencion DATE, 
    n_habitaciones INT,
    n_aires_acondicionados INT,
    que_usa_ducha VARCHAR(30),
	id_cliente INT,
    
    CONSTRAINT fk_subvencion_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

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

CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_trabajador INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha_firma DATE,
    forma_pago ENUM('Financiado', 'Transferencia', 'Efectivo') NULL,
    certificado_energetico ENUM('En_cuotas', 'Por_transferencia', 'No') NULL,
    gestion_subvencion ENUM("Si", "No") NULL,
    gestion_legalizacion ENUM("Si", "No") NULL,
    fecha_legalizacion DATE,
    estado_venta ENUM('Instalada', 'Caída', 'Pendiente') NOT NULL DEFAULT 'Pendiente',
    
    CONSTRAINT fk_venta_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_venta_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

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

CREATE TABLE visita (
	id_visita INT PRIMARY KEY AUTO_INCREMENT,
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    resultado ENUM ("Visitado_pdte_contestacion", "Visitado_no_hacen_nada", "Recitar", "No_visita", "Firmada_no_financiable", "Venta"),
	id_vivienda INT,
    id_trabajador INT,
    oferta VARCHAR(200),
    observaciones_visita VARCHAR(500),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_visita_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_visita_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);

CREATE TABLE factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    fecha_factura DATE NOT NULL,
    importe_factura DECIMAL(10,2) NOT NULL,
    id_venta INT NOT NULL,
    
    CONSTRAINT fk_factura_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

CREATE TABLE recibo(
	id_recibo INT PRIMARY KEY AUTO_INCREMENT,
    importe_luz DECIMAL(6,2),
	importe_gas DECIMAL(6,2),
    id_vivienda INT,
    
    CONSTRAINT fk_recibo_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    producto_principal VARCHAR(50) NOT NULL,
    otro_producto VARCHAR(50),
    modelo_placas VARCHAR(20) ,
    cuadro_electrico ENUM('L1', 'M1') ,

    CONSTRAINT fk_producto_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

CREATE TABLE caida (
    id_caida INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    motivo_caida ENUM('No_financiable', 'No_se_puede_instalar', 'Cliente_decide_no_instalar', 'Problemas_de_cobro') NOT NULL,
    tramitador_financiera VARCHAR(100),
    financiera VARCHAR(100),
    mes_firma VARCHAR (20),

    CONSTRAINT fk_informe_caida_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

CREATE TABLE agenda (
    id_agenda INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(255),
	descripcion VARCHAR(255),
    fecha_inicio_agenda DATETIME NOT NULL,
    fecha_fin_agenda DATETIME NOT NULL,
    id_trabajador INT NOT NULL,
    id_vivienda INT NOT NULL,
    estado ENUM('Pendiente', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_agenda_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_agenda_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda)
);

CREATE TABLE auditoria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_trabajador INT,
  descripcion VARCHAR(255) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERTS

INSERT INTO trabajador (nombre, contrasena, telefono, puesto, departamento, equipo) VALUES
('Ángel Domínguez Rodríguez', '$2b$10$lE.pJalVEqJY/DSoz3JJ5.xSYJfL8j.kAo1DZk6cmOLIlLc8n66jq', '600123456', 'Administrador', 'Administracion', null),
('Margarita Gandul Pedregal', '$2b$10$CeEelXZmSL0lnsW.IknTmeQ.uBzpOqO/Bryud6xIaPJEQqT4IkD52', '600123457', 'Administrador', 'Administracion', null),
('Luis Martínez García', '$2b$10$8Dif/bogeC9Vjq/EvJtD1OF8dzcQnujObXHhQqJl/rsg3ORfhr9bO', '635987898', 'Instalador', 'Instalaciones', null),
('Manuel Sánchez Fernández', '$2b$10$xL..Tlf6tFFvLB/bODL06uPzxOaX7Bd6aGhqEHIdk5p7GlIcyNDQG', '600123459', 'Coordinador', 'Comercial', null),
('Marta Rodríguez González', '$2b$10$80T56A271ZxKVmDtfFT3K.nnQJd1PEHkIjxkdQ6y5pPJ7mjq1xWiW', '600123460', 'Comercial', 'Comercial', 'Manuel'),
('Carlos Torres Rodríguez', '$2b$10$8geOtrV/i/XLd0ZiMKWR1OwbJdvN1yqhkrJuW9tLn6neWq8m2e2yi', '600123461', 'RRHH', 'RRHH', null),
('Isabel Díaz López', '$2b$10$FSWMzFXdudlB40l64g7K0eRKWRuXkGDt8d/I51./qoBW58XMkOnZ.', '600123462', 'Tramitador', 'Administracion', null),
('José Pérez Martínez', '$2b$10$w1nuLXy8LIGOA/8xqcMyeegN.hm4KSJX35RRjqpeDBIyUIgXcLcXu', '600123463', 'Comercial', 'Comercial', 'Manuel'),
('Laura López Sánchez', '$2b$10$6.1.3mtu7EmUZoVrem0fauv7uAAGqlKX0ftVYly3Pw.jK3Z1CJdPy', '600123464', 'Instalador', 'Instalaciones', null),
('Javier González', '$2b$10$GC.hWE/pwi7etgEYGqXz7OB77XBJ5WixsvFh5weVqseFiyvD4daRe', '600123465', 'Captador', 'Comercial', 'Jesús'),
('Jesús Molina López', '$2b$10$GC.hWE/pwi7etgEYGqXz7OB77XBJ5WixsvFh5weVqseFiyvD4daRe', '600123466', 'Coordinador', 'Comercial', null),
('Sofía Hernández Pérez', '$2b$10$abCD12345678examplepass1', '600123467', 'Administrador', 'Administracion', null),
('Andrés Martínez Gómez', '$2b$10$abCD12345678examplepass2', '600123468', 'RRHH', 'RRHH', null),
('Nuria Gutiérrez Díaz', '$2b$10$abCD12345678examplepass3', '600123469', 'Tramitador', 'Administracion', null),
('Pablo Ruiz Navarro', '$2b$10$abCD12345678examplepass4', '600123470', 'Instalador', 'Instalaciones', null),
('Clara Moreno Moreno', '$2b$10$abCD12345678examplepass5', '600123471', 'Comercial', 'Comercial', 'Manuel'),
('Hugo Navarro Molina', '$2b$10$abCD12345678examplepass6', '600123472', 'Captador', 'Comercial', 'Jesús'),
('Eva Romero Castro', '$2b$10$abCD12345678examplepass7', '600123473', 'Coordinador', 'Comercial', null),
('Daniel Ortega Serrano', '$2b$10$abCD12345678examplepass8', '600123474', 'Instalador', 'Instalaciones', null),
('Patricia Vega Campos', '$2b$10$abCD12345678examplepass9', '600123475', 'Tramitador', 'Administracion', null),
('Raúl Torres Montes', '$2b$10$abCD12345678examplepass0', '600123476', 'Comercial', 'Comercial', 'Romero');

SELECT * FROM trabajador;

INSERT INTO cliente (nombre, telefono, correo, dni, iban, modo_captacion, observaciones_cliente) VALUES
('Juan García Pardo', '600111111', 'juan@gmail.com', '12345678A', 'ES1234567890123456789012', 'Captador', 'Cliente reciente'),
('Ana Rodríguez Alegre', '600111112', 'ana@gmail.com', '23456789B', 'ES2234567890123456789012', 'Telemarketing', 'Cliente de larga data'),
('Luis Fernández Largo', '600111113', 'luis@gmail.com', '34567890C', 'ES3234567890123456789012', 'Referido', 'Interés en productos energéticos'),
('Pedro Jiménez Cortés', '600111114', 'pedro@hotmail.com', '45678901D', 'ES4234567890123456789012', 'Propia', 'Consulta inicial'),
('Marta López Calvo', '600111115', 'marta@gmail.com', '56789012E', 'ES5234567890123456789012', 'Captador', 'Solicitó información adicional'),
('Carlos Jiménez Delgado', '600111116', 'carlos@gmail.com', '67890123F', 'ES6234567890123456789012', 'Telemarketing', 'Cliente en espera'),
('Isabel Martínez Sastre', '600111117', 'isabel@gmail.com', '78901234G', 'ES7234567890123456789012', 'Referido', 'Solicitó presupuesto'),
('José Pérez Rubio', '600111118', 'jose@hotmail.com', '89012345H', 'ES8234567890123456789012', 'Propia', 'Sin interés por ahora'),
('Laura Gómez Moreno', '600111119', 'laura@hotmail.com', '90123456I', 'ES9234567890123456789012', 'Captador', 'Recibió llamada informativa'),
('Raúl López Carpintero', '600111120', 'raul@gmail.com', '01234567J', 'ES0234567890123456789012', 'Telemarketing', 'Posible cliente futuro'),
('Sofía Morales Barbero', '600111121', 'sofia@gmail.com', '11223344A', 'ES1034567890123456789012', 'Referido', 'Interesada en energía solar'),
('Diego Sánchez Calderón', '600111122', 'diego@hotmail.com', '22334455B', 'ES2034567890123456789012', 'Captador', 'Quiere reducir factura de luz'),
('Lucía Torres Ferrer', '600111123', 'lucia@gmail.com', '33445566C', 'ES3034567890123456789012', 'Propia', 'Vivienda con buena orientación solar'),
('Daniel Ramírez Pastor', '600111124', 'daniel@gmail.com', '44556677D', 'ES4034567890123456789012', 'Telemarketing', 'Solicita visita presencial'),
('Carmen Ruiz Rubio', '600111125', 'carmen@hotmail.com', '55667788E', 'ES5034567890123456789012', 'Captador', 'Interesada en placas y baterías'),
('Andrés Molina Rivera', '600111126', 'andres@gmail.com', '66778899F', 'ES6034567890123456789012', 'Referido', 'Cliente informado por vecino'),
('Eva Herrera Serrano', '600111127', 'eva@hotmail.com', '77889900G', 'ES7034567890123456789012', 'Propia', 'Quiere estudiar viabilidad del proyecto'),
('Alejandro Gil Campos', '600111128', 'alejandro@gmail.com', '88990011H', 'ES8034567890123456789012', 'Telemarketing', 'Pidió presupuesto detallado'),
('María Navarro Campos', '600111129', 'maria@gmail.com', '99001122I', 'ES9034567890123456789012', 'Captador', 'Solicitud recibida en feria local'),
('Pablo Ortega Moreno', '600111130', 'pablo@hotmail.com', '00112233J', 'ES0134567890123456789012', 'Referido', 'Amigo de un cliente satisfecho');

SELECT * FROM cliente;

INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES
('Calle Falsa, 123', 'Aranjuez', 'Madrid', 1),
('Avenida del Sol, 456', 'Sitges', 'Barcelona', 2),
('Calle Real, 789', 'Serra', 'Valencia', 3),
('Calle Luna, 101', 'Mairena del Alcor', 'Sevilla', 4),
('Calle Estrella, 202', 'Tarazona', 'Zaragoza', 5),
('Calle Verde, 303', 'Mula', 'Murcia', 6),
('Calle Azul, 404', 'Bilbao', 'Vizcaya', 7),
('Calle Viento, 505', 'Pampaneira', 'Granada', 8),
('Calle Mar, 606', 'Frigiliana', 'Málaga', 9),
('Calle Río, 707', 'La Alberca', 'Salamanca', 10),
('Calle Nube, 808', 'Baiona', 'Pontevedra', 11),
('Avenida Brisa, 909', 'Luarca', 'Asturias', 12),
('Calle Solana, 1010', 'Olite', 'Navarra', 13),
('Camino del Bosque, 1111', 'Ezcaray', 'La Rioja', 14),
('Calle del Lago, 1212', 'Comillas', 'Cantabria', 15),
('Travesía Norte, 1313', 'Altea', 'Alicante', 16),
('Calle Horizonte, 1414', 'Mojácar', 'Almería', 17),
('Paseo de las Flores, 1515', 'Vejer de la Frontera', 'Cádiz', 18),
('Avenida del Valle, 1616', 'Albarracín', 'Teruel', 19),
('Calle del Mirador, 1717', 'Candelaria', 'Santa Cruz de Tenerife', 20);

SELECT * FROM domicilio;

INSERT INTO vivienda (visitada, n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio, instalacion_placas, estructura) VALUES
('Si', 3, 2, 'Si', 'Si', 'Si', 'No', 1, 'Si', 'coplanar'),
('No', 4, 3, 'No', 'Si', 'No', 'Si', 2, 'No', 'triangulo'),
('Si', 2, 1, 'Si', 'No', 'Si', 'No', 3, 'Si', 'pergola'),
('No', 5, 4, 'No', 'Si', 'Si', 'Si', 4, 'No', 'bancada'),
('Si', 6, 2, 'Si', 'No', 'Si', 'No', 5, 'Si', 'doble_triangulo'),
('No', 3, 2, 'No', 'Si', 'No', 'No', 6, 'No', 'no'),
('Si', 2, 1, 'Si', 'No', 'Si', 'Si', 7, 'Si', 'sinebloc30'),
('Si', 4, 3, 'Si', 'Si', 'No', 'No', 8, 'No', 'coplanar'),
('No', 5, 3, 'No', 'No', 'Si', 'No', 9, 'No', 'triangulo'),
('Si', 3, 2, 'Si', 'Si', 'No', 'Si', 10, 'Si', 'pergola'),
('Si', 4, 2, 'No', 'Si', 'Si', 'No', 11, 'Si', 'coplanar'),
('No', 3, 1, 'Si', 'No', 'No', 'No', 12, 'No', 'triangulo'),
('Si', 2, 2, 'No', 'Si', 'Si', 'Si', 13, 'Si', 'bancada'),
('Si', 5, 3, 'Si', 'Si', 'No', 'No', 14, 'No', 'doble_triangulo'),
('No', 1, 1, 'No', 'No', 'Si', 'No', 15, 'Si', 'pergola'),
('Si', 6, 2, 'Si', 'Si', 'Si', 'Si', 16, 'Si', 'sinebloc30'),
('No', 3, 2, 'No', 'No', 'No', 'No', 17, 'No', 'coplanar'),
('Si', 4, 3, 'Si', 'No', 'Si', 'Si', 18, 'Si', 'triangulo'),
('No', 2, 1, 'Si', 'Si', 'No', 'No', 19, 'No', 'no'),
('Si', 5, 4, 'No', 'Si', 'Si', 'No', 20, 'Si', 'bancada');

SELECT * FROM vivienda;

INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES
(50.00, 30.00, 1),
(60.00, 35.00, 2),
(45.00, 28.00, 3),
(55.00, 32.00, 4),
(70.00, 40.00, 5),
(65.00, 38.00, 6),
(72.00, 41.00, 7),
(58.00, 36.00, 8),
(48.00, 31.00, 9),
(62.00, 37.00, 10),
(53.00, 33.00, 11),
(47.50, 29.00, 12),
(61.00, 39.00, 13),
(56.75, 34.50, 14),
(49.00, 27.00, 15),
(73.25, 42.00, 16),
(44.00, 26.00, 17),
(59.50, 37.50, 18),
(46.00, 30.00, 19),
(68.00, 41.50, 20);

SELECT * FROM recibo;

INSERT INTO visita (fecha, hora, resultado, id_vivienda, id_trabajador, oferta, observaciones_visita) VALUES
('2025-02-27', '10:00', 'Visitado_pdte_contestacion', 1, 5, 'Solar', 'Cliente interesado en la instalación'),
('2025-02-28', '11:00', 'No_visita', 2, 8, 'No disponible', 'No se pudo contactar al cliente'),
('2025-03-01', '12:00', 'Venta', 3, 16, 'Energía solar fotovoltaica', 'Contrato firmado y pago realizado'),
('2025-03-02', '13:00', 'Recitar', 4, 21, 'Luz solar y térmica', 'Cliente solicitó más información'),
('2025-03-03', '14:00', 'Visitado_no_hacen_nada', 5, 5, 'Eficiencia energética', 'El cliente no mostró interés'),
('2025-03-04', '15:00', 'Firmada_no_financiable', 6, 8, 'Instalación con financiación', 'Cliente no aceptó la propuesta de financiación'),
('2025-03-05', '16:00', 'Visitado_pdte_contestacion', 7, 16, 'Placas solares', 'Esperando respuesta del cliente'),
('2025-03-06', '17:00', 'Venta', 8, 21, 'Energía renovable', 'Venta realizada, instalación programada'),
('2025-03-07', '18:00', 'No_visita', 9, 5, 'No disponible', 'El cliente no estaba en casa'),
('2025-03-08', '19:00', 'Visitado_no_hacen_nada', 10, 8, 'Sistemas térmicos', 'No hubo interés en la propuesta'),
('2025-03-09', '10:30', 'Venta', 11, 16, 'Solar + batería', 'Venta cerrada con sistema de almacenamiento'),
('2025-03-10', '11:15', 'Visitado_pdte_contestacion', 12, 21, 'Fotovoltaica básica', 'Cliente pidió tiempo para pensarlo'),
('2025-03-11', '12:45', 'Recitar', 13, 5, 'Placas térmicas', 'Solicita presupuesto detallado'),
('2025-03-12', '13:30', 'Visitado_no_hacen_nada', 14, 8, 'Autoconsumo', 'Cliente sin interés real'),
('2025-03-13', '14:00', 'Firmada_no_financiable', 15, 16, 'Pack eficiencia energética', 'Ingreso insuficiente para financiación'),
('2025-03-14', '15:20', 'No_visita', 16, 21, 'No disponible', 'Cliente ausente a la hora pactada'),
('2025-03-15', '16:45', 'Venta', 17, 5, 'Solar completa', 'Firma realizada con instalación urgente'),
('2025-03-16', '17:30', 'Visitado_pdte_contestacion', 18, 8, 'Kit solar compacto', 'Duda entre dos ofertas'),
('2025-03-17', '18:10', 'No_visita', 19, 16, 'No disponible', 'Dirección errónea'),
('2025-03-18', '19:00', 'Venta', 20, 21, 'Pack solar + térmico', 'Firma realizada sin financiación');

SELECT * FROM visita;

INSERT INTO financiacion (importe_financiacion, financiera, numero_cuotas, importe_cuotas, id_cliente) VALUES
(5000.00, 'Financiera A', 12, 450.00, 1),
(6000.00, 'Financiera B', 18, 400.00, 2),
(7000.00, 'Financiera C', 24, 350.00, 3),
(8000.00, 'Financiera D', 30, 300.00, 4),
(4000.00, 'Financiera E', 6, 670.00, 5),
(5500.00, 'Financiera F', 12, 475.00, 6),
(6500.00, 'Financiera G', 18, 375.00, 7),
(9000.00, 'Financiera H', 24, 375.00, 8),
(7500.00, 'Financiera I', 30, 250.00, 9),
(8500.00, 'Financiera J', 18, 475.00, 10),
(6200.00, 'Financiera K', 24, 310.00, 11),
(7300.00, 'Financiera L', 18, 405.56, 12),
(4800.00, 'Financiera M', 12, 420.00, 13),
(9100.00, 'Financiera N', 30, 303.33, 14),
(5600.00, 'Financiera O', 18, 311.11, 15),
(7700.00, 'Financiera P', 24, 320.83, 16),
(8400.00, 'Financiera Q', 12, 700.00, 17),
(6950.00, 'Financiera R', 18, 386.11, 18),
(5100.00, 'Financiera S', 6, 850.00, 19),
(8700.00, 'Financiera T', 24, 362.50, 20);

SELECT * FROM financiacion;

INSERT INTO subvencion (fecha_subvencion, n_habitaciones, n_aires_acondicionados, que_usa_ducha, id_cliente)
VALUES
('2025-02-01', 3, 1, 'Eléctrica', 1),
('2025-02-02', 4, 2, 'Solar', 2),
('2025-02-03', 2, 1, 'Eléctrica', 3),
('2025-02-04', 3, 1, 'Eléctrica', 4),
('2025-02-05', 5, 3, 'Solar', 5),
('2025-02-06', 4, 1, 'Eléctrica', 6),
('2025-02-07', 3, 1, 'Eléctrica', 7),
('2025-02-08', 2, 2, 'Solar', 8),
('2025-02-09', 3, 1, 'Eléctrica', 9),
('2025-02-10', 4, 1, 'Solar', 10),
('2025-03-11', 3, 2, 'Eléctrica', 11),
('2025-03-12', 4, 1, 'Solar', 12),
('2025-03-13', 2, 1, 'Eléctrica', 13),
('2025-03-14', 3, 3, 'Solar', 14),
('2025-03-15', 5, 2, 'Eléctrica', 15),
('2025-03-16', 4, 1, 'Solar', 16),
('2025-03-17', 3, 1, 'Eléctrica', 17),
('2025-03-18', 2, 2, 'Solar', 18),
('2025-03-19', 3, 1, 'Eléctrica', 19),
('2025-03-20', 4, 3, 'Solar', 20);

SELECT * FROM subvencion;

INSERT INTO venta (id_trabajador, id_cliente, fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado_venta) VALUES
(5, 1, '2025-01-15', 'Financiado', 'En_cuotas', 'Si', 'No', NULL, 'Instalada'),
(8, 2, '2025-02-18', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Caída'),
(17, 3, '2025-02-20', 'Efectivo', 'No', 'Si', 'Si', '2025-03-01', 'Instalada'),
(5, 4, '2025-02-22', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-02', 'Instalada'),
(8, 5, '2025-01-25', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(17, 6, '2025-02-10', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Instalada'),
(17, 7, '2025-03-05', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-03', 'Instalada'),
(18, 8, '2025-03-10', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(5, 9, '2025-03-15', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Instalada'),
(17, 10, '2025-02-28', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-04', 'Instalada'),
(5, 11, '2025-03-20', 'Efectivo', 'No', 'No', 'Si', '2025-03-25', 'Instalada'),
(8, 12, '2025-03-22', 'Transferencia', 'Por_transferencia', 'Si', 'No', NULL, 'Instalada'),
(17, 13, '2025-03-23', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-30', 'Instalada'),
(18, 14, '2025-03-24', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(5, 15, '2025-03-25', 'Transferencia', 'Por_transferencia', 'No', 'Si', '2025-04-01', 'Instalada'),
(8, 16, '2025-03-26', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-04-02', 'Instalada'),
(17, 17, '2025-03-27', 'Efectivo', 'No', 'No', 'No', NULL, 'Instalada'),
(18, 18, '2025-03-28', 'Transferencia', 'Por_transferencia', 'Si', 'No', NULL, 'Caída'),
(5, 19, '2025-03-29', 'Financiado', 'En_cuotas', 'No', 'Si', '2025-04-05', 'Instalada'),
(8, 20, '2025-03-30', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(8, 20, NULL, NULL, NULL, NULL, NULL, NULL, 'Pendiente');

SELECT * FROM venta;

INSERT INTO instalacion (id_trabajador, id_vivienda, id_venta, fecha_instalacion, n_placas, grua, importe_grua, instalador_tipo, instalacion_terminada, fecha_terminada, otros_costes, observaciones) VALUES
(3, 1, 1, '2025-01-20', 5, 'Si', 200.00, 'Propio', 'Si', '2025-01-21', 'Ninguno', 'Instalación realizada sin problemas'),
(9, 2, 2, '2025-02-21', 6, 'No', NULL, 'Subcontrata', 'No', NULL , NULL, 'Falta completar'),
(16, 3, 3, '2025-02-22', 8, 'Si', 150.00, 'Propio', 'Si', '2025-02-23', 'Costo adicional', 'Placas de mayor capacidad instaladas'),
(20, 4, 4, '2025-02-24', 7, 'No', NULL, 'Propio', 'Si', '2025-02-25', 'Ninguno', 'Instalación terminada con éxito'),
(3, 5, 5, '2025-01-27', 10, 'Si', 250.00, 'Subcontrata', 'No', NULL,'Costos adicionales en mano de obra', 'Requiere revisión de algunos detalles'),
(9, 6, 6, '2025-02-26', 9, 'No', NULL, 'Propio', 'Si', '2025-02-27', 'Sin otros costes', 'Instalación completa'),
(16, 7, 7, '2025-03-01', 5, 'No', NULL, 'Subcontrata', 'No', NULL, NULL , 'Incompleta'),
(20, 8, 8, '2025-03-02', 4, 'Si', 300.00, 'Propio', 'Si', '2025-03-03', 'Sin costes adicionales', 'Instalación lista para funcionamiento'),
(3, 9, 9, '2025-03-05', 6, 'No', NULL, 'Subcontrata', 'Si', '2025-03-06', 'Sin otros costes', 'Instalación en perfectas condiciones'),
(9, 10, 10, '2025-03-07', 3, 'No', NULL, 'Propio', 'Si', '2025-03-08', 'Ninguno', 'Trabajo finalizado'),
(16, 11, 11, '2025-03-10', 7, 'No', NULL, 'Propio', 'Si', '2025-03-11', 'Ninguno', 'Instalación rápida y sin incidencias'),
(3, 12, 12, '2025-03-12', 5, 'Si', 220.00, 'Subcontrata', 'No', NULL, 'Coste extra por condiciones del terreno', 'Cliente satisfecho con el progreso'),
(9, 13, 13, '2025-03-13', 8, 'No', NULL, 'Propio', 'Si', '2025-03-14', 'Sin costes adicionales', 'Todo conforme al plan'),
(20, 14, 14, '2025-03-14', 6, 'Si', 180.00, 'Subcontrata', 'Si', '2025-03-15', 'Costo grúa incluido', 'Instalación completa y certificada'),
(16, 15, 15, '2025-03-15', 9, 'No', NULL, 'Propio', 'No', NULL, NULL, 'Pendiente revisión final'),
(3, 16, 16, '2025-03-16', 4, 'Si', 210.00, 'Subcontrata', 'Si', '2025-03-17', 'Ninguno', 'Buen resultado y cliente contento'),
(9, 17, 17, '2025-03-17', 7, 'No', NULL, 'Propio', 'Si', '2025-03-18', 'Sin costes adicionales', 'Instalación en perfecto estado'),
(20, 18, 18, '2025-03-18', 5, 'No', NULL, 'Subcontrata', 'No', NULL, 'Problema con el acceso a la vivienda', 'Pendiente resolver'),
(16, 19, 19, '2025-03-19', 6, 'Si', 190.00, 'Propio', 'Si', '2025-03-20', 'Costo de grúa justificado', 'Instalación realizada sin contratiempos'),
(3, 20, 20, '2025-03-20', 8, 'No', NULL, 'Subcontrata', 'Si', '2025-03-21', 'Sin otros costes', 'Cliente satisfecho con la instalación');

SELECT * FROM instalacion;

INSERT INTO factura (numero_factura, fecha_factura, importe_factura, id_venta) VALUES
('FAC-001', '2025-02-01', 5000.00, 1),
('FAC-002', '2025-02-02', 6000.00, 2),
('FAC-003', '2025-02-05', 7000.00, 3),
('FAC-004', '2025-02-10', 8000.00, 4),
('FAC-005', '2025-02-15', 4000.00, 5),
('FAC-006', '2025-02-18', 5500.00, 6),
('FAC-007', '2025-02-20', 6500.00, 7),
('FAC-008', '2025-02-25', 9000.00, 8),
('FAC-009', '2025-03-01', 7500.00, 9),
('FAC-010', '2025-03-03', 8500.00, 10),
('FAC-011', '2025-03-05', 7200.00, 11),
('FAC-012', '2025-03-06', 6300.00, 12),
('FAC-013', '2025-03-07', 5400.00, 13),
('FAC-014', '2025-03-08', 8100.00, 14),
('FAC-015', '2025-03-09', 4700.00, 15),
('FAC-016', '2025-03-10', 5800.00, 16),
('FAC-017', '2025-03-11', 6600.00, 17),
('FAC-018', '2025-03-12', 7700.00, 18),
('FAC-019', '2025-03-13', 6900.00, 19),
('FAC-020', '2025-03-14', 8300.00, 20);

SELECT * FROM factura;

INSERT INTO producto (id_venta, producto_principal, otro_producto, modelo_placas, cuadro_electrico) VALUES
(1, 'Placas solares', 'Batería', 'Modelo X', 'L1'),
(2, 'Termo eléctrico', 'Batería', 'Modelo Y', 'M1'),
(3, 'Placas solares', 'Batería', 'Modelo Z', 'L1'),
(4, 'Termo eléctrico', 'Placas solares', 'Modelo A', 'M1'),
(5, 'Placas solares', 'Batería', 'Modelo B', 'L1'),
(6, 'Termo eléctrico', 'Placas solares', 'Modelo C', 'M1'),
(7, 'Placas solares', 'Batería', 'Modelo D', 'L1'),
(8, 'Termo eléctrico', 'Batería', 'Modelo E', 'M1'),
(9, 'Placas solares', 'Batería', 'Modelo F', 'L1'),
(10, 'Termo eléctrico', 'Placas solares', 'Modelo G', 'M1'),
(11, 'Placas solares', 'Batería', 'Modelo H', 'M1'),
(12, 'Termo eléctrico', 'Batería', 'Modelo I', 'L1'),
(13, 'Placas solares', 'Batería', 'Modelo J', 'M1'),
(14, 'Termo eléctrico', 'Placas solares', 'Modelo K', 'M1'),
(15, 'Placas solares', 'Batería', 'Modelo L', 'L1'),
(16, 'Termo eléctrico', 'Placas solares', 'Modelo M', 'M1'),
(17, 'Placas solares', 'Batería', 'Modelo N', 'L1'),
(18, 'Termo eléctrico', 'Batería', 'Modelo O', 'M1'),
(19, 'Placas solares', 'Batería', 'Modelo P', 'L1'),
(20, 'Termo eléctrico', 'Placas solares', 'Modelo Q', 'M1');

SELECT * FROM producto;

INSERT INTO caida (id_venta, motivo_caida, tramitador_financiera, financiera, mes_firma) VALUES
(2, 'No_financiable', 'Ana Sánchez', 'Financiera A', 'Febrero'),
(5, 'Cliente_decide_no_instalar', 'Pedro Martínez', 'Financiera B', 'Enero'),
(8, 'Problemas_de_cobro', 'Luis González', 'Financiera C', 'Marzo'),
(14, 'No_se_puede_instalar', 'Isabel Ruiz', 'Financiera D', 'Marzo'),
(18, 'No_financiable', 'Carlos López', 'Financiera E', 'Marzo');

SELECT * FROM caida;

INSERT INTO agenda (titulo, descripcion, fecha_inicio_agenda, fecha_fin_agenda, id_trabajador, id_vivienda) VALUES 
('Visita a casa 1', 'Primera visita a la vivienda para evaluación inicial', '2025-05-14 10:00:00', '2025-05-14 11:00:00', 5, 1),
('Visita a casa 2', 'Inspección presencial para recopilar datos del proyecto', '2025-05-23 16:00:00', '2025-05-23 17:00:00', 8, 2),
('Visita a casa 3', 'Revisión técnica en el domicilio del cliente', '2025-05-09 09:00:00', '2025-05-09 10:00:00', 16, 3),
('Visita a casa 4', 'Análisis del tejado y orientación para instalación', '2025-05-09 17:00:00', '2025-05-09 18:00:00', 21, 4),
('Visita a casa 5', 'Reunión en domicilio para ver viabilidad de placas', '2025-05-05 11:30:00', '2025-05-05 12:30:00', 5, 5),
('Visita a casa 6', 'Comprobación de espacio disponible para instalación', '2025-05-14 15:00:00', '2025-05-14 16:00:00', 8, 6),
('Visita a casa 7', 'Mediciones en tejado para estructura recomendada', '2025-05-26 10:00:00', '2025-05-26 11:30:00', 16, 7),
('Visita a casa 8', 'Verificación de condiciones de instalación', '2025-05-26 13:00:00', '2025-05-26 14:00:00', 21, 8),
('Visita a casa 9', 'Evaluación de necesidades energéticas en casa', '2025-05-27 09:30:00', '2025-05-27 10:30:00', 5, 9),
('Visita a casa 10', 'Inspección para definir tipo de estructura necesaria', '2025-05-27 12:00:00', '2025-05-27 13:00:00', 8, 10),
('Visita a casa 11', 'Revisión de condiciones de tejado y acceso', '2025-05-28 11:00:00', '2025-05-28 12:00:00', 16, 11),
('Visita a casa 12', 'Confirmación de materiales según el espacio disponible', '2025-05-28 15:00:00', '2025-05-28 16:00:00', 21, 12),
('Visita a casa 13', 'Diagnóstico técnico de vivienda para propuesta solar', '2025-05-29 09:00:00', '2025-05-29 10:30:00', 5, 13),
('Visita a casa 14', 'Análisis de consumo energético en el hogar', '2025-05-29 14:00:00', '2025-05-29 15:00:00', 8, 14),
('Visita a casa 15', 'Inspección del domicilio para solución personalizada', '2025-05-30 08:30:00', '2025-05-30 09:30:00', 16, 15),
('Visita a casa 16', 'Valoración de ubicación para rendimiento óptimo', '2025-05-30 16:30:00', '2025-05-30 17:30:00', 21, 16),
('Visita a casa 17', 'Estudio del entorno del domicilio para propuesta', '2025-07-31 10:00:00', '2025-07-31 11:00:00', 5, 17),
('Visita a casa 18', 'Confirmación de detalles técnicos antes de presupuesto', '2025-03-31 12:00:00', '2025-03-31 13:00:00', 8, 18),
('Visita a casa 19', 'Encuentro en vivienda para cierre técnico', '2025-05-20 09:30:00', '2025-05-20 10:30:00', 16, 19);

SELECT * FROM agenda;

INSERT INTO auditoria (id_trabajador, descripcion, fecha) VALUES
(4, 'Ha creado el evento: 1', '2025-05-20 09:32:15'),
(11, 'Ha creado el evento: 2', '2025-05-21 10:10:00'),
(17, 'Ha creado el cliente: 5', '2025-05-21 11:45:23'),
(1, 'Ha eliminado el cliente: 25', '2025-05-21 13:22:41'),
(2, 'Ha modificado el cliente: 10', '2025-05-22 08:55:17'),
(10, 'Ha actualizado el evento: 5', '2025-05-22 14:30:00'),
(21, 'Ha creado una nueva visita', '2025-05-22 16:40:08'),
(10, 'Ha eliminado el evento: 31', '2025-05-23 09:00:00'),
(21, 'Ha registrado una venta al cliente con ID: 7', '2025-05-23 17:45:00'),
(12, 'Ha actualizado el trabajador: Jesús Molina López', '2025-05-24 12:15:33');

SELECT * FROM auditoria;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;