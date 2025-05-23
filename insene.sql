-- CREACION DE TABLAS
DROP DATABASE IF EXISTS insene;
CREATE DATABASE insene;
USE insene;

CREATE TABLE trabajador(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono CHAR(9),
    puesto ENUM("administrador", "administrativo", "captador", "ceo", "comercial", "coordinador", "ingeniero", "instalador", "limpiador", "mozo_almacen", "rrhh", "tramitador"),
    departamento ENUM("administracion", "comercial", "gerencia", "instalaciones", "limpieza", "rrhh"),
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
    modo_captacion ENUM("captador", "telemarketing", "referido", "propia"),
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
    visitada ENUM ("no", "si", "sin_datos"),
    n_personas INT,
    n_decisores INT,
    tiene_bombona ENUM("no", "si", "sin_datos"),
    tiene_gas ENUM("no", "si", "sin_datos"),
    tiene_termo_electrico ENUM("no", "si", "sin_datos"),
	tiene_placas_termicas ENUM("no", "si", "sin_datos"),
	id_domicilio INT,
    instalacion_placas ENUM("no", "si", "sin_datos"),
    estructura ENUM('bancada', 'coplanar', 'doble_triangulo', 'no', 'pergola', 'sinebloc30', 'triangulo'),
    
    CONSTRAINT fk_vivienda_id_domicilio FOREIGN KEY (id_domicilio) REFERENCES domicilio(id_domicilio) ON DELETE CASCADE
);

CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_trabajador INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha_firma DATE,
    forma_pago ENUM('Financiado', 'Transferencia', 'Efectivo') NULL,
    certificado_energetico ENUM('En_cuotas', 'Por_transferencia', 'no') NULL,
    gestion_subvencion ENUM("no", "si") NULL,
    gestion_legalizacion ENUM("no", "si") NULL,
    fecha_legalizacion DATE,
    estado_venta ENUM('caida', 'instalada', 'pendiente') NOT NULL DEFAULT 'pendiente',
    
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
	grua ENUM ("no", "si"),
    importe_grua DECIMAL(10,2),
    instalador_tipo ENUM('Propio', 'Subcontrata') NOT NULL,
    instalacion_terminada ENUM ("no", "si") NOT NULL,
    fecha_terminada DATE,
    otros_costes VARCHAR(100),
    observaciones VARCHAR(500),
    
    CONSTRAINT fk_instalacion_id_trabajador FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_instalacion_id_vivienda FOREIGN KEY (id_vivienda) REFERENCES vivienda(id_vivienda),
    CONSTRAINT fk_instalacion_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
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
    cuadro_electrico ENUM('l1', 'm1') ,

    CONSTRAINT fk_producto_id_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE
);

CREATE TABLE caida (
    id_caida INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    motivo_caida ENUM('cliente_decide_no_instalar', 'no_financiable', 'no_se_puede_instalar', 'problemas_de_cobro') NOT NULL,
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
    estado ENUM('cancelada', 'completada', 'pendiente') DEFAULT 'pendiente',
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
('Ángel Domínguez Rodríguez', '$2b$10$1Ckj.oPYuQ65TaeEPHbm/.ul6R6kCYsnmyM1zfqNrrXVaS74zPuWm', '600123456', 'administrador', 'administracion', null),
('Margarita Gandul Pedregal', '$2b$10$CeEelXZmSL0lnsW.IknTmeQ.uBzpOqO/Bryud6xIaPJEQqT4IkD52', '600123457', 'administrador', 'administracion', null),
('Luis Martínez García', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '635987898', 'instalador', 'instalaciones', null),
('Manuel Sánchez Fernández', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123459', 'coordinador', 'comercial', null),
('Marta Rodríguez González', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123460', 'comercial', 'comercial', 'Manuel'),
('Carlos Torres Rodríguez', '$2b$10$5pTr0IZLT/Nclf9GEKsMDOu/SaRvPGbRWB5JGLXsOSHdWdJ0HKFWu', '600123461', 'rrhh', 'rrhh', null),
('Isabel Díaz López', '$2b$10$L0AmyBZQHQ1vU9xZ0rmYNedMKKF.l\xKuC8oWeP6KwLEomjvF1hMO', '600123462', 'tramitador', 'administracion', null),
('José Pérez Martínez', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123463', 'comercial', 'comercial', 'Manuel'),
('Laura López Sánchez', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123464', 'instalador', 'instalaciones', null),
('Javier González', '$2b$10$GC.hWE/pwi7etgEYGqXz7OB77XBJ5WixsvFh5weVqseFiyvD4daRe', '600123465', 'captador', 'comercial', 'Jesús'),
('Jesús Molina López', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123466', 'coordinador', 'comercial', null),
('Sofía Hernández Pérez', '$2b$10$abCD12345678examplepass1', '600123467', 'administrador', 'administracion', null),
('Andrés Martínez Gómez', '$2b$10$5pTr0IZLT/Nclf9GEKsMDOu/SaRvPGbRWB5JGLXsOSHdWdJ0HKFWu', '600123468', 'rrhh', 'rrhh', null),
('Nuria Gutiérrez Díaz', '$2b$10$abCD12345678examplepass3', '600123469', 'tramitador', 'administracion', null),
('Pablo Ruiz Navarro', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123470', 'instalador', 'instalaciones', null),
('Clara Moreno Moreno', '$2b$10$abCD12345678examplepass5', '600123471', 'comercial', 'comercial', 'Manuel'),
('Hugo Navarro Molina', '$2b$10$abCD12345678examplepass6', '600123472', 'captador', 'comercial', 'Jesús'),
('Eva Romero Castro', '$2b$10$nOzjEIHXen5MfbNvsrJSCOF7r3eHHxMJPm0akJ0GoEVCd5j3tCyJG', '600123473', 'coordinador', 'comercial', null),
('Daniel Ortega Serrano', '$2b$10$tLkpxJRHcyaQxeOdvnxK9u2duXloNoYZTD.RYXV3r/ccGpS1BxQ2K', '600123474', 'instalador', 'instalaciones', null),
('Patricia Vega Campos', '$2b$10$abCD12345678examplepass9', '600123475', 'tramitador', 'administracion', null),
('Raúl Torres Montes', '$2b$10$NCajfnTbvJbblCq3AFQsaeMY13iu7Pk7StDq4s0bP1iB4EwUkSMHm', '600123476', 'comercial', 'comercial', 'Romero');

SELECT * FROM trabajador;

INSERT INTO cliente (nombre, telefono, correo, dni, iban, modo_captacion, observaciones_cliente) VALUES
('Juan García Pardo', '600111111', 'juan@gmail.com', '12345678A', 'ES1234567890123456789012', 'captador', 'Cliente reciente'),
('Ana Rodríguez Alegre', '600111112', 'ana@gmail.com', '23456789B', 'ES2234567890123456789012', 'telemarketing', 'Cliente de larga data'),
('Luis Fernández Largo', '600111113', 'luis@gmail.com', '34567890C', 'ES3234567890123456789012', 'referido', 'Interés en productos energéticos'),
('Pedro Jiménez Cortés', '600111114', 'pedro@hotmail.com', '45678901D', 'ES4234567890123456789012', 'propia', 'Consulta inicial'),
('Marta López Calvo', '600111115', 'marta@gmail.com', '56789012E', 'ES5234567890123456789012', 'captador', 'Solicitó información adicional'),
('Carlos Jiménez Delgado', '600111116', 'carlos@gmail.com', '67890123F', 'ES6234567890123456789012', 'telemarketing', 'Cliente en espera'),
('Isabel Martínez Sastre', '600111117', 'isabel@gmail.com', '78901234G', 'ES7234567890123456789012', 'referido', 'Solicitó presupuesto'),
('José Pérez Rubio', '600111118', 'jose@hotmail.com', '89012345H', 'ES8234567890123456789012', 'propia', 'Sin interés por ahora'),
('Laura Gómez Moreno', '600111119', 'laura@hotmail.com', '90123456I', 'ES9234567890123456789012', 'captador', 'Recibió llamada informativa'),
('Raúl López Carpintero', '600111120', 'raul@gmail.com', '01234567J', 'ES0234567890123456789012', 'telemarketing', 'Posible cliente futuro'),
('Sofía Morales Barbero', '600111121', 'sofia@gmail.com', '11223344A', 'ES1034567890123456789012', 'referido', 'Interesada en energía solar'),
('Diego Sánchez Calderón', '600111122', 'diego@hotmail.com', '22334455B', 'ES2034567890123456789012', 'captador', 'Quiere reducir factura de luz'),
('Lucía Torres Ferrer', '600111123', 'lucia@gmail.com', '33445566C', 'ES3034567890123456789012', 'propia', 'Vivienda con buena orientación solar'),
('Daniel Ramírez Pastor', '600111124', 'daniel@gmail.com', '44556677D', 'ES4034567890123456789012', 'telemarketing', 'Solicita visita presencial'),
('Carmen Ruiz Rubio', '600111125', 'carmen@hotmail.com', '55667788E', 'ES5034567890123456789012', 'captador', 'Interesada en placas y baterías'),
('Andrés Molina Rivera', '600111126', 'andres@gmail.com', '66778899F', 'ES6034567890123456789012', 'referido', 'Cliente informado por vecino'),
('Eva Herrera Serrano', '600111127', 'eva@hotmail.com', '77889900G', 'ES7034567890123456789012', 'propia', 'Quiere estudiar viabilidad del proyecto'),
('Alejandro Gil Campos', '600111128', 'alejandro@gmail.com', '88990011H', 'ES8034567890123456789012', 'telemarketing', 'Pidió presupuesto detallado'),
('María Navarro Campos', '600111129', 'maria@gmail.com', '99001122I', 'ES9034567890123456789012', 'captador', 'Solicitud recibida en feria local'),
('Pablo Ortega Moreno', '600111130', 'pablo@hotmail.com', '00112233J', 'ES0134567890123456789012', 'referido', 'Amigo de un cliente satisfecho');

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
('si', 3, 2, 'si', 'si', 'si', 'no', 1, 'si', 'coplanar'),
('no', 4, 3, 'no', 'si', 'no', 'si', 2, 'no', 'triangulo'),
('si', 2, 1, 'si', 'no', 'si', 'no', 3, 'si', 'pergola'),
('no', 5, 4, 'no', 'si', 'si', 'si', 4, 'no', 'bancada'),
('si', 6, 2, 'si', 'no', 'si', 'no', 5, 'si', 'doble_triangulo'),
('no', 3, 2, 'no', 'si', 'no', 'no', 6, 'no', 'no'),
('si', 2, 1, 'si', 'no', 'si', 'si', 7, 'si', 'sinebloc30'),
('si', 4, 3, 'si', 'si', 'no', 'no', 8, 'no', 'coplanar'),
('no', 5, 3, 'no', 'no', 'si', 'no', 9, 'no', 'triangulo'),
('si', 3, 2, 'si', 'si', 'no', 'si', 10, 'si', 'pergola'),
('si', 4, 2, 'no', 'si', 'si', 'no', 11, 'si', 'coplanar'),
('no', 3, 1, 'si', 'no', 'no', 'no', 12, 'no', 'triangulo'),
('si', 2, 2, 'no', 'si', 'si', 'si', 13, 'si', 'bancada'),
('si', 5, 3, 'si', 'si', 'no', 'no', 14, 'no', 'doble_triangulo'),
('no', 1, 1, 'no', 'no', 'si', 'no', 15, 'si', 'pergola'),
('si', 6, 2, 'si', 'si', 'si', 'si', 16, 'si', 'sinebloc30'),
('no', 3, 2, 'no', 'no', 'no', 'no', 17, 'no', 'coplanar'),
('si', 4, 3, 'si', 'no', 'si', 'si', 18, 'si', 'triangulo'),
('no', 2, 1, 'si', 'si', 'no', 'no', 19, 'no', 'no'),
('si', 5, 4, 'no', 'si', 'si', 'no', 20, 'si', 'bancada');

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
(5, 1, '2025-01-15', 'Financiado', 'En_cuotas', 'si', 'no', NULL, 'instalada'),
(8, 2, '2025-02-18', 'Transferencia', 'Por_transferencia', 'no', 'no', NULL, 'caida'),
(17, 3, '2025-02-20', 'Efectivo', 'no', 'si', 'si', '2025-03-01', 'instalada'),
(5, 4, '2025-02-22', 'Financiado', 'En_cuotas', 'si', 'si', '2025-03-02', 'instalada'),
(8, 5, '2025-01-25', 'Efectivo', 'no', 'no', 'no', NULL, 'caida'),
(17, 6, '2025-02-10', 'Transferencia', 'Por_transferencia', 'no', 'no', NULL, 'instalada'),
(17, 7, '2025-03-05', 'Financiado', 'En_cuotas', 'si', 'si', '2025-03-03', 'instalada'),
(18, 8, '2025-03-10', 'Efectivo', 'no', 'no', 'no', NULL, 'caida'),
(5, 9, '2025-03-15', 'Transferencia', 'Por_transferencia', 'no', 'no', NULL, 'instalada'),
(17, 10, '2025-02-28', 'Financiado', 'En_cuotas', 'si', 'si', '2025-03-04', 'instalada'),
(5, 11, '2025-03-20', 'Efectivo', 'no', 'no', 'si', '2025-03-25', 'instalada'),
(8, 12, '2025-03-22', 'Transferencia', 'Por_transferencia', 'si', 'no', NULL, 'instalada'),
(17, 13, '2025-03-23', 'Financiado', 'En_cuotas', 'si', 'si', '2025-03-30', 'instalada'),
(18, 14, '2025-03-24', 'Efectivo', 'no', 'no', 'no', NULL, 'caida'),
(5, 15, '2025-03-25', 'Transferencia', 'Por_transferencia', 'no', 'si', '2025-04-01', 'instalada'),
(8, 16, '2025-03-26', 'Financiado', 'En_cuotas', 'si', 'si', '2025-04-02', 'instalada'),
(17, 17, '2025-03-27', 'Efectivo', 'no', 'no', 'no', NULL, 'instalada'),
(18, 18, '2025-03-28', 'Transferencia', 'Por_transferencia', 'si', 'no', NULL, 'caida'),
(5, 19, '2025-03-29', 'Financiado', 'En_cuotas', 'no', 'si', '2025-04-05', 'instalada'),
(8, 20, '2025-03-30', 'Efectivo', 'no', 'no', 'no', NULL, 'caida'),
(8, 20, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente');

SELECT * FROM venta;

INSERT INTO instalacion (id_trabajador, id_vivienda, id_venta, fecha_instalacion, n_placas, grua, importe_grua, instalador_tipo, instalacion_terminada, fecha_terminada, otros_costes, observaciones) VALUES
(3, 1, 1, '2025-01-20', 5, 'si', 200.00, 'Propio', 'si', '2025-01-21', 'Ninguno', 'Instalación realizada sin problemas'),
(9, 2, 2, '2025-02-21', 6, 'no', NULL, 'Subcontrata', 'no', NULL , NULL, 'Falta completar'),
(16, 3, 3, '2025-02-22', 8, 'si', 150.00, 'Propio', 'si', '2025-02-23', 'Costo adicional', 'Placas de mayor capacidad instaladas'),
(20, 4, 4, '2025-02-24', 7, 'no', NULL, 'Propio', 'si', '2025-02-25', 'Ninguno', 'Instalación terminada con éxito'),
(3, 5, 5, '2025-01-27', 10, 'si', 250.00, 'Subcontrata', 'no', NULL,'Costos adicionales en mano de obra', 'Requiere revisión de algunos detalles'),
(9, 6, 6, '2025-02-26', 9, 'no', NULL, 'Propio', 'si', '2025-02-27', 'Sin otros costes', 'Instalación completa'),
(16, 7, 7, '2025-03-01', 5, 'no', NULL, 'Subcontrata', 'no', NULL, NULL , 'Incompleta'),
(20, 8, 8, '2025-03-02', 4, 'si', 300.00, 'Propio', 'si', '2025-03-03', 'Sin costes adicionales', 'Instalación lista para funcionamiento'),
(3, 9, 9, '2025-03-05', 6, 'no', NULL, 'Subcontrata', 'si', '2025-03-06', 'Sin otros costes', 'Instalación en perfectas condiciones'),
(9, 10, 10, '2025-03-07', 3, 'no', NULL, 'Propio', 'si', '2025-03-08', 'Ninguno', 'Trabajo finalizado'),
(16, 11, 11, '2025-03-10', 7, 'no', NULL, 'Propio', 'si', '2025-03-11', 'Ninguno', 'Instalación rápida y sin incidencias'),
(3, 12, 12, '2025-03-12', 5, 'si', 220.00, 'Subcontrata', 'no', NULL, 'Coste extra por condiciones del terreno', 'Cliente satisfecho con el progreso'),
(9, 13, 13, '2025-03-13', 8, 'no', NULL, 'Propio', 'si', '2025-03-14', 'Sin costes adicionales', 'Todo conforme al plan'),
(20, 14, 14, '2025-03-14', 6, 'si', 180.00, 'Subcontrata', 'si', '2025-03-15', 'Costo grúa incluido', 'Instalación completa y certificada'),
(16, 15, 15, '2025-03-15', 9, 'no', NULL, 'Propio', 'no', NULL, NULL, 'Pendiente revisión final'),
(3, 16, 16, '2025-03-16', 4, 'si', 210.00, 'Subcontrata', 'si', '2025-03-17', 'Ninguno', 'Buen resultado y cliente contento'),
(9, 17, 17, '2025-03-17', 7, 'no', NULL, 'Propio', 'si', '2025-03-18', 'Sin costes adicionales', 'Instalación en perfecto estado'),
(20, 18, 18, '2025-03-18', 5, 'no', NULL, 'Subcontrata', 'no', NULL, 'Problema con el acceso a la vivienda', 'Pendiente resolver'),
(16, 19, 19, '2025-03-19', 6, 'si', 190.00, 'Propio', 'si', '2025-03-20', 'Costo de grúa justificado', 'Instalación realizada sin contratiempos'),
(3, 20, 20, '2025-03-20', 8, 'no', NULL, 'Subcontrata', 'si', '2025-03-21', 'Sin otros costes', 'Cliente satisfecho con la instalación');

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
(1, 'Placas solares', 'Batería', 'Modelo X', 'l1'),
(2, 'Termo eléctrico', 'Batería', 'Modelo Y', 'm1'),
(3, 'Placas solares', 'Batería', 'Modelo Z', 'l1'),
(4, 'Termo eléctrico', 'Placas solares', 'Modelo A', 'm1'),
(5, 'Placas solares', 'Batería', 'Modelo B', 'l1'),
(6, 'Termo eléctrico', 'Placas solares', 'Modelo C', 'm1'),
(7, 'Placas solares', 'Batería', 'Modelo D', 'l1'),
(8, 'Termo eléctrico', 'Batería', 'Modelo E', 'm1'),
(9, 'Placas solares', 'Batería', 'Modelo F', 'l1'),
(10, 'Termo eléctrico', 'Placas solares', 'Modelo G', 'm1'),
(11, 'Placas solares', 'Batería', 'Modelo H', 'm1'),
(12, 'Termo eléctrico', 'Batería', 'Modelo I', 'l1'),
(13, 'Placas solares', 'Batería', 'Modelo J', 'm1'),
(14, 'Termo eléctrico', 'Placas solares', 'Modelo K', 'm1'),
(15, 'Placas solares', 'Batería', 'Modelo L', 'l1'),
(16, 'Termo eléctrico', 'Placas solares', 'Modelo M', 'm1'),
(17, 'Placas solares', 'Batería', 'Modelo N', 'l1'),
(18, 'Termo eléctrico', 'Batería', 'Modelo O', 'm1'),
(19, 'Placas solares', 'Batería', 'Modelo P', 'l1'),
(20, 'Termo eléctrico', 'Placas solares', 'Modelo Q', 'm1');

SELECT * FROM producto;

INSERT INTO caida (id_venta, motivo_caida, tramitador_financiera, financiera, mes_firma) VALUES
(2, 'no_financiable', 'Ana Sánchez', 'Financiera A', 'Febrero'),
(5, 'cliente_decide_no_instalar', 'Pedro Martínez', 'Financiera B', 'Enero'),
(8, 'problemas_de_cobro', 'Luis González', 'Financiera C', 'Marzo'),
(14, 'no_se_puede_instalar', 'Isabel Ruiz', 'Financiera D', 'Marzo'),
(18, 'no_financiable', 'Carlos López', 'Financiera E', 'Marzo');

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
(4, 'Ha registrado el evento: 1', '2025-05-20 09:32:15'),
(11, 'Ha registrado el evento: 2', '2025-05-21 10:10:00'),
(17, 'Ha registrado el cliente: 5', '2025-05-21 11:45:23'),
(1, 'Ha eliminado el cliente: 25', '2025-05-21 13:22:41'),
(2, 'Ha modificado el cliente: 10', '2025-05-22 08:55:17'),
(10, 'Ha actualizado el evento: 5', '2025-05-22 14:30:00'),
(21, 'Ha registrado una nueva visita', '2025-05-22 16:40:08'),
(10, 'Ha eliminado el evento: 31', '2025-05-23 09:00:00'),
(21, 'Ha registrado una venta al cliente con ID: 7', '2025-05-23 17:45:00'),
(12, 'Ha actualizado el trabajador: Jesús Molina López', '2025-05-24 12:15:33');

SELECT * FROM auditoria;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;