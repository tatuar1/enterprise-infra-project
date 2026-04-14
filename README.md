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
EOF