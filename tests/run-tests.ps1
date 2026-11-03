<#
  Production test suite for the portfolio. Needs only Windows PowerShell 5.1+ and Chrome (or Edge).

    powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1

  Starts a local static server that behaves like GitHub Pages (404.html for missing paths),
  drives headless Chrome over the DevTools protocol, and writes tests/output/report.md plus
  screenshots and a print PDF. Exit code 1 if any check FAILs (WARNs don't fail the run).
#>
param(
  [int]$Port = 8123,
  [int]$DebugPort = 9333
)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$out = Join-Path $PSScriptRoot 'output'
New-Item -ItemType Directory -Force $out | Out-Null
Get-ChildItem $out -File | Remove-Item -Force
$base = "http://127.0.0.1:$Port"
$results = New-Object System.Collections.Generic.List[object]

function Add-Result([string]$area, [string]$check, [bool]$pass, [string]$detail = '', [switch]$WarnOnly) {
  $status = if ($pass) { 'PASS' } elseif ($WarnOnly) { 'WARN' } else { 'FAIL' }
  $results.Add([pscustomobject]@{ Area = $area; Check = $check; Status = $status; Detail = $detail })
  $color = @{ PASS = 'Green'; WARN = 'Yellow'; FAIL = 'Red' }[$status]
  Write-Host ("[{0}] {1}: {2}{3}" -f $status, $area, $check, $(if ($detail) { " ($detail)" } else { '' })) -ForegroundColor $color
}

# ---------------------------------------------------------------- static checks
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel)) }
function Strip-Markup([string]$html) {
  $t = [regex]::Replace($html, '<!--.*?-->', ' ', 'Singleline')
  $t = [regex]::Replace($t, '<(script|style)[^>]*>.*?</\1>', ' ', 'Singleline')
  [regex]::Replace($t, '<[^>]+>', ' ')
}

$pages = @{ 'index.html' = (Read-Text 'index.html'); '404.html' = (Read-Text '404.html') }

foreach ($name in $pages.Keys) {
  $raw = $pages[$name]
  # Structural checks ignore comments and inline script bodies (editing guides mention example markup)
  $html = [regex]::Replace($raw, '<!--.*?-->', '', 'Singleline')
  $html = [regex]::Replace($html, '(<script(?![^>]*application/ld\+json)[^>]*>).*?(</script>)', '$1$2', 'Singleline')
  $area = "Static $name"

  # Every local href/src/srcset points at a real file
  $refs = [regex]::Matches($html, '(?:href|src|srcset)="([^"]+)"') | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch '^(https?:|mailto:|tel:|data:|#)' } | ForEach-Object { ($_ -split '[#?]')[0] } | Where-Object { $_ } | Sort-Object -Unique
  $missing = $refs | Where-Object { -not (Test-Path (Join-Path $root ($_.TrimStart('/').Replace('/', '\')))) }
  Add-Result $area 'Local references resolve' (-not $missing) ($(if ($missing) { $missing -join ', ' } else { "$($refs.Count) refs" }))

  # In-page anchors have targets
  $ids = [regex]::Matches($html, '\sid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
  $dupes = $ids | Group-Object | Where-Object Count -gt 1 | ForEach-Object Name
  Add-Result $area 'No duplicate ids' (-not $dupes) ($dupes -join ', ')
  $anchors = [regex]::Matches($html, 'href="#([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  $dead = $anchors | Where-Object { $ids -notcontains $_ }
  Add-Result $area 'In-page anchors have targets' (-not $dead) ($dead -join ', ')

  # Content rules
  $visible = Strip-Markup $html
  Add-Result $area 'No em or en dashes in visible text' ($visible -notmatch '[–—]')
  Add-Result $area 'No inline event handlers (CSP)' ($html -notmatch '\son[a-z]+="')
  $imgs = [regex]::Matches($html, '<img\b[^>]*>') | ForEach-Object Value
  $badImg = $imgs | Where-Object { $_ -notmatch '\balt="' -or $_ -notmatch '\bwidth="' -or $_ -notmatch '\bheight="' }
  Add-Result $area 'Images have alt, width and height' (-not $badImg) ("$($imgs.Count) images")
  $blank = [regex]::Matches($html, '<a\b[^>]*target="_blank"[^>]*>') | ForEach-Object Value | Where-Object { $_ -notmatch 'rel="[^"]*noopener' }
  Add-Result $area 'target=_blank links use rel=noopener' (-not $blank)
  Add-Result $area 'Has lang, title, description, viewport' (($html -match '<html lang="') -and ($html -match '<title>.+</title>') -and ($html -match 'name="description"') -and ($html -match 'name="viewport"'))
  $levels = [regex]::Matches($html, '<h([1-6])\b') | ForEach-Object { [int]$_.Groups[1].Value }
  $jump = $false; for ($i = 1; $i -lt $levels.Count; $i++) { if ($levels[$i] - $levels[$i - 1] -gt 1) { $jump = $true } }
  Add-Result $area 'Exactly one h1 and no skipped heading levels' ((($levels | Where-Object { $_ -eq 1 }).Count -eq 1) -and -not $jump) ("levels: $($levels -join ' ')")

  # CSP hashes match the inline scripts
  $sha = [Security.Cryptography.SHA256]::Create()
  $hashes = [regex]::Matches($raw, '<script(?![^>]*\bsrc=)(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', 'Singleline') | ForEach-Object {
    "'sha256-" + [Convert]::ToBase64String($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($_.Groups[1].Value))) + "'" }
  $csp = [regex]::Match($html, 'http-equiv="Content-Security-Policy" content="([^"]+)"').Groups[1].Value
  $stale = $hashes | Where-Object { -not $csp.Contains($_) }
  Add-Result $area 'CSP present and inline-script hashes current' ($csp -and -not $stale) ($(if ($stale) { 'run tools/update-csp.ps1' } else { '' }))
}

$index = $pages['index.html']
$title = [regex]::Match($index, '<title>(.+?)</title>').Groups[1].Value
$desc = [regex]::Match($index, 'name="description" content="([^"]+)"').Groups[1].Value
Add-Result 'SEO' 'Title length 30-65 chars' ($title.Length -ge 30 -and $title.Length -le 65) "$($title.Length)"
Add-Result 'SEO' 'Meta description 70-160 chars' ($desc.Length -ge 70 -and $desc.Length -le 160) "$($desc.Length)"
Add-Result 'SEO' 'Canonical, Open Graph and Twitter card tags' (($index -match 'rel="canonical"') -and ($index -match 'og:image"') -and ($index -match 'twitter:card" content="summary_large_image"'))
try {
  $ld = [regex]::Match($index, '<script type="application/ld\+json">(.*?)</script>', 'Singleline').Groups[1].Value | ConvertFrom-Json
  Add-Result 'SEO' 'JSON-LD Person parses' ($ld.'@type' -eq 'Person' -and $ld.name) $ld.name
} catch { Add-Result 'SEO' 'JSON-LD Person parses' $false $_.Exception.Message }
Add-Type -AssemblyName System.Drawing
$og = Join-Path $root 'assets\images\og-card.png'
if (Test-Path $og) { $img = [Drawing.Image]::FromFile($og); Add-Result 'SEO' 'Social card is 1200x630' ($img.Width -eq 1200 -and $img.Height -eq 630) "$($img.Width)x$($img.Height), $([int]((Get-Item $og).Length/1KB)) KB"; $img.Dispose() }
else { Add-Result 'SEO' 'Social card is 1200x630' $false 'missing' }
Add-Result 'SEO' 'robots.txt points at sitemap.xml' ((Test-Path (Join-Path $root 'robots.txt')) -and ((Read-Text 'robots.txt') -match 'Sitemap: https://'))
try { [xml]$sm = Read-Text 'sitemap.xml'; Add-Result 'SEO' 'sitemap.xml is valid XML with a URL' ($sm.urlset.url.loc -ne $null) $sm.urlset.url.loc } catch { Add-Result 'SEO' 'sitemap.xml is valid XML with a URL' $false $_.Exception.Message }
try {
  $man = Read-Text 'site.webmanifest' | ConvertFrom-Json
  $missingIcons = $man.icons | Where-Object { -not (Test-Path (Join-Path $root ($_.src.TrimStart('/').Replace('/', '\')))) } | ForEach-Object src
  Add-Result 'SEO' 'Web manifest parses and icons exist' (-not $missingIcons) ($missingIcons -join ', ')
} catch { Add-Result 'SEO' 'Web manifest parses and icons exist' $false $_.Exception.Message }

$config = Read-Text '_config.yml'
$leaks = 'README.md', 'CLAUDE.md', 'brand-kit/', 'tools/', 'tests/' | Where-Object { $config -notmatch [regex]::Escape($_) }
Add-Result 'Publishing' 'Repo-only files excluded from Pages' (-not $leaks) ($leaks -join ', ')
Add-Result 'Legal' 'Font licence ships with fonts' (Test-Path (Join-Path $root 'assets\fonts\OFL.txt'))

$budgetFiles = 'index.html', 'assets\css\main.css', 'assets\js\main.js', 'assets\fonts\geist-latin.woff2', 'assets\fonts\geist-mono-latin.woff2', 'assets\images\portrait-cutout.webp', 'assets\icons\favicon.svg'
$weight = ($budgetFiles | ForEach-Object { (Get-Item (Join-Path $root $_)).Length } | Measure-Object -Sum).Sum
Add-Result 'Performance' 'First-load weight under 300 KB (uncompressed)' ($weight -lt 300KB) "$([int]($weight/1KB)) KB"

# External links (LinkedIn blocks bots with status 999, so failures there are warnings)
foreach ($url in 'https://github.com/NaveenakrishnanS', 'https://linkedin.com/in/naveenakrishnan-s') {
  try {
    $code = (Invoke-WebRequest $url -UseBasicParsing -Method Head -TimeoutSec 15 -Headers @{ 'User-Agent' = 'Mozilla/5.0' }).StatusCode
    Add-Result 'Links' "Reachable: $url" ($code -lt 400) "$code"
  } catch {
    $code = try { [int]$_.Exception.Response.StatusCode } catch { 0 }
    Add-Result 'Links' "Reachable: $url" $false "status $code (bot-blocked links are expected to fail here)" -WarnOnly
  }
}

# ---------------------------------------------------------------- local server (GitHub Pages-like)
$server = Start-Job -ArgumentList $root, $Port -ScriptBlock {
  param($root, $port)
  $mime = @{ '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
    '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.webp' = 'image/webp'; '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'
    '.xml' = 'application/xml'; '.webmanifest' = 'application/manifest+json'; '.json' = 'application/json' }
  $listener = New-Object Net.Sockets.TcpListener ([Net.IPAddress]::Loopback), $port
  $listener.Start()
  while ($true) {
    $client = $listener.AcceptTcpClient()
    # Browsers open speculative connections that never send a request; don't let one block the server
    $client.ReceiveTimeout = 2000
    try {
      $stream = $client.GetStream()
      $reader = New-Object IO.StreamReader $stream
      $line = $reader.ReadLine()
      if (-not $line) { continue }
      while ($true) { $h = $reader.ReadLine(); if ([string]::IsNullOrEmpty($h)) { break } }
      $parts = $line.Split(' ')
      $path = [Uri]::UnescapeDataString(($parts[1] -split '\?')[0])
      if ($path.EndsWith('/')) { $path += 'index.html' }
      $full = [IO.Path]::GetFullPath((Join-Path $root ($path.TrimStart('/').Replace('/', '\'))))
      $status = '200 OK'
      if (-not $full.StartsWith($root) -or -not (Test-Path $full -PathType Leaf)) { $full = Join-Path $root '404.html'; $status = '404 Not Found' }
      $bytes = [IO.File]::ReadAllBytes($full)
      $type = $mime[[IO.Path]::GetExtension($full).ToLower()]; if (-not $type) { $type = 'application/octet-stream' }
      $head = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n")
      $stream.Write($head, 0, $head.Length)
      if ($parts[0] -ne 'HEAD') { $stream.Write($bytes, 0, $bytes.Length) }
      $stream.Flush()
    } catch {} finally { $client.Close() }
  }
}

# ---------------------------------------------------------------- Chrome over the DevTools protocol
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw 'Chrome or Edge is required.' }
$profileDir = Join-Path ([IO.Path]::GetTempPath()) "site-tests-$PID"
$browser = Start-Process $chrome -PassThru -ArgumentList @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  "--remote-debugging-port=$DebugPort", "--user-data-dir=$profileDir", '--window-size=1440,900', 'about:blank')

$script:ws = $null; $script:msgId = 0; $script:pending = $null; $script:sb = New-Object Text.StringBuilder
$script:buffer = New-Object byte[] 1048576
$script:events = New-Object System.Collections.Generic.List[object]

function Parse-Message([string]$text) {
  if ($text.Length -lt 1500000) { return $text | ConvertFrom-Json }
  # Windows PowerShell's JSON parser caps at ~2 MB; large payloads (screenshots, PDFs) are only data blobs
  [pscustomobject]@{ id = [int][regex]::Match($text, '"id":(\d+)').Groups[1].Value
    result = [pscustomobject]@{ data = [regex]::Match($text, '"data":"([^"]+)"').Groups[1].Value } }
}
function Receive-Message([int]$timeoutMs) {
  $deadline = [DateTime]::UtcNow.AddMilliseconds($timeoutMs)
  while ($true) {
    if (-not $script:pending) { $script:pending = $script:ws.ReceiveAsync([ArraySegment[byte]]$script:buffer, [Threading.CancellationToken]::None) }
    $left = [int][Math]::Max(0, ($deadline - [DateTime]::UtcNow).TotalMilliseconds)
    if (-not $script:pending.Wait($left)) { return $null }
    $r = $script:pending.Result; $script:pending = $null
    [void]$script:sb.Append([Text.Encoding]::UTF8.GetString($script:buffer, 0, $r.Count))
    if ($r.EndOfMessage) { $text = $script:sb.ToString(); [void]$script:sb.Clear(); return (Parse-Message $text) }
  }
}
function Pump([int]$ms) {
  $deadline = [DateTime]::UtcNow.AddMilliseconds($ms)
  while ([DateTime]::UtcNow -lt $deadline) {
    $m = Receive-Message ([int]($deadline - [DateTime]::UtcNow).TotalMilliseconds)
    if ($m -and $m.method) { $script:events.Add($m) }
  }
}
function Cdp([string]$method, $params = @{}, [int]$timeoutMs = 60000) {
  $script:msgId++
  $id = $script:msgId
  $json = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Depth 20 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $script:ws.SendAsync([ArraySegment[byte]]$bytes, 'Text', $true, [Threading.CancellationToken]::None).Wait()
  $deadline = [DateTime]::UtcNow.AddMilliseconds($timeoutMs)
  while ([DateTime]::UtcNow -lt $deadline) {
    $m = Receive-Message ([int]($deadline - [DateTime]::UtcNow).TotalMilliseconds)
    if (-not $m) { break }
    if ($m.method) { $script:events.Add($m); continue }
    if ($m.id -eq $id) {
      if ($m.error) { throw "$method failed: $($m.error.message)" }
      return $m.result
    }
  }
  throw "$method timed out"
}
function Js([string]$expression) {
  $r = Cdp 'Runtime.evaluate' @{ expression = $expression; returnByValue = $true; awaitPromise = $true }
  if ($r.exceptionDetails) { throw "JS error: $($r.exceptionDetails.exception.description)" }
  $r.result.value
}
# Evaluates an expression (await allowed) and returns it parsed from JSON
function JsJson([string]$expression) { (Js "(async () => JSON.stringify($expression))()") | ConvertFrom-Json }
function Go([string]$url, [int]$settleMs = 1500) {
  $script:events.Clear()
  [void](Cdp 'Page.navigate' @{ url = $url })
  $deadline = [DateTime]::UtcNow.AddSeconds(30)
  while ([DateTime]::UtcNow -lt $deadline -and -not ($script:events | Where-Object { $_.method -eq 'Page.loadEventFired' })) { Pump 200 }
  Pump $settleMs
}
function Set-Viewport([int]$w, [int]$h = 900, [bool]$mobile = $false) {
  [void](Cdp 'Emulation.setDeviceMetricsOverride' @{ width = $w; height = $h; deviceScaleFactor = 1; mobile = $mobile })
}
function Set-Media([string]$scheme = 'light', [string]$motion = 'no-preference', [string]$media = '') {
  [void](Cdp 'Emulation.setEmulatedMedia' @{ media = $media; features = @(@{ name = 'prefers-color-scheme'; value = $scheme }, @{ name = 'prefers-reduced-motion'; value = $motion }) })
}
function Save-Shot([string]$name, [switch]$Full) {
  $p = @{ format = 'png' }
  if ($Full) {
    $size = JsJson '{w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight}'
    $p.captureBeyondViewport = $true
    $p.clip = @{ x = 0; y = 0; width = $size.w; height = [Math]::Min($size.h, 16000); scale = 1 }
  }
  $shot = Cdp 'Page.captureScreenshot' $p 120000
  [IO.File]::WriteAllBytes((Join-Path $out "$name.png"), [Convert]::FromBase64String($shot.data))
}
function Page-Problems([string[]]$allowStatus404For = @()) {
  $problems = New-Object System.Collections.Generic.List[string]
  foreach ($e in $script:events) {
    switch ($e.method) {
      'Runtime.exceptionThrown' { $problems.Add("exception: $($e.params.exceptionDetails.exception.description)") }
      'Runtime.consoleAPICalled' { if ($e.params.type -eq 'error') { $problems.Add("console.error: $(($e.params.args | ForEach-Object { $_.value }) -join ' ')") } }
      'Log.entryAdded' {
        $entry = $e.params.entry
        $expected = $entry.url -and ($allowStatus404For | Where-Object { $entry.url -like $_ })
        if ($entry.level -eq 'error' -and -not $expected) { $problems.Add("log: $($entry.text) $($entry.url)") }
      }
      'Network.loadingFailed' { if (-not $e.params.canceled) { $problems.Add("request failed: $($e.params.errorText)") } }
      'Network.responseReceived' {
        $u = $e.params.response.url
        if ($e.params.response.status -ge 400 -and -not ($allowStatus404For | Where-Object { $u -like $_ })) { $problems.Add("HTTP $($e.params.response.status): $u") }
      }
    }
  }
  $problems
}

try {
  $targets = $null
  for ($i = 0; $i -lt 60 -and -not $targets; $i++) { Start-Sleep -Milliseconds 250; try { $targets = Invoke-RestMethod "http://127.0.0.1:$DebugPort/json" } catch {} }
  $pageTarget = $targets | Where-Object type -eq 'page' | Select-Object -First 1
  $script:ws = New-Object System.Net.WebSockets.ClientWebSocket
  $script:ws.ConnectAsync([Uri]$pageTarget.webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait()
  foreach ($d in 'Page', 'Runtime', 'Log', 'Network') { [void](Cdp "$d.enable") }
  [void](Cdp 'Network.setCacheDisabled' @{ cacheDisabled = $true })
  for ($i = 0; $i -lt 40; $i++) { try { Invoke-WebRequest "$base/" -UseBasicParsing -Method Head -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 250 } }

  # ---- Runtime health: errors, CSP violations, third-party requests
  Set-Viewport 1440; Set-Media 'light'
  Go "$base/" 3000
  $problems = Page-Problems
  Add-Result 'Runtime' 'No JS errors, CSP violations or failed requests (desktop)' (-not $problems) ($problems -join ' | ')
  Add-Result 'Runtime' 'main.js finished (window.__siteReady)' ((Js 'window.__siteReady === true') -eq $true)
  $third = JsJson 'performance.getEntriesByType("resource").map(r => r.name).filter(n => !n.startsWith(location.origin))'
  Add-Result 'Security' 'No third-party requests' (-not $third) ($third -join ', ')
  $policy = Js 'document.querySelector(''meta[http-equiv="Content-Security-Policy"]'')?.content || ""'
  Add-Result 'Security' 'CSP active on the served page' ($policy -match "default-src 'self'")

  # ---- Keyboard: first Tab lands on the skip link, which targets main
  [void](Cdp 'Input.dispatchKeyEvent' @{ type = 'keyDown'; key = 'Tab'; code = 'Tab'; windowsVirtualKeyCode = 9 })
  [void](Cdp 'Input.dispatchKeyEvent' @{ type = 'keyUp'; key = 'Tab'; code = 'Tab'; windowsVirtualKeyCode = 9 })
  Add-Result 'Accessibility' 'First Tab focuses the skip link' ((Js 'document.activeElement.className') -eq 'skip-link')

  # ---- Accessibility: axe-core in light and dark, motion settled
  $axe = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'vendor\axe.min.js'))
  foreach ($scheme in 'light', 'dark') {
    [void](Cdp 'Page.setBypassCSP' @{ enabled = $true })
    Set-Media $scheme 'reduce'
    Go "$base/" 1500
    [void](Js $axe)
    $v = JsJson "await axe.run(document, { resultTypes: ['violations'] }).then(r => r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, t: x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(', ') })))"
    $serious = @($v | Where-Object { $_.impact -in 'serious', 'critical' })
    $minor = @($v | Where-Object { $_.impact -notin 'serious', 'critical' })
    Add-Result 'Accessibility' "axe-core: no serious or critical issues ($scheme)" ($serious.Count -eq 0) (($serious | ForEach-Object { "$($_.id) x$($_.n) [$($_.t)]" }) -join '; ')
    if ($minor.Count) { Add-Result 'Accessibility' "axe-core: minor/moderate issues ($scheme)" $false (($minor | ForEach-Object { "$($_.id) x$($_.n) [$($_.t)]" }) -join '; ') -WarnOnly }
    [void](Cdp 'Page.setBypassCSP' @{ enabled = $false })
  }

  # ---- Layout at six widths: no sideways scroll, headline and nav sane; full-page screenshots
  foreach ($w in 320, 390, 768, 1024, 1440, 1920) {
    Set-Viewport $w 900 ($w -le 768); Set-Media 'light' 'reduce'
    Go "$base/" 1200
    $m = JsJson "({ overflow: document.documentElement.scrollWidth - innerWidth, h1Lines: Math.round(document.querySelector('h1').getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight)), navH: document.querySelector('.nav-inner').getBoundingClientRect().height })"
    Add-Result 'Layout' "No horizontal scroll at ${w}px" ($m.overflow -le 0) "overflow $($m.overflow)px"
    Add-Result 'Layout' "Hero headline at most 3 lines at ${w}px" ($m.h1Lines -le 3) "$($m.h1Lines) lines"
    Add-Result 'Layout' "Nav fits one row (<= 80px) at ${w}px" ($m.navH -le 80) "$([int]$m.navH)px"
    Save-Shot "layout-$w" -Full
  }
  Set-Viewport 1440; Set-Media 'dark' 'reduce'; Go "$base/" 1200; Save-Shot 'layout-1440-dark' -Full

  # ---- Reduced motion: nothing left hidden or offset
  Set-Viewport 1440; Set-Media 'light' 'reduce'; Go "$base/" 1200
  $hidden = Js "[...document.querySelectorAll('[data-reveal], .w-i')].filter(e => getComputedStyle(e).opacity !== '1' || !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(e).transform)).length"
  Add-Result 'Accessibility' 'Reduced motion: all content visible without scrolling' ($hidden -eq 0) "$hidden hidden"
  # Split words that share a line must share a baseline (catches mixed-style words drifting)
  $misaligned = Js @"
[...document.querySelectorAll('h1, [data-split]')].flatMap(el => {
  const boxes = [...el.querySelectorAll('.w')].map(w => w.getBoundingClientRect());
  const sameLine = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > Math.min(a.height, b.height) / 2;
  return boxes.filter((a, i) => boxes.some((b, j) => j !== i && sameLine(a, b) && Math.abs(a.bottom - b.bottom) > 1));
}).length
"@
  Add-Result 'Layout' 'Split headline words on the same line share a baseline' ($misaligned -eq 0) "$misaligned misaligned"

  # ---- Motion on: reveals happen when scrolled to
  Set-Media 'light' 'no-preference'; Go "$base/" 1500
  [void](Js "(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } })()")
  Pump 1500
  $notShown = Js "[...document.querySelectorAll('main section:not(.hero) [data-reveal]')].filter(e => !e.classList.contains('is-visible')).length"
  Add-Result 'Motion' 'Every reveal triggers when scrolled into view' ($notShown -eq 0) "$notShown not revealed"
  $counters = JsJson "[...document.querySelectorAll('[data-count-to]')].map(e => e.textContent)"
  Add-Result 'Motion' 'Counters end on their real values' (($counters -join '|') -eq '3+|<200 ms') ($counters -join ', ')

  # ---- No JavaScript at all: content still visible
  [void](Cdp 'Emulation.setScriptExecutionDisabled' @{ value = $true })
  Go "$base/" 1500
  [void](Cdp 'Emulation.setScriptExecutionDisabled' @{ value = $false })
  $r = JsJson "({ js: document.documentElement.classList.contains('js'), hidden: [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity !== '1').length })"
  Add-Result 'Resilience' 'Without JavaScript, all content is visible' ((-not $r.js) -and $r.hidden -eq 0) "js class: $($r.js), hidden: $($r.hidden)"

  # ---- main.js fails to load: the inline guard reveals content
  [void](Cdp 'Network.setBlockedURLs' @{ urls = @('*main.js*') })
  Go "$base/" 2000
  $r = JsJson "({ js: document.documentElement.classList.contains('js'), hidden: [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity !== '1').length })"
  Add-Result 'Resilience' 'If main.js fails, content still shows' ((-not $r.js) -and $r.hidden -eq 0) "js class: $($r.js), hidden: $($r.hidden)"

  # ---- Portrait fails to load: monogram fallback
  [void](Cdp 'Network.setBlockedURLs' @{ urls = @('*portrait-cutout*') })
  Go "$base/" 1500
  $r = JsJson "({ picture: !!document.querySelector('.portrait picture'), mono: getComputedStyle(document.querySelector('.monogram')).display })"
  Add-Result 'Resilience' 'Portrait failure falls back to the monogram' ((-not $r.picture) -and $r.mono -ne 'none') "picture present: $($r.picture)"
  [void](Cdp 'Network.setBlockedURLs' @{ urls = @() })

  # ---- Mobile menu: opens, traps focus, Escape closes and returns focus
  Set-Viewport 390 844 $true; Set-Media 'light' 'no-preference'; Go "$base/" 1500
  [void](Js "document.querySelector('.menu-toggle').click()")
  Pump 600
  $r = JsJson "({ expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), mainInert: document.querySelector('main').inert, focusInMenu: document.getElementById('menu').contains(document.activeElement) })"
  Add-Result 'Interaction' 'Mobile menu opens with focus inside and page inert' ($r.expanded -eq 'true' -and $r.mainInert -and $r.focusInMenu) "expanded $($r.expanded), inert $($r.mainInert), focus in menu $($r.focusInMenu)"
  [void](Js "document.getAnimations().forEach(a => a.finish())")
  Save-Shot 'menu-open-390'
  [void](Cdp 'Input.dispatchKeyEvent' @{ type = 'keyDown'; key = 'Escape'; code = 'Escape'; windowsVirtualKeyCode = 27 })
  [void](Cdp 'Input.dispatchKeyEvent' @{ type = 'keyUp'; key = 'Escape'; code = 'Escape'; windowsVirtualKeyCode = 27 })
  Pump 300
  $r = JsJson "({ expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), mainInert: document.querySelector('main').inert, focusOnToggle: document.activeElement === document.querySelector('.menu-toggle') })"
  Add-Result 'Interaction' 'Escape closes the menu and returns focus' ($r.expanded -eq 'false' -and -not $r.mainInert -and $r.focusOnToggle)

  # ---- Copy email: success and failure messages
  Set-Viewport 1440; Go "$base/" 1000
  $ok = Js "(async () => { navigator.clipboard.writeText = async t => { window.__copied = t }; document.querySelector('[data-copy]').click(); await new Promise(r => setTimeout(r, 100)); return window.__copied + ' / ' + document.getElementById('copyStatus').textContent })()"
  Add-Result 'Interaction' 'Copy button copies the email and confirms' ($ok -eq 'snaveenakrishnan@gmail.com / Email address copied.') $ok
  $fail = Js "(async () => { navigator.clipboard.writeText = async () => { throw new Error('denied') }; document.querySelector('[data-copy]').click(); await new Promise(r => setTimeout(r, 100)); return document.getElementById('copyStatus').textContent })()"
  Add-Result 'Interaction' 'Copy failure shows a clear message' ($fail -like 'Could not copy*') $fail

  # ---- Experience roles open and close
  $r = Js "(() => { const d = document.querySelectorAll('details.role')[1]; d.querySelector('summary').click(); const a = d.open; d.querySelector('summary').click(); return a && !d.open })()"
  Add-Result 'Interaction' 'Experience roles toggle open and closed' ($r -eq $true)

  # ---- Print: everything expanded and visible, PDF produced
  Set-Media 'light' 'no-preference' 'print'
  [void](Js "dispatchEvent(new Event('beforeprint'))")
  $r = JsJson "({ closed: document.querySelectorAll('details.role:not([open])').length, hidden: [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity !== '1').length, nav: getComputedStyle(document.querySelector('.site-nav')).display, counters: [...document.querySelectorAll('[data-count-to]')].map(e => e.textContent).join('|') })"
  Add-Result 'Print' 'Print view expands roles, shows all content, hides nav' ($r.closed -eq 0 -and $r.hidden -eq 0 -and $r.nav -eq 'none') "closed $($r.closed), hidden $($r.hidden), nav $($r.nav)"
  Add-Result 'Print' 'Counters print their final values' ($r.counters -eq '3+|<200 ms') $r.counters
  $pdf = Cdp 'Page.printToPDF' @{ printBackground = $true; preferCSSPageSize = $true } 120000
  $pdfBytes = [Convert]::FromBase64String($pdf.data)
  [IO.File]::WriteAllBytes((Join-Path $out 'print.pdf'), $pdfBytes)
  $pagesInPdf = ([regex]::Matches([Text.Encoding]::ASCII.GetString($pdfBytes), '/Type\s*/Page[^s]')).Count
  Add-Result 'Print' 'PDF renders in a sensible page count (2-6)' ($pagesInPdf -ge 2 -and $pagesInPdf -le 6) "$pagesInPdf pages" -WarnOnly:($pagesInPdf -gt 0)
  [void](Js "dispatchEvent(new Event('afterprint'))")
  $restored = Js "document.querySelectorAll('details.role[open]').length"
  Add-Result 'Print' 'Roles collapse again after printing' ($restored -eq 1) "$restored open"
  Set-Media 'light'

  # ---- Performance on a throttled mobile connection (Slow 4G, 4x CPU)
  Set-Viewport 390 844 $true; Set-Media 'light' 'no-preference'
  [void](Cdp 'Network.emulateNetworkConditions' @{ offline = $false; latency = 150; downloadThroughput = 200000; uploadThroughput = 93750 })
  [void](Cdp 'Emulation.setCPUThrottlingRate' @{ rate = 4 })
  Go "$base/" 4000
  $p = JsJson @"
await new Promise(done => {
  let lcp = 0, cls = 0;
  new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value }).observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    done({ lcp: Math.round(lcp), cls: +cls.toFixed(4), fcp: Math.round(fcp ? fcp.startTime : 0), requests: resources.length + 1,
           kb: Math.round((resources.reduce((a, b) => a + (b.encodedBodySize || 0), 0) + nav.encodedBodySize) / 1024) });
  }, 300);
})
"@
  [void](Cdp 'Network.emulateNetworkConditions' @{ offline = $false; latency = 0; downloadThroughput = -1; uploadThroughput = -1 })
  [void](Cdp 'Emulation.setCPUThrottlingRate' @{ rate = 1 })
  Add-Result 'Performance' 'LCP under 2.5 s (Slow 4G, 4x CPU)' ($p.lcp -gt 0 -and $p.lcp -lt 2500) "$($p.lcp) ms, FCP $($p.fcp) ms"
  Add-Result 'Performance' 'CLS under 0.1' ($p.cls -lt 0.1) "$($p.cls)"
  Add-Result 'Performance' 'Requests and transfer size' ($p.requests -le 15) "$($p.requests) requests, $($p.kb) KB"

  # ---- 404 page, served like GitHub Pages at a nested missing path
  Set-Viewport 1440; Set-Media 'dark' 'reduce'
  Go "$base/" 600
  Go "$base/some/missing/page" 1500
  $problems = Page-Problems @("$base/some/missing/page")
  $r = JsJson "({ title: document.title, styled: getComputedStyle(document.body).backgroundColor, h1: document.querySelector('h1')?.textContent, font: document.fonts.check('16px Geist') })"
  Add-Result '404' 'Nested missing path serves the styled 404 page' ($r.title -like 'Page not found*' -and $r.styled -eq 'rgb(18, 19, 18)' -and $r.font) "title '$($r.title)', bg $($r.styled), font $($r.font)"
  Add-Result '404' 'No errors on the 404 page' (-not $problems) ($problems -join ' | ')
  Save-Shot '404-1440'
  [void](Js "document.querySelector('[data-back]').click()")
  Pump 1500
  $after = Js 'location.pathname'
  Add-Result '404' 'Go back returns to the previous page' ($after -eq '/') "now at $after"

  # ---- Legacy redirect
  Go "$base/portfolio.html" 2500
  Add-Result 'Publishing' 'portfolio.html redirects to the home page' ((Js 'location.pathname') -eq '/')
}
catch {
  Add-Result 'Suite' 'Test run completed' $false $_.Exception.Message
}
finally {
  try { $script:ws.Dispose() } catch {}
  Stop-Process -Id $browser.Id -Force -ErrorAction SilentlyContinue
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe' OR Name='msedge.exe'" | Where-Object { $_.CommandLine -like "*$profileDir*" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Stop-Job $server -ErrorAction SilentlyContinue; Remove-Job $server -Force -ErrorAction SilentlyContinue
  Remove-Item $profileDir -Recurse -Force -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------- report
$pass = @($results | Where-Object Status -eq 'PASS').Count
$warn = @($results | Where-Object Status -eq 'WARN').Count
$fail = @($results | Where-Object Status -eq 'FAIL').Count
$lines = @("# Test report", '', "Run: $(Get-Date -Format 'yyyy-MM-dd HH:mm')  |  PASS $pass  |  WARN $warn  |  FAIL $fail", '', '| Status | Area | Check | Detail |', '|---|---|---|---|')
$lines += $results | ForEach-Object { "| $($_.Status) | $($_.Area) | $($_.Check) | $(($_.Detail -replace '\|', '/')) |" }
$lines += '', 'Screenshots and print.pdf are in this folder.'
[IO.File]::WriteAllLines((Join-Path $out 'report.md'), $lines, (New-Object Text.UTF8Encoding $false))
Write-Host ''
Write-Host "PASS $pass  WARN $warn  FAIL $fail   (report: tests/output/report.md)" -ForegroundColor $(if ($fail) { 'Red' } elseif ($warn) { 'Yellow' } else { 'Green' })
if ($fail) { exit 1 }
