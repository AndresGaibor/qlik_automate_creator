import {
  esquemaCrearDesdePlantilla,
  esquemaEntradaCrearModo1,
} from "@qlik/contratos/automatizaciones";
import type { Hono } from "hono";
import { leerJson } from "../../../nucleo/http/leer-json.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import { CrearAutomatizacionDesdePlantilla } from "../aplicacion/casos-de-uso/crear-desde-plantilla.js";
import { prepararParametrosPlantilla } from "../aplicacion/servicios/preparar-parametros-plantilla.js";
import { responderEspacioNoAutorizado } from "./autorizacion-panel.js";
import { plantillaEfectivaDelModo } from "./plantilla-efectiva.js";
import type {
  DependenciasRutasPanel,
  ModoPlantilla,
} from "./tipos-rutas-panel.js";

export function registrarRutaCrearDesdePlantilla(
  rutas: Hono,
  dependencias: DependenciasRutasPanel,
) {
  rutas.post("/desde-plantilla", async (c) => {
    const cuerpo = await leerJson(c);
    const cuerpoObj =
      typeof cuerpo === "object" && cuerpo !== null ? cuerpo : {};
    const claveEncabezado = c.req.header("idempotency-key")?.trim();
    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);
    const { modoAutomatizacionActivo } = await dependencias.obtenerModoGlobal();
    const modo: ModoPlantilla = modoAutomatizacionActivo;
    const tenant = await dependencias.consultaTenant.obtenerTenant(
      sesion.tenantId,
    );
    const plantilla = plantillaEfectivaDelModo(tenant, modo);

    if (!plantilla) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje: `El modo ${modo} no tiene plantilla configurada. Configúrala en Administración → Plantilla de Automatización.`,
            codigo: "SIN_PLANTILLA_MODO_ACTIVO",
          },
        },
        422,
      );
    }

    if (modo === 2 && !(cuerpoObj as Record<string, unknown>).destinoId) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              "El destino de datos es obligatorio para el modo 2. Selecciona una conexión destino.",
            codigo: "DESTINO_REQUERIDO_MODO_2",
          },
        },
        422,
      );
    }

    const flujoId = (cuerpoObj as Record<string, unknown>).flujoId as
      | string
      | undefined;
    if (!flujoId) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              "El flujo (Dataflow) es obligatorio para preparar la automatización.",
            codigo: "FLUJO_REQUERIDO",
          },
        },
        422,
      );
    }

    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (politica?.restringida) {
      const flujo = (await qlik.listarFlujos()).find(
        (item) => item.id === flujoId,
      );
      if (!flujo || !politica.puedeVer(flujo.spaceId)) {
        return responderEspacioNoAutorizado(c);
      }
    }

    const entradaPublicaModo1 =
      modo === 1
        ? esquemaEntradaCrearModo1.parse({
            ...cuerpoObj,
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          })
        : null;
    const parametros = await prepararParametrosPlantilla(
      {
        qlik,
        consultarConexionesOrigen: dependencias.consultarConexionesOrigen,
        consultarConexionDestino: dependencias.consultarConexionDestino,
        crearCliente: dependencias.crearClienteDestino,
        probarConexionOrigen: dependencias.probarConexionOrigen,
        leerSecretoOrigen: dependencias.leerSecretoOrigen,
        obtenerConexionDestinoConSecreto:
          dependencias.obtenerConexionDestinoConSecreto,
        probarConexionDestino: dependencias.probarConexionDestino,
      },
      {
        modo,
        organizacionId: sesion.organizacionId,
        flujoId,
        tablaId:
          modo === 2
            ? ((cuerpoObj as Record<string, unknown>).tablaId as
                | string
                | undefined)
            : undefined,
        destinoId:
          entradaPublicaModo1?.destinoId ??
          ((cuerpoObj as Record<string, unknown>).destinoId as
            | string
            | undefined),
      },
    );
    const entrada = esquemaCrearDesdePlantilla.parse(
      modo === 1
        ? {
            ...entradaPublicaModo1,
            plantillaIdQlik: plantilla.id,
            reemplazosWorkspace: [],
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          }
        : {
            ...cuerpoObj,
            plantillaIdQlik: plantilla.id,
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          },
    );
    const contextoSolicitud = obtenerContextoSolicitud(c);
    const resultado = await new CrearAutomatizacionDesdePlantilla(
      qlik,
      dependencias.idempotencia,
      dependencias.outbox,
      dependencias.auditoria,
    ).ejecutar(
      entrada,
      {
        ...sesion,
        idSolicitud: contextoSolicitud.idSolicitud,
        ip: contextoSolicitud.ip,
        agenteUsuario: contextoSolicitud.agenteUsuario,
      },
      { parametros, modoPlantilla: modo },
    );
    return responderExito(c, resultado, 201);
  });
}
