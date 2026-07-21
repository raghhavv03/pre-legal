$ErrorActionPreference = "Stop"

docker rm -f prelegal 2>$null
Write-Host "Prelegal stopped"
