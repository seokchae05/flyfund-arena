param(
    [string]$CompilerRoot = "C:\tools\flyfund-winlibs\mingw64\bin",
    [string]$BuildRoot = "C:\tools\flyfund-build"
)

$ErrorActionPreference = "Stop"
$Compiler = Join-Path $CompilerRoot "g++.exe"
$Source = Join-Path $PSScriptRoot "..\vendor\stonkfly\neural\kernel.cpp"
$StagedSource = Join-Path $BuildRoot "kernel.cpp"
$Library = Join-Path $BuildRoot "memory.dll"

if (-not (Test-Path -LiteralPath $Compiler)) {
    throw "C++ compiler not found: $Compiler"
}
if (-not (Test-Path -LiteralPath $Source)) {
    throw "Stonkfly kernel source not found: $Source"
}

New-Item -ItemType Directory -Path $BuildRoot -Force | Out-Null
Copy-Item -LiteralPath $Source -Destination $StagedSource -Force
& $Compiler -O3 -std=c++17 -shared $StagedSource -static-libgcc -static-libstdc++ -o $Library
if ($LASTEXITCODE -ne 0) { throw "C++ kernel build failed with exit code $LASTEXITCODE" }

python -c "import ctypes; lib=ctypes.CDLL(r'$Library'); assert lib.memory_advance; print('kernel_load=ok')"
if ($LASTEXITCODE -ne 0) { throw "Python could not load the compiled kernel" }

Get-Item -LiteralPath $Library | Select-Object FullName, Length, LastWriteTime
