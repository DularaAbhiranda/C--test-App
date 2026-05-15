$root     = "C:\Users\DularaAbhiranda\Desktop\csharp-test-app"
$backend  = Join-Path $root "aspnetcore-realworld-example-app"
$frontend = Join-Path $root "react-redux-realworld-example-app"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backend'; & 'C:\Program Files\dotnet\dotnet.exe' run --project src/Conduit"
)

Start-Sleep -Seconds 10

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontend'; npm start"
)

Write-Host ""
Write-Host "Backend  -> http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend -> http://localhost:4100" -ForegroundColor Green
Write-Host ""
Write-Host "Wait ~30 seconds, then open http://localhost:4100 in your browser."