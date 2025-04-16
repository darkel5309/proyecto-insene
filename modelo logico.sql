-- MODELO LÓGICO DE LA BD
TRABAJADOR(id_trabajador, nombre, contrasena, telefono, rol, equipo, subequipo, fecha_alta, fecha_baja)
    PK(id_trabajador)

CLIENTE(id_cliente, nombre, telefono, correo, dni, iban, modo_captacion, observaciones_cliente, fecha_alta)
    PK(id_cliente)

DOMICILIO(id_domicilio, direccion, localidad, provincia, id_cliente)
    PK(id_domicilio)
    FK(id_cliente -> CLIENTE)

FINANCIACION(id_financiacion, importe_financiacion, financiera, numero_cuotas, importe_cuotas, id_cliente)
    PK(id_financiacion)
    FK(id_cliente -> CLIENTE)

SUBVENCION(id_subvencion, fecha_subvencion, n_habitaciones, n_aires_acondicionados, que_usa_ducha, id_cliente)
    PK(id_subvencion)
    FK(id_cliente -> CLIENTE)

VIVIENDA(id_vivienda, visitada, n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio, instalacion_placas, estructura)
    PK(id_vivienda)
    FK(id_domicilio -> DOMICILIO)

RECIBO(id_recibo, importe_luz, importe_gas, id_vivienda)
    PK(id_recibo)
    FK(id_vivienda -> VIVIENDA)

VISITA(id_visita, fecha, hora, resultado, id_vivienda, id_trabajador, oferta, observaciones_visita, fecha_registro)
    PK(id_visita)
    FK(id_vivienda -> VIVIENDA)
    FK(id_trabajador -> TRABAJADOR)

VENTA(id_venta, id_trabajador, id_cliente, fecha_firma, forma_pago, certificado_energetico, gestion_subvencion, gestion_legalizacion, fecha_legalizacion, estado_venta)
    PK(id_venta)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_cliente -> CLIENTE)

INSTALACION(id_instalacion, id_trabajador, id_vivienda, id_venta, fecha_instalacion, n_placas, grua, importe_grua, instalador_tipo, instalacion_terminada, fecha_terminada, otros_costes, observaciones)
    PK(id_instalacion)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_vivienda -> VIVIENDA)
    FK(id_venta -> VENTA)

FACTURA(id_factura, numero_factura, fecha_factura, importe_factura, id_venta)
    PK(id_factura)
    FK(id_venta -> VENTA)

PRODUCTO(id_producto, id_venta, producto_principal, otro_producto, modelo_placas, cuadro_electrico)
    PK(id_producto)
    FK(id_venta -> VENTA)

CAIDA(id_caida, id_venta, motivo_caida, tramitador_financiera, financiera, mes_firma)
    PK(id_caida)
    FK(id_venta -> VENTA)

AGENDA(id_agenda, fecha_inicio_agenda, fecha_fin_agenda, id_trabajador, id_vivienda, motivo, estado, descripcion, titulo, fecha_asignacion)
    PK(id_agenda)
    FK(id_trabajador -> TRABAJADOR)
    FK(id_vivienda -> VIVIENDA)