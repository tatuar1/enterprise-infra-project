# Proyecto: Actualización Controlada de SaaS con Validación de Integridad

Simula el proceso de actualización de un servicio de facturación en la nube, con:
- Validación de integridad por **suma de montos** y **checksum SHA256**
- Medición de capacidad (CPU/RAM del contenedor)
- Automatización total con Bash
- Registro de logs y backups

## Tecnologías
- Node.js + Express (simula el SaaS)
- Docker
- Bash scripting
- jq, curl, sha256sum

## Cómo ejecutar
1. `docker build -t mi-saas:1.0 .`
2. `docker run -d --name saas-v1 -p 3000:3000 mi-saas:1.0`
3. `chmod +x update.sh && ./update.sh`

## Autor
Leonel Luna Medina - Candidato a Cloud & Infrastructure Engineer