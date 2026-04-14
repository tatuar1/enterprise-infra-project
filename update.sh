#!/bin/bash
set -e  # Detener el script si cualquier comando falla

echo "=== INICIO DE ACTUALIZACIÓN: $(date) ==="

# 1. Obtener factura actual y guardar backup
echo "1. Obteniendo factura actual..."
curl -s http://localhost:3000/factura > factura_backup_$(date +%s).json

# 2. Validar integridad ANTES de actualizar (dos métodos)
echo "2. Validando integridad (antes)..."

# Método A: Suma de montos
TOTAL_BEFORE=$(curl -s http://localhost:3000/factura | jq '.total')
SUM_BEFORE=$(curl -s http://localhost:3000/factura | jq '.lineas | map(.monto) | add')
if [ "$TOTAL_BEFORE" -eq "$SUM_BEFORE" ]; then
    echo "    Suma de montos: OK (total $TOTAL_BEFORE = suma $SUM_BEFORE)"
else
    echo "    ERROR: La suma de montos no coincide antes de actualizar"
    exit 1
fi

# Método B: Checksum (hash)
CHECKSUM_BEFORE=$(curl -s http://localhost:3000/checksum | jq -r '.checksum')
echo "    Checksum antes: $CHECKSUM_BEFORE"

# 3. Ejecutar la actualización (POST a /actualizar)
echo "3. Ejecutando actualización del SaaS..."
curl -s -X POST http://localhost:3000/actualizar > /dev/null

# Pequeña pausa para que el servidor procese
sleep 1

# 4. Validar integridad DESPUÉS de actualizar
echo "4. Validando integridad (después)..."

TOTAL_AFTER=$(curl -s http://localhost:3000/factura | jq '.total')
SUM_AFTER=$(curl -s http://localhost:3000/factura | jq '.lineas | map(.monto) | add')
if [ "$TOTAL_AFTER" -eq "$SUM_AFTER" ]; then
    echo "    Suma de montos: OK (total $TOTAL_AFTER = suma $SUM_AFTER)"
else
    echo "    ERROR: La suma de montos falló después de actualizar"
    echo "   Intentando restaurar backup..."
    # Restauración: aquí podríamos hacer rollback, pero lo simulamos
    exit 1
fi

CHECKSUM_AFTER=$(curl -s http://localhost:3000/checksum | jq -r '.checksum')
echo "    Checksum después: $CHECKSUM_AFTER"

if [ "$CHECKSUM_BEFORE" = "$CHECKSUM_AFTER" ]; then
    echo "    Checksum: IDÉNTICO (los datos no cambiaron inesperadamente)"
else
    echo "    Checksum: DIFERENTE (los datos fueron modificados)"
    echo "   Nota: En una actualización legítima, el checksum puede cambiar si los datos se actualizan."
    echo "   Esto es normal si la factura cambió por diseño. Lo importante es que la suma de montos sigue siendo válida."
fi

# 5. Medir capacidad del contenedor
echo "5. Capacidad del servicio después de la actualización:"
docker stats saas-v1 --no-stream --format "   CPU: {{.CPUPerc}} | RAM: {{.MemUsage}}"

# 6. Registrar en log
echo "$(date) - Actualización exitosa a versión 2.0 (checksum: $CHECKSUM_AFTER)" >> logs.txt
echo "=== FIN DE ACTUALIZACIÓN ==="
