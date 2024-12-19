//importamos el css
import './styles/Formulario.css';
// importamos los Estados para poder obtener los valores introducidos por el usuario
import { useState } from "react";
// importamos Axios, nos permite hacer sencillas las operaciones como cliente HTTP
import Axios from "axios";

export default function Formulario() {
  // creamos las constantes para obtener los valores de los campos del formulario
  // constantes de la tabla clientes
  const [nombreContacto, setNombreContacto] = useState("");
  const [direccionContacto, setDireccionContacto] = useState("");
  const [localidadContacto, setLocalidadContacto] = useState("");
  const [provinciaContacto, setProvinciaContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [tieneBombona, setTieneBombona] = useState("");
  const [tieneGas, setTieneGas] = useState("");
  const [tieneTermoElectrico, setTieneTermoElectrico] = useState("");
  const [tienePlacasTermicas, setTienePlacasTermicas] = useState("");
  const [reciboLuz, setReciboLuz] = useState("");
  const [reciboGas, setReciboGas] = useState("");
  const [observacionesContacto, setObservacionesContacto] = useState("");

  // creamos una lista de clientes
  const [listaClientes, setClientes] = useState([]);

  // metodo para crear clientes
  const add = () =>
    // llamamos al metodo crear
    Axios.post("http://localhost:3001/create", {
      nombreContacto: nombreContacto,
      direccionContacto: direccionContacto,
      localidadContacto: localidadContacto,
      provinciaContacto: provinciaContacto,
      telefonoContacto: telefonoContacto,
      correoContacto: correoContacto,
      fechaVisita: fechaVisita,
      horaVisita: horaVisita,
      numeroPersonas: numeroPersonas,
      tieneBombona: tieneBombona,
      tieneGas: tieneGas,
      tieneTermoElectrico: tieneTermoElectrico,
      tienePlacasTermicas: tienePlacasTermicas,
      reciboLuz: reciboLuz,
      reciboGas: reciboGas,
      observacionesContacto: observacionesContacto,
    })
      .then((response) => {
        console.log("Datos enviados correctamente:", response);
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });

  // metodo para obtener clientes
  const getClientes = () =>
    // llamamos a clientes
    Axios.get("http://localhost:3001/clientes")
      // cuando obtenga la respuesta lo guarde en una variable
      .then((response) => {
        // vienen todos los datos de clientes de la aplicacion
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al mostrar los datos:", error);
      }
      );

  // este es el html visible en la web
  return (
    <div className="App">
      <h1>Formulario de Contactos y Visitas</h1>

      <div className="contenedorFormulario">
        <div className="campos">
          {/* <label>ID Trabajador:</label>
          <input
            onChange={(event) => setIdTrabajador(event.target.value)}
            type="text"
            placeholder="Introduce el ID del trabajador"
          /> */}
          <label className='nombreCampo'>Nombre completo del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setNombreContacto(event.target.value)}
            type="text"
            placeholder="Introduce el nombre completo del contacto"
          />

          <label className='nombreCampo'>Dirección del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setDireccionContacto(event.target.value)}
            type="text"
            placeholder="Introduce la dirección del contacto"
          />

          <label className='nombreCampo'>Localidad del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setLocalidadContacto(event.target.value)}
            type="text"
            placeholder="Introduce la localidad del contacto"
          />

          <label className='nombreCampo'>Provincia del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setProvinciaContacto(event.target.value)}
            type="text"
            placeholder="Introduce la provincia del contacto"
          />

          <label className='nombreCampo'>Teléfono de contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setTelefonoContacto(event.target.value)}
            type="text"
            placeholder="Introduce el teléfono del contacto"
          />

          <label className='nombreCampo'>Correo del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setCorreoContacto(event.target.value)}
            type="text"
            placeholder="Introduce el correo electrónico del contacto"
          />

          {/* <label>Modo de captación:</label>
          <select
            onChange={(event) => setModoCaptacion(event.target.value)}
            value={modoCaptacion}
          >
            <option value="">Selecciona un modo de captación</option>
            <option value="Captador">Captador</option>
            <option value="Telemarketing">Telemarketing</option>
            <option value="Referido">Referido</option>
            <option value="Propia"> Captación propia</option>
          </select> */}

          <label className='nombreCampo'>Fecha de la visita:</label>
          <input className='campoTexto'
            onChange={(event) => setFechaVisita(event.target.value)}
            type="text"
            placeholder="Introduce la fecha de la visita"
          />

          <label className='nombreCampo'>Hora de la visita:</label>
          <input className='campoTexto'
            onChange={(event) => setHoraVisita(event.target.value)}
            type="text"
            placeholder="Introduce la hora de la visita"
          />

          <label className='nombreCampo'>Número de personas en la vivienda:</label>
          <input className='campoTexto'
            onChange={(event) => setNumeroPersonas(event.target.value)}
            type="text"
            placeholder="Introduce el número de residentes"
          />

          <label className='nombreCampo'>¿Tiene bombona?</label>
          <div className='opciones'>
            <div className='opcion'>
              <input
                type="radio"
                id="tiene_bombona_si"
                name="tiene_bombona"
                value="Si"
                onChange={(event) => setTieneBombona(event.target.value)}
              />
              <label htmlFor="tiene_bombona_si">Sí</label>
            </div>

            <div className='opcion'>
              <input
                type="radio"
                id="tiene_bombona_no"
                name="tiene_bombona"
                value="No"
                onChange={(event) => setTieneBombona(event.target.value)}
              />
              <label htmlFor="tiene_bombona_no">No</label>
            </div>
          </div>

          <label className='nombreCampo'>¿Tiene gas?</label>
          <div className='opciones'>
            <div className='opcion'>
              <input
                type="radio"
                id="tiene_gas_si"
                name="tiene_gas"
                value="Si"
                onChange={(event) => setTieneGas(event.target.value)}
              />
              <label htmlFor="tiene_gas_si">Sí</label>
            </div>

            <div className='opcion'>
              <input
                type="radio"
                id="tiene_gas_no"
                name="tiene_gas"
                value="No"
                onChange={(event) => setTieneGas(event.target.value)}
              />
              <label htmlFor="tiene_gas_no">No</label>
            </div>
          </div>

          <label className='nombreCampo'>¿Tiene termo eléctrico?</label>
          <div className='opciones'>
            <div className='opcion'>
              <input
                type="radio"
                id="tiene_termo_electrico_si"
                name="tiene_termo_electrico"
                value="Si"
                onChange={(event) => setTieneTermoElectrico(event.target.value)}
              />
              <label htmlFor="tiene_termo_electrico_si">Sí</label>
            </div>

            <div className='opcion'>
              <input
                type="radio"
                id="tiene_termo_electrico_no"
                name="tiene_termo_electrico"
                value="No"
                onChange={(event) => setTieneTermoElectrico(event.target.value)}
              />
              <label htmlFor="tiene_termo_electrico_no">No</label>
            </div>
          </div>

          <label className='nombreCampo'>¿Tiene placas térmicas?</label>
          <div className='opciones'>
            <div className='opcion'>
              <input
                type="radio"
                id="tiene_placas_termicas_si"
                name="tiene_placas_termicas"
                value="Si"
                onChange={(event) => setTienePlacasTermicas(event.target.value)}
              />
              <label htmlFor="tiene_placas_termicas_si">Sí</label>
            </div>

            <div className='opcion'>
              <input
                type="radio"
                id="tiene_placas_termicas_no"
                name="tiene_placas_termicas"
                value="No"
                onChange={(event) => setTienePlacasTermicas(event.target.value)}
              />
              <label htmlFor="tiene_placas_termicas_no">No</label>
            </div>

          </div>

          <label className='nombreCampo'>Importe de recibo de luz:</label>
          <input className='campoTexto'
            onChange={(event) => setReciboLuz(event.target.value)}
            type="text"
            placeholder="Introduce el importe de luz del contacto"
          />

          <label className='nombreCampo'>Importe de recibo de gas:</label>
          <input className='campoTexto'
            onChange={(event) => setReciboGas(event.target.value)}
            type="text"
            placeholder="Introduce el importe de gas del contacto"
          />

          <label className='nombreCampo'>Observaciones del contacto:</label>
          <input className='campoTexto'
            onChange={(event) => setObservacionesContacto(event.target.value)}
            type="text"
            placeholder="Introduce alguna observación"
          />

          <button onClick={add}>Registrar</button>
        </div>
      </div>

      <div className="listaClientes">
        <button onClick={getClientes}>Listar clientes</button>
        <div className="clientes-list">
          {listaClientes.map((valor) => {
            return <div key={valor.id_cliente} className="cliente-item">{valor.nombre}</div>;
          })}
        </div>
      </div>
    </div>
  );

}