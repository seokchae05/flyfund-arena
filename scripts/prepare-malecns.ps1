param(
    [string]$DataRoot = "$PSScriptRoot\..\data\malecns"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Python = Join-Path $ProjectRoot ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $Python)) {
    throw "Python environment not found. Create .venv and install numpy, pandas, pyarrow and Pillow first."
}

$env:PYTHONPATH = Join-Path $ProjectRoot "vendor"
$env:STONKFLY_DATA = [System.IO.Path]::GetFullPath($DataRoot)
$env:STONKFLY_CXX = "C:\tools\flyfund-winlibs\mingw64\bin\g++.exe"
$env:STONKFLY_KERNEL_DLL = "C:\tools\flyfund-build\memory.dll"

& $Python -c "from stonkfly.data import prepare; prepare()"
if ($LASTEXITCODE -ne 0) { throw "MaleCNS preparation failed with exit code $LASTEXITCODE" }

