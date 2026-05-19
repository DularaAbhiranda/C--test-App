$root     = "C:\Users\DularaAbhiranda\Desktop\csharp-test-app"
$backend  = Join-Path $root "aspnetcore-realworld-example-app"
$frontend = Join-Path $root "conduit-frontend"

# Start backend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backend'; & 'C:\Program Files\dotnet\dotnet.exe' run --project src/Conduit"
)

Start-Sleep -Seconds 8

# Start new React+Vite+Tailwind frontend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontend'; npm run dev"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Conduit App is starting up..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend  -> http://localhost:5000" -ForegroundColor Green
Write-Host "  Frontend -> http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "  Wait ~20 seconds, then open http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
