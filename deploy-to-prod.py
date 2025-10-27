#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy Web Builder to Production Server
Domain: web-builder.scram2k.com
Server: prod-server (34.59.193.54)
"""

import subprocess
import sys
import time
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
SERVER = "prod-server"
ZONE = "us-central1-c"
PROJECT_DIR = "/srv/servicios/web-builder"
REPO_URL = "https://github.com/armando-entersys/web-builder.git"
BRANCH = "master"

def run_ssh_command(command, description, timeout=600):
    """Execute command on remote server via gcloud ssh with retry logic"""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}")

    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            print(f"\n🔄 Intento {attempt}/{max_retries}...")

            # Use gcloud compute ssh with increased timeout
            # Note: plink on Windows doesn't support -o flags
            ssh_cmd = [
                "gcloud.cmd", "compute", "ssh", SERVER,
                "--zone", ZONE,
                "--command", command
            ]

            result = subprocess.run(
                ssh_cmd,
                capture_output=True,
                text=True,
                timeout=timeout
            )

            # Print output
            if result.stdout:
                print(result.stdout)
            if result.stderr:
                print(result.stderr, file=sys.stderr)

            if result.returncode == 0:
                print(f"✅ {description} - Completado")
                return True
            else:
                print(f"⚠️ Intento {attempt} falló con código {result.returncode}")
                if attempt < max_retries:
                    print(f"⏳ Esperando 5 segundos antes de reintentar...")
                    time.sleep(5)

        except subprocess.TimeoutExpired:
            print(f"⏰ Timeout en intento {attempt}")
            if attempt < max_retries:
                print(f"⏳ Esperando 5 segundos antes de reintentar...")
                time.sleep(5)
        except Exception as e:
            print(f"❌ Error en intento {attempt}: {e}")
            if attempt < max_retries:
                print(f"⏳ Esperando 5 segundos antes de reintentar...")
                time.sleep(5)

    print(f"❌ {description} - Falló después de {max_retries} intentos")
    return False

def main():
    print("""
=========================================
  Web Builder - Production Deployment
  from GitHub Repository
  Domain: web-builder.scram2k.com
=========================================
""")

    # Step 1: Prepare directory
    if not run_ssh_command(
        f"sudo mkdir -p {PROJECT_DIR} && sudo chown -R $USER:$USER {PROJECT_DIR}",
        "Paso 1: Preparar directorio del proyecto",
        timeout=60
    ):
        print("\n❌ Despliegue falló en Paso 1")
        return 1

    # Step 2: Pull repository (assume it exists from previous deploys)
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && git fetch origin && git reset --hard origin/{BRANCH}",
        "Paso 2: Actualizar repositorio desde GitHub",
        timeout=120
    ):
        print("\n❌ Despliegue falló en Paso 2")
        return 1

    # Step 3: Check environment file
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && test -f .env && echo 'Archivo .env encontrado' || echo 'ADVERTENCIA: .env no existe'",
        "Paso 3: Verificar configuración de variables de entorno",
        timeout=30
    ):
        print("\n⚠️ Advertencia en Paso 3, pero continuando...")
        # Don't fail, just warn

    # Step 3.5: Stop any running containers and clean up
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && docker compose down -v",
        "Paso 3.5: Detener contenedores existentes",
        timeout=60
    ):
        print("\n⚠️ Advertencia al detener contenedores, pero continuando...")

    # Step 4: Build Docker image (this is the long operation)
    print("\n⚠️ NOTA: El build de Docker puede tomar 5-10 minutos...")
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && docker compose build --no-cache",
        "Paso 4: Construir imagen Docker",
        timeout=900  # 15 minutes for build
    ):
        print("\n❌ Despliegue falló en Paso 4 (Build)")
        return 1

    # Step 5: Start containers
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && docker compose up -d && docker compose ps",
        "Paso 5: Iniciar contenedores",
        timeout=120
    ):
        print("\n❌ Despliegue falló en Paso 5 (Start)")
        return 1

    # Step 6: Check deployment
    if not run_ssh_command(
        f"cd {PROJECT_DIR} && docker compose logs --tail=50",
        "Paso 6: Verificar logs del despliegue",
        timeout=60
    ):
        print("\n⚠️ No se pudieron obtener los logs, pero el despliegue puede estar funcionando")

    print("""
=========================================
✅ DESPLIEGUE COMPLETADO
=========================================

🌐 La aplicación debería estar disponible en:
   https://web-builder.scram2k.com

📝 Siguiente paso:
   Verifica que la aplicación esté funcionando correctamente

⚠️ Si hay problemas, revisa los logs con:
   gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker-compose logs"
=========================================
""")

    return 0

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️ Despliegue interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)
