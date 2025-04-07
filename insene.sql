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
	fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_baja DATETIME
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
    observaciones_cliente VARCHAR(500),
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
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
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
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

INSERT INTO trabajador (nombre, contrasena, telefono, rol, equipo, subequipo) VALUES
('Juan Pérez', 'contraseña123', '600123456', 'Comercial', 'Equipo A', 'Subequipo X'),
('Ana Gómez', 'contraseña456', '600123457', 'Captador', 'Equipo B', 'Subequipo Y'),
('Luis Martínez', 'contraseña789', '600123458', 'Instalador', 'Equipo C', 'Subequipo Z'),
('Pedro Sánchez', 'contraseña101', '600123459', 'Coordinador', 'Equipo D', 'Subequipo W'),
('Marta Rodríguez', 'contraseña112', '600123460', 'Administrador', 'Equipo E', 'Subequipo V'),
('Carlos Torres', 'contraseña113', '600123461', 'Recursos_Humanos', 'Equipo F', 'Subequipo U'),
('Isabel Díaz', 'contraseña114', '600123462', 'Tramitador', 'Equipo G', 'Subequipo T'),
('José Pérez', 'contraseña115', '600123463', 'Comercial', 'Equipo H', 'Subequipo S'),
('Laura López', 'contraseña116', '600123464', 'Instalador', 'Equipo I', 'Subequipo R'),
('Raúl González', 'contraseña117', '600123465', 'Captador', 'Equipo J', 'Subequipo Q');

SELECT * FROM trabajador;

INSERT INTO cliente (nombre, telefono, correo, dni, iban, modo_captacion, observaciones_cliente) VALUES
('Juan García', '600111111', 'juan@ejemplo.com', '12345678A', 'ES1234567890123456789012', 'Captador', 'Cliente reciente'),
('Ana Rodríguez', '600111112', 'ana@ejemplo.com', '23456789B', 'ES2234567890123456789012', 'Telemarketing', 'Cliente de larga data'),
('Luis Fernández', '600111113', 'luis@ejemplo.com', '34567890C', 'ES3234567890123456789012', 'Referido', 'Interés en productos energéticos'),
('Pedro Sánchez', '600111114', 'pedro@ejemplo.com', '45678901D', 'ES4234567890123456789012', 'Propia', 'Consulta inicial'),
('Marta López', '600111115', 'marta@ejemplo.com', '56789012E', 'ES5234567890123456789012', 'Captador', 'Solicitó información adicional'),
('Carlos Jiménez', '600111116', 'carlos@ejemplo.com', '67890123F', 'ES6234567890123456789012', 'Telemarketing', 'Cliente en espera'),
('Isabel Martínez', '600111117', 'isabel@ejemplo.com', '78901234G', 'ES7234567890123456789012', 'Referido', 'Solicitó presupuesto'),
('José Pérez', '600111118', 'jose@ejemplo.com', '89012345H', 'ES8234567890123456789012', 'Propia', 'Sin interés por ahora'),
('Laura Gómez', '600111119', 'laura@ejemplo.com', '90123456I', 'ES9234567890123456789012', 'Captador', 'Recibió llamada informativa'),
('Raúl López', '600111120', 'raul@ejemplo.com', '01234567J', 'ES0234567890123456789012', 'Telemarketing', 'Posible cliente futuro');

SELECT * FROM cliente;

INSERT INTO domicilio (direccion, localidad, provincia, id_cliente)
VALUES
('Calle Falsa 123', 'Aranjuez', 'Madrid', 1),
('Avenida del Sol 456', 'Sitges', 'Barcelona', 2),
('Calle Real 789', 'Serra', 'Valencia', 3),
('Calle Luna 101', 'Mairena del Alcor', 'Sevilla', 4),
('Calle Estrella 202', 'Tarazona', 'Zaragoza', 5),
('Calle Verde 303', 'Mula', 'Murcia', 6),
('Calle Azul 404', 'Bilbao', 'Vizcaya', 7),
('Calle Viento 505', 'Pampaneira', 'Granada', 8),
('Calle Mar 606', 'Frigiliana', 'Málaga', 9),
('Calle Río 707', 'La Alberca', 'Salamanca', 10);

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
('Si', 3, 2, 'Si', 'Si', 'No', 'Si', 10, 'Si', 'pergola');

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
(62.00, 37.00, 10);

SELECT * FROM recibo;

INSERT INTO visita (fecha, hora, resultado, id_vivienda, id_trabajador, oferta, observaciones_visita) VALUES
('2025-02-27', '10:00', 'Visitado_pdte_contestación', 1, 1, 'Solar', 'Cliente interesado en la instalación'),
('2025-02-28', '11:00', 'No_visita', 2, 2, 'No disponible', 'No se pudo contactar al cliente'),
('2025-03-01', '12:00', 'Venta', 3, 3, 'Energía solar fotovoltaica', 'Contrato firmado y pago realizado'),
('2025-03-02', '13:00', 'Recitar', 4, 4, 'Luz solar y térmica', 'Cliente solicitó más información'),
('2025-03-03', '14:00', 'Visitado_no_hacen_nada', 5, 5, 'Eficiencia energética', 'El cliente no mostró interés'),
('2025-03-04', '15:00', 'Firmada_no_financiable', 6, 6, 'Instalación con financiación', 'Cliente no aceptó la propuesta de financiación'),
('2025-03-05', '16:00', 'Visitado_pdte_contestación', 7, 7, 'Placas solares', 'Esperando respuesta del cliente'),
('2025-03-06', '17:00', 'Venta', 8, 8, 'Energía renovable', 'Venta realizada, instalación programada'),
('2025-03-07', '18:00', 'No_visita', 9, 9, 'No disponible', 'El cliente no estaba en casa'),
('2025-03-08', '19:00', 'Visitado_no_hacen_nada', 10, 10, 'Sistemas térmicos', 'No hubo interés en la propuesta');

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
(8500.00, 'Financiera J', 18, 475.00, 10);

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
('2025-02-10', 4, 1, 'Solar', 10);

SELECT * FROM subvencion;

INSERT INTO venta (id_trabajador, id_cliente, fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado_venta)
VALUES
(1, 1, '2025-01-15', 'Financiado', 'En_cuotas', 'Si', 'No', NULL, 'Instalada'),
(2, 2, '2025-02-18', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Caída'),
(3, 3, '2025-02-20', 'Efectivo', 'No', 'Si', 'Si', '2025-03-01', 'Instalada'),
(4, 4, '2025-02-22', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-02', 'Instalada'),
(5, 5, '2025-01-25', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(6, 6, '2025-02-10', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Instalada'),
(7, 7, '2025-03-05', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-03', 'Instalada'),
(8, 8, '2025-03-10', 'Efectivo', 'No', 'No', 'No', NULL, 'Caída'),
(9, 9, '2025-03-15', 'Transferencia', 'Por_transferencia', 'No', 'No', NULL, 'Instalada'),
(10, 10, '2025-02-28', 'Financiado', 'En_cuotas', 'Si', 'Si', '2025-03-04', 'Instalada');

SELECT * FROM venta;

INSERT INTO instalacion (id_trabajador, id_vivienda, id_venta, fecha_instalacion, n_placas, grua, importe_grua, instalador_tipo, instalacion_terminada, fecha_terminada, otros_costes, observaciones) VALUES
(1, 1, 1, '2025-01-20', 5, 'Si', 200.00, 'Propio', 'Si', '2025-01-21', 'Ninguno', 'Instalación realizada sin problemas'),
(2, 2, 2, '2025-02-21', 6, 'No', NULL, 'Subcontrata', 'No', NULL , NULL, 'Falta completar'),
(3, 3, 3, '2025-02-22', 8, 'Si', 150.00, 'Propio', 'Si', '2025-02-23', 'Costo adicional', 'Placas de mayor capacidad instaladas'),
(4, 4, 4, '2025-02-24', 7, 'No', NULL, 'Propio', 'Si', '2025-02-25', 'Ninguno', 'Instalación terminada con éxito'),
(5, 5, 5, '2025-01-27', 10, 'Si', 250.00, 'Subcontrata', 'No', NULL,'Costos adicionales en mano de obra', 'Requiere revisión de algunos detalles'),
(6, 6, 6, '2025-02-26', 9, 'No', NULL, 'Propio', 'Si', '2025-02-27', 'Sin otros costes', 'Instalación completa'),
(7, 7, 7, '2025-03-01', 5, 'No', NULL, 'Subcontrata', 'No', NULL, NULL , 'Incompleta'),
(8, 8, 8, '2025-03-02', 4, 'Si', 300.00, 'Propio', 'Si', '2025-03-03', 'Sin costes adicionales', 'Instalación lista para funcionamiento'),
(9, 9, 9, '2025-03-05', 6, 'No', NULL, 'Subcontrata', 'Si', '2025-03-06', 'Sin otros costes', 'Instalación en perfectas condiciones'),
(10, 10, 10, '2025-03-07', 3, 'No', NULL, 'Propio', 'Si', '2025-03-08', 'Ninguno', 'Trabajo finalizado');

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
('FAC-010', '2025-03-03', 8500.00, 10);

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
(10, 'Termo eléctrico', 'Placas solares', 'Modelo G', 'M1');

SELECT * FROM producto;

INSERT INTO caida (id_venta, motivo_caida, tramitador_financiera, financiera, mes_firma) VALUES
(1, 'No_financiable', 'Carlos Ruiz', 'Financiera A', 'Enero'),
(2, 'No_se_puede_instalar', 'Ana Sánchez', 'Financiera B', 'Febrero'),
(3, 'Cliente_decide_no_instalar', 'Luis Pérez', 'Financiera C', 'Febrero'),
(4, 'Problemas_de_cobro', 'Isabel García', 'Financiera D', 'Enero'),
(5, 'No_financiable', 'Pedro Martínez', 'Financiera E', 'Marzo'),
(6, 'No_se_puede_instalar', 'Carlos López', 'Financiera F', 'Febrero'),
(7, 'Cliente_decide_no_instalar', 'Ana Gómez', 'Financiera G', 'Marzo'),
(8, 'Problemas_de_cobro', 'Luis González', 'Financiera H', 'Enero'),
(9, 'No_financiable', 'Isabel Ruiz', 'Financiera I', 'Febrero'),
(10, 'No_se_puede_instalar', 'Pedro Sánchez', 'Financiera J', 'Marzo');

SELECT * FROM caida;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
-- FLUSH PRIVILEGES;