const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function reporte() {
    try {
        const version = await axios.get('http://localhost:3000/version');
        const factura = await axios.get('http://localhost:3000/factura');
        const checksum = await axios.get('http://localhost:3000/checksum');
        
        // Calcular suma de líneas desde JS
        const sumaLineas = factura.data.lineas.reduce((acc, item) => acc + item.monto, 0);
        const integridadSuma = (sumaLineas === factura.data.total) ? "✅ Íntegra" : "❌ Corrupta";
        
        // Obtener métricas de Docker
        const { stdout } = await execPromise("docker stats saas-v1 --no-stream --format 'CPU: {{.CPUPerc}} | RAM: {{.MemUsage}}'");
        
        console.log("\n========== REPORTE DE PLATAFORMA ==========");
        console.log(`Versión: ${version.data.version}`);
        console.log(`Total facturado: $${factura.data.total}`);
        console.log(`Suma de líneas: $${sumaLineas}`);
        console.log(`Integridad (suma): ${integridadSuma}`);
        console.log(`Checksum actual: ${checksum.data.checksum.substring(0,16)}...`);
        console.log(`Capacidad: ${stdout.trim()}`);
        console.log("==========================================\n");
    } catch (error) {
        console.error("Error al obtener datos:", error.message);
    }
}

reporte();
