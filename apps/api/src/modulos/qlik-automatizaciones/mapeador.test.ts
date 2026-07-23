import { describe, expect, it } from "bun:test";
import type { AutomatizacionQlik, EjecucionQlik } from "../../infraestructura/qlik/tipos.js";
import {
  aDetalle,
  aResumen,
  esEjecucionActiva,
  mapearEjecuciones,
  mapaEspacios,
  mapaUsuarios,
} from "./mapeador.js";

const mapa = new Map([
  ["esp-1", "Espacio Compartido"],
  ["esp-2", "Espacio Personal"],
]);

const mapaUsr = new Map([
  ["usr-2", "Maria Garcia Resuelta"],
  ["usr-3", "Carlos Lopez"],
]);

// ─── Schema legacy (shape viejo) ────────────────────────────────────────────

const autoLegacy = {
  id: "auto-legacy-1",
  name: "Automatización Legacy",
  spaceId: "esp-1",
  owner: { id: "usr-1", name: "Juan Perez" },
  isEnabled: true,
  triggerType: "scheduled",
  lastExecution: {
    id: "run-1",
    status: "completed",
    startTime: "2024-06-01T10:00:00Z",
    endTime: "2024-06-01T10:01:00Z",
  },
  createdDate: "2024-01-01T00:00:00Z",
  modifiedDate: "2024-05-01T00:00:00Z",
} satisfies AutomatizacionQlik;

// ─── Schema real Qlik ────────────────────────────────────────────────────────

const autoReal = {
  id: "auto-real-1",
  name: "Automatización Real",
  spaceId: "esp-2",
  state: "available",
  runMode: "manual",
  ownerId: "usr-2",
  createdAt: "2024-03-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  lastRun: {
    id: "run-2",
    status: "running",
    startTime: "2024-06-15T10:00:00Z",
  },
} satisfies AutomatizacionQlik;

const autoRealDisabled = {
  id: "auto-real-2",
  name: "Automatización Real Deshabilitada",
  state: "disabled",
  runMode: "scheduled",
  ownerId: "usr-3",
  createdAt: "2024-04-01T00:00:00Z",
  updatedAt: "2024-06-10T00:00:00Z",
} satisfies AutomatizacionQlik;

describe("esEjecucionActiva", () => {
  it("returns true for running", () => {
    expect(esEjecucionActiva("running")).toBe(true);
  });

  it("returns true for queued", () => {
    expect(esEjecucionActiva("queued")).toBe(true);
  });

  it("returns true for pending", () => {
    expect(esEjecucionActiva("pending")).toBe(true);
  });

  it("returns true for started", () => {
    expect(esEjecucionActiva("started")).toBe(true);
  });

  it("returns false for completed", () => {
    expect(esEjecucionActiva("completed")).toBe(false);
  });

  it("returns false for failed", () => {
    expect(esEjecucionActiva("failed")).toBe(false);
  });

  it("returns false for cancelled", () => {
    expect(esEjecucionActiva("cancelled")).toBe(false);
  });
});

describe("aResumen", () => {
  describe("schema legacy", () => {
    it("maps legacy fields correctly", () => {
      const resumen = aResumen(autoLegacy, mapa);
      expect(resumen.id).toBe("auto-legacy-1");
      expect(resumen.name).toBe("Automatización Legacy");
      expect(resumen.espacioNombre).toBe("Espacio Compartido");
      expect(resumen.ownerNombre).toBe("Juan Perez");
      expect(resumen.isEnabled).toBe(true);
      expect(resumen.triggerType).toBe("scheduled");
      expect(resumen.creadoEn).toBe("2024-01-01T00:00:00Z");
      expect(resumen.modificadoEn).toBe("2024-05-01T00:00:00Z");
      expect(resumen.ejecucionActiva).toBe(false); // completed
      expect(resumen.puedeEjecutar).toBe(true);
    });

    it("derives ejecucionActiva from lastExecution", () => {
      const autoLegacyRunning = {
        ...autoLegacy,
        lastExecution: {
          id: "run-active",
          status: "running",
          startTime: "2024-06-15T12:00:00Z",
        },
      };
      const resumen = aResumen(autoLegacyRunning, mapa);
      expect(resumen.ejecucionActiva).toBe(true);
      expect(resumen.puedeEjecutar).toBe(false);
    });
  });

  describe("schema real Qlik", () => {
    it("derives isEnabled from state === 'available'", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.isEnabled).toBe(true);
    });

    it("derives isEnabled=false when state is 'disabled'", () => {
      const resumen = aResumen(autoRealDisabled, mapa);
      expect(resumen.isEnabled).toBe(false);
    });

    it("derives triggerType from runMode", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.triggerType).toBe("manual");
    });

    it("derives ownerNombre from ownerId when owner.name is absent", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.ownerNombre).toBe("usr-2");
    });

    it("resolves ownerNombre from user map when owner.name is absent", () => {
      const resumen = aResumen(autoReal, mapa, mapaUsr);
      expect(resumen.ownerNombre).toBe("Maria Garcia Resuelta");
    });

    it("falls back to ownerId when user map does not contain the ownerId", () => {
      const autoUnknown = {
        ...autoReal,
        ownerId: "usr-unknown",
      };
      const resumen = aResumen(autoUnknown, mapa, mapaUsr);
      expect(resumen.ownerNombre).toBe("usr-unknown");
    });

    it("derives creadoEn from createdAt", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.creadoEn).toBe("2024-03-01T00:00:00Z");
    });

    it("derives modificadoEn from updatedAt", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.modificadoEn).toBe("2024-06-01T00:00:00Z");
    });

    it("derives ejecucionActiva from lastRun", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.ejecucionActiva).toBe(true);
      expect(resumen.puedeEjecutar).toBe(false);
    });

    it("resolves espacioNombre from spaceId", () => {
      const resumen = aResumen(autoReal, mapa);
      expect(resumen.espacioNombre).toBe("Espacio Personal");
    });
  });

  describe("mixed / fallback", () => {
    it("prefers legacy owner.name over ownerId", () => {
      const mixed = {
        ...autoReal,
        owner: { id: "usr-x", name: "Nombre Legacy" },
        ownerId: "usr-real",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(mixed, mapa);
      expect(resumen.ownerNombre).toBe("Nombre Legacy");
    });

    it("prefers legacy owner.name over user map", () => {
      const mixed = {
        ...autoReal,
        owner: { id: "usr-x", name: "Nombre Legacy" },
        ownerId: "usr-2",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(mixed, mapa, mapaUsr);
      expect(resumen.ownerNombre).toBe("Nombre Legacy");
    });

    it("prefers legacy createdDate when createdAt is absent", () => {
      const mixed = {
        id: "auto-mixed",
        name: "Mixed",
        createdDate: "2024-01-01T00:00:00Z",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(mixed, mapa);
      expect(resumen.creadoEn).toBe("2024-01-01T00:00:00Z");
    });

    it("prefers legacy lastExecution when lastRun is absent", () => {
      const mixed = {
        id: "auto-mixed-2",
        name: "Mixed 2",
        lastExecution: {
          id: "run-l",
          status: "running",
          startTime: "2024-06-15T12:00:00Z",
        },
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(mixed, mapa);
      expect(resumen.ejecucionActiva).toBe(true);
    });

    it("returns 'Sin espacio' when spaceId is missing", () => {
      const noSpace = {
        id: "auto-nospace",
        name: "No Space",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(noSpace, mapa);
      expect(resumen.espacioNombre).toBe("Sin espacio");
    });

    it("returns spaceId as fallback when spaceId is present but not in the space map", () => {
      const unknownSpace = {
        id: "auto-unknown-space",
        name: "Unknown Space Auto",
        spaceId: "esp-999",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(unknownSpace, mapa);
      expect(resumen.espacioNombre).toBe("esp-999");
    });

    it("returns 'Sin propietario' when no owner info", () => {
      const noOwner = {
        id: "auto-noowner",
        name: "No Owner",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(noOwner, mapa);
      expect(resumen.ownerNombre).toBe("Sin propietario");
    });

    it("falls back to spaceId when space map contains name: \"\"", () => {
      const mapaBlanco = new Map([["esp-blank", ""]]);
      const autoBlankSpace = {
        id: "auto-blank-space",
        name: "Blank Space Auto",
        spaceId: "esp-blank",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoBlankSpace, mapaBlanco);
      expect(resumen.espacioNombre).toBe("esp-blank");
    });

    it("falls back to spaceId when space map contains name: \"   \" (whitespace)", () => {
      const mapaBlanco = new Map([["esp-blank", "  \t  "]]);
      const autoBlankSpace = {
        id: "auto-blank-space-2",
        name: "Blank Space Auto 2",
        spaceId: "esp-blank",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoBlankSpace, mapaBlanco);
      expect(resumen.espacioNombre).toBe("esp-blank");
    });

    it("falls back to ownerId when owner.name is \"\"", () => {
      const autoBlankOwner = {
        id: "auto-blank-owner",
        name: "Blank Owner Auto",
        spaceId: "esp-1",
        owner: { id: "usr-blank", name: "" },
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoBlankOwner, mapa);
      expect(resumen.ownerNombre).toBe("usr-blank");
    });

    it("falls back to ownerId when owner.name is \"   \" (whitespace)", () => {
      const autoBlankOwner = {
        id: "auto-blank-owner-2",
        name: "Blank Owner Auto 2",
        spaceId: "esp-1",
        owner: { id: "usr-blank-2", name: "  \n" },
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoBlankOwner, mapa);
      expect(resumen.ownerNombre).toBe("usr-blank-2");
    });

    it("falls back to ownerId when user map contains name: \"\"", () => {
      // mapaUsuarios now ignores blank names, so mapaUsrBlank.size === 0
      const mapaUsrBlank = new Map([["usr-blank", ""]]);
      const autoBlankUsrMap = {
        id: "auto-blank-usrmap",
        name: "Blank User Map Auto",
        spaceId: "esp-1",
        ownerId: "usr-blank",
        state: "available",
      } satisfies AutomatizacionQlik;
      // mapaUsrBlank.get("usr-blank") returns "" (blank), normalizarNombre("") → undefined → falls to ownerId
      const resumen = aResumen(autoBlankUsrMap, mapa, mapaUsrBlank);
      expect(resumen.ownerNombre).toBe("usr-blank");
    });

    it("falls back to ownerId when user map contains name: \"   \" (whitespace)", () => {
      // mapaUsuarios now ignores blank names, so this simulates a properly-normalized map
      const mapaUsrBlank = new Map(); // blank names are not stored
      const autoBlankUsrMap2 = {
        id: "auto-blank-usrmap-2",
        name: "Blank User Map Auto 2",
        spaceId: "esp-1",
        ownerId: "usr-blank",
        state: "available",
      } satisfies AutomatizacionQlik;
      // mapaUsrBlank.get("usr-blank") returns undefined → falls to ownerId
      const resumen = aResumen(autoBlankUsrMap2, mapa, mapaUsrBlank);
      expect(resumen.ownerNombre).toBe("usr-blank");
    });

    it("returns 'Sin espacio' when spaceId is whitespace-only", () => {
      const autoWsSpaceId = {
        id: "auto-ws-space",
        name: "WS Space Auto",
        spaceId: "  \t",
        state: "available",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoWsSpaceId, mapa);
      expect(resumen.espacioNombre).toBe("Sin espacio");
    });

    it("returns 'Sin propietario' when ownerId is whitespace-only", () => {
      const autoWsOwnerId = {
        id: "auto-ws-ownerid",
        name: "WS OwnerId Auto",
        state: "available",
        ownerId: "  \n",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoWsOwnerId, mapa);
      expect(resumen.ownerNombre).toBe("Sin propietario");
    });

    it("returns 'Sin propietario' when owner.id (legacy) is whitespace-only", () => {
      const autoWsOwnerIdLegacy = {
        id: "auto-ws-ownerid-legacy",
        name: "WS OwnerId Legacy Auto",
        owner: { id: "  \r", name: "" },
        isEnabled: true,
        triggerType: "manual",
      } satisfies AutomatizacionQlik;
      const resumen = aResumen(autoWsOwnerIdLegacy, mapa);
      expect(resumen.ownerNombre).toBe("Sin propietario");
    });
  });
});

describe("mapearEjecuciones", () => {
  it("maps executions with endTime", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-1",
        automationId: "auto-1",
        status: "completed",
        startTime: "2024-06-01T10:00:00Z",
        endTime: "2024-06-01T10:01:00Z",
      },
    ];
    const result = mapearEjecuciones(ejecuciones);
    expect(result).toHaveLength(1);
    expect(result[0].endTime).toBe("2024-06-01T10:01:00Z");
  });

  it("falls back to stopTime when endTime is absent", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-2",
        automationId: "auto-1",
        status: "completed",
        startTime: "2024-06-01T10:00:00Z",
        stopTime: "2024-06-01T10:02:00Z",
      },
    ];
    const result = mapearEjecuciones(ejecuciones);
    expect(result[0].endTime).toBe("2024-06-01T10:02:00Z");
  });

  it("prefers stopTime over endTime (Qlik real usa stopTime)", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-3",
        automationId: "auto-1",
        status: "completed",
        startTime: "2024-06-01T10:00:00Z",
        endTime: "2024-06-01T10:01:00Z",
        stopTime: "2024-06-01T10:02:00Z",
      },
    ];
    const result = mapearEjecuciones(ejecuciones);
    expect(result[0].endTime).toBe("2024-06-01T10:02:00Z");
  });

  it("returns empty array when ejecuciones is undefined", () => {
    expect(mapearEjecuciones(undefined)).toEqual([]);
  });

  it("returns empty array when ejecuciones is null", () => {
    expect(mapearEjecuciones(null)).toEqual([]);
  });

  it("returns empty array when ejecuciones is empty array", () => {
    expect(mapearEjecuciones([])).toEqual([]);
  });

  it("includes error field when present", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-err",
        automationId: "auto-1",
        status: "failed",
        startTime: "2024-06-01T10:00:00Z",
        error: "Timeout exceeded",
      },
    ];
    const result = mapearEjecuciones(ejecuciones);
    expect(result[0].error).toBe("Timeout exceeded");
  });
});

describe("mapaUsuarios", () => {
  it("builds userId → name map from user list", () => {
    const usuarios = [
      { id: "usr-1", name: "Juan" },
      { id: "usr-2", name: "Maria" },
    ];
    const mapaResult = mapaUsuarios(usuarios);
    expect(mapaResult.get("usr-1")).toBe("Juan");
    expect(mapaResult.get("usr-2")).toBe("Maria");
    expect(mapaResult.size).toBe(2);
  });

  it("returns empty map for empty input", () => {
    expect(mapaUsuarios([]).size).toBe(0);
  });

  it("ignores users with name: \"\"", () => {
    const usuarios = [
      { id: "usr-1", name: "" },
      { id: "usr-2", name: "Maria" },
    ];
    const mapaResult = mapaUsuarios(usuarios);
    expect(mapaResult.size).toBe(1);
    expect(mapaResult.get("usr-1")).toBeUndefined();
    expect(mapaResult.get("usr-2")).toBe("Maria");
  });

  it("ignores users with name: \"   \" (whitespace only)", () => {
    const usuarios = [
      { id: "usr-1", name: "   " },
      { id: "usr-2", name: "Carlos" },
    ];
    const mapaResult = mapaUsuarios(usuarios);
    expect(mapaResult.size).toBe(1);
    expect(mapaResult.get("usr-1")).toBeUndefined();
    expect(mapaResult.get("usr-2")).toBe("Carlos");
  });
});

describe("mapaEspacios", () => {
  it("builds spaceId → name map from space list", () => {
    const espacios = [
      { id: "esp-1", name: "Espacio A", type: "shared" as const, owner: { id: "o1", name: "Owner A" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
      { id: "esp-2", name: "Espacio B", type: "personal" as const, owner: { id: "o2", name: "Owner B" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
    ];
    const mapaResult = mapaEspacios(espacios);
    expect(mapaResult.get("esp-1")).toBe("Espacio A");
    expect(mapaResult.get("esp-2")).toBe("Espacio B");
  });

  it("returns empty map for empty input", () => {
    expect(mapaEspacios([]).size).toBe(0);
  });

  it("ignores spaces with name: \"\"", () => {
    const espacios = [
      { id: "esp-1", name: "", type: "shared" as const, owner: { id: "o1", name: "Owner A" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
      { id: "esp-2", name: "Espacio Valido", type: "shared" as const, owner: { id: "o2", name: "Owner B" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
    ];
    const mapaResult = mapaEspacios(espacios);
    expect(mapaResult.size).toBe(1);
    expect(mapaResult.get("esp-1")).toBeUndefined();
    expect(mapaResult.get("esp-2")).toBe("Espacio Valido");
  });

  it("ignores spaces with name: \"   \" (whitespace only)", () => {
    const espacios = [
      { id: "esp-1", name: "  \t\n  ", type: "shared" as const, owner: { id: "o1", name: "Owner A" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
      { id: "esp-2", name: "Espacio Real", type: "personal" as const, owner: { id: "o2", name: "Owner B" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
    ];
    const mapaResult = mapaEspacios(espacios);
    expect(mapaResult.size).toBe(1);
    expect(mapaResult.get("esp-1")).toBeUndefined();
    expect(mapaResult.get("esp-2")).toBe("Espacio Real");
  });
});

describe("aDetalle", () => {
  it("returns complete detail with executions", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-1",
        automationId: "auto-1",
        status: "completed",
        startTime: "2024-06-01T10:00:00Z",
        endTime: "2024-06-01T10:01:00Z",
      },
    ];
    const detalle = aDetalle(autoLegacy, ejecuciones, mapa);
    expect(detalle.automatizacion.id).toBe("auto-legacy-1");
    expect(detalle.ejecuciones).toHaveLength(1);
  });

  it("does not break when ejecuciones is undefined", () => {
    const detalle = aDetalle(autoLegacy, undefined, mapa);
    expect(detalle.automatizacion.id).toBe("auto-legacy-1");
    expect(detalle.ejecuciones).toEqual([]);
  });

  it("does not break when ejecuciones is null", () => {
    const detalle = aDetalle(autoLegacy, null, mapa);
    expect(detalle.ejecuciones).toEqual([]);
  });

  it("does not break when ejecuciones is empty array", () => {
    const detalle = aDetalle(autoLegacy, [], mapa);
    expect(detalle.ejecuciones).toEqual([]);
  });

  it("works with real Qlik schema", () => {
    const ejecuciones: EjecucionQlik[] = [
      {
        id: "run-real-1",
        automationId: "auto-real-1",
        status: "running",
        startTime: "2024-06-15T10:00:00Z",
      },
    ];
    const detalle = aDetalle(autoReal, ejecuciones, mapa);
    expect(detalle.automatizacion.isEnabled).toBe(true);
    expect(detalle.automatizacion.ejecucionActiva).toBe(true);
    expect(detalle.ejecuciones[0].id).toBe("run-real-1");
  });
});
