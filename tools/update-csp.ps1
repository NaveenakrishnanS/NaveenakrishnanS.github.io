# Recomputes the Content-Security-Policy <meta> in index.html and 404.html.
# Inline <script> blocks (not JSON-LD) are allowed by their SHA-256 hash, so rerun this
# after editing any inline script:   powershell -File tools/update-csp.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

function Get-InlineScriptHashes([string]$html) {
  $sha = [Security.Cryptography.SHA256]::Create()
  [regex]::Matches($html, '<script(?![^>]*\bsrc=)(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', 'Singleline') | ForEach-Object {
    $bytes = [Text.Encoding]::UTF8.GetBytes($_.Groups[1].Value)
    "'sha256-" + [Convert]::ToBase64String($sha.ComputeHash($bytes)) + "'"
  }
}

foreach ($page in 'index.html', '404.html') {
  $path = Join-Path $root $page
  $html = [IO.File]::ReadAllText($path)
  $hashes = (Get-InlineScriptHashes $html) -join ' '
  $policy = @(
    "default-src 'self'",
    "script-src 'self' $hashes".Trim(),
    "style-src 'self' 'unsafe-inline'",   # style="--i:N" attributes drive animation stagger
    "img-src 'self' data:",               # data: for the inline SVG grain texture
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'"
  ) -join '; '
  $new = [regex]::Replace($html, '(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")', "`${1}$policy`${2}")
  [IO.File]::WriteAllText($path, $new, (New-Object Text.UTF8Encoding $false))
  "$page -> $policy"
}
