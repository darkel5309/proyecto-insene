-- MODELO LÓGICO DE LA BD
CLIENTE(id_cliente, nombre, telefono, correo, modo_captacion, observaciones_cliente)
	PK(id_cliente)

DOMICILIO(id_domicilio, direccion, localidad, provincia, id_cliente)
	PK(id_direccion)
	FK(id_cliente)

VIVIENDA(id_vivienda, n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio)
	PK(id_vivienda)
	FK(id_domicilio -> DOMICILIO)

RECIBO(id_recibo, importe_luz, importe_gas, id_vivienda)
	PK(id_recibo)
	FK(id_vivienda -> VIVIENDA)

TRABAJADOR(id_trabajador, nombre, contrasena, telefono, rol)
	PK(id_trabajador)

VISITA (id_visita, fecha, hora, tipo, resultado, oferta, observaciones_visita, id_vivienda, id_trabajador)
	PK(id_visita)
	FK(id_vivienda -> VIVIENDA)
	FK(id_trabajador -> TRABAJADOR) 