$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

docker build -t prelegal:latest .
docker rm -f prelegal 2>$null
docker run -d --name prelegal -p 8000:8000 --add-host=host.docker.internal:host-gateway prelegal:latest

Write-Host "Prelegal running at http://localhost:8000"
