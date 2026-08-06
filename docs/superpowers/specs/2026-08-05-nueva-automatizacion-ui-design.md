# Nueva automatización: diseño UI/UX guiado

## Objetivo
Convertir `/automatizaciones/nueva` en un formulario guiado, comprensible para usuarios no técnicos y consistente con la configuración compacta del producto.

## Diseño aprobado
- Escritorio en dos columnas: pasos a la izquierda y resumen fijo a la derecha.
- Móvil en una columna, con el resumen después de los pasos.
- Tres pasos dependientes: origen, destino y nombre.
- Cada paso muestra estado pendiente, completo o requiere atención.
- El resumen muestra la ruta de procesamiento, plantilla, conexión, recurso, nombre final y requisitos faltantes.
- El botón primario vive en el resumen y explica por qué está deshabilitado.
- La información técnica se resume como “Cómo se procesarán los datos”.
- Se advierte antes de abandonar la página cuando existan cambios sin crear.

## Restricciones
- Mantener la lógica actual de creación y los contratos de API.
- Mantener nombres y textos en español.
- No añadir dependencias.
- Usar componentes y tokens visuales existentes.
- Implementar con TDD y verificar pruebas, typecheck, build y Biome focalizado.
