$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Node = (Get-Command node.exe).Source
$DailyScript = Join-Path $ProjectRoot "scripts\daily.mjs"
$Action = New-ScheduledTaskAction -Execute $Node -Argument "`"$DailyScript`"" -WorkingDirectory $ProjectRoot
$Settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

$Tasks = @(
    @{ Name = "FlyFund-Arena-US-Close"; Time = "07:10"; Description = "Update US close data and MaleCNS paper decisions" },
    @{ Name = "FlyFund-Arena-KRX-Close"; Time = "16:10"; Description = "Update KRX close data and MaleCNS paper decisions" }
)

foreach ($Task in $Tasks) {
    $Trigger = New-ScheduledTaskTrigger -Daily -At $Task.Time
    Register-ScheduledTask -TaskName $Task.Name -Action $Action -Trigger $Trigger -Settings $Settings -Description $Task.Description -Force | Out-Null
    Write-Output "registered=$($Task.Name) time=$($Task.Time)"
}

