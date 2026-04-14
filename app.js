const express = require('express');
const app = express();
let version = "1.0.0";

// Factura de ejemplo (simula datos reales)
let factura = {
    total: 1500,
    lineas: [
        { producto: "Servicio A", monto: 1000 },
        { producto: "Servicio B", monto: 500 }
    ],
    metadata: {
        ultima_actualizacion: new Date().toISOString(),
        checksum: ""  // Lo calcularemos después
    }
};

// Función para calcular checksum de la factura (sin incluir el propio checksum)
function calcularChecksum(data) {
    const dataSinChecksum = { ...data };
    delete dataSinChecksum.metadata.checksum;
    return require('crypto').createHash('sha256')
        .update(JSON.stringify(dataSinChecksum))
        .digest('hex');
}

// Ruta para obtener la factura (calcula checksum dinámico)
app.get('/factura', (req, res) => {
    const checksumActual = calcularChecksum(factura);
    factura.metadata.checksum = checksumActual;
    res.json(factura);
});

// Ruta para obtener solo el checksum
app.get('/checksum', (req, res) => {
    const checksumActual = calcularChecksum(factura);
    res.json({ checksum: checksumActual });
});

// Ruta para obtener versión
app.get('/version', (req, res) => {
    res.json({ version });
});

// Ruta para simular actualización (cambia versión y modifica factura)
app.post('/actualizar', (req, res) => {
    version = "2.0.0";
    // Nueva factura (simula que en v2 hay un nuevo producto)
    factura = {
        total: 2500,
        lineas: [
            { producto: "Servicio A", monto: 1000 },
            { producto: "Servicio B", monto: 500 },
            { producto: "Servicio C", monto: 1000 }
        ],
        metadata: {
            ultima_actualizacion: new Date().toISOString(),
            checksum: ""
        }
    };
    res.json({ status: "actualizado", version: "2.0.0" });
});

app.listen(3000, () => {
    console.log("SaaS de facturación corriendo en puerto 3000");
});
