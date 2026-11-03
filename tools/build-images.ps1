# Renders the social preview card and PNG app icons from brand-kit/*.html with headless Chrome.
#   powershell -File tools/build-images.ps1
# Outputs: assets/images/og-card.png (1200x630), assets/icons/apple-touch-icon.png (180),
#          assets/icons/icon-192.png, assets/icons/icon-512.png, assets/icons/icon-maskable-512.png
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw 'Chrome or Edge is required.' }

$work = Join-Path ([IO.Path]::GetTempPath()) "site-images-$PID"
New-Item -ItemType Directory -Force $work | Out-Null
Add-Type -AssemblyName System.Drawing

function Render([string]$page, [string]$query, [int]$w, [int]$h, [string]$out) {
  $url = 'file:///' + ((Join-Path $root $page) -replace '\\', '/') + $query
  $p = Start-Process $chrome -PassThru -ArgumentList @(
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--virtual-time-budget=3000', "--user-data-dir=$work\profile", "--window-size=$w,$h", "--screenshot=$out", $url)
  if (-not $p.WaitForExit(45000)) { $p.Kill(); throw "Timed out rendering $page" }
  if (-not (Test-Path $out)) { throw "No output for $page" }
}

function Resize([string]$src, [int]$size, [string]$dest) {
  $img = [Drawing.Image]::FromFile($src)
  $bmp = New-Object Drawing.Bitmap $size, $size
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $size, $size)
  $bmp.Save($dest, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  "  $dest"
}

try {
  Render 'brand-kit\og-card.html' '' 1200 630 (Join-Path $root 'assets\images\og-card.png')
  '  assets\images\og-card.png'

  Render 'brand-kit\icon.html' '' 512 512 "$work\icon.png"
  Render 'brand-kit\icon.html' '?pad=0.28' 512 512 "$work\icon-maskable.png"
  Resize "$work\icon.png" 180 (Join-Path $root 'assets\icons\apple-touch-icon.png')
  Resize "$work\icon.png" 192 (Join-Path $root 'assets\icons\icon-192.png')
  Resize "$work\icon.png" 512 (Join-Path $root 'assets\icons\icon-512.png')
  Resize "$work\icon-maskable.png" 512 (Join-Path $root 'assets\icons\icon-maskable-512.png')
} finally {
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe' OR Name='msedge.exe'" |
    Where-Object { $_.CommandLine -like "*$work*" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
}
