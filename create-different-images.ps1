# Create visually different images for each scooter
Write-Host "Creating visually different scooter images..." -ForegroundColor Green

$scooterDir = "public/images/scooters"

# Create different colored SVG images for each scooter
$scooters = @{
    "nmax.jpg" = @{ name = "YAMAHA NMAX"; color1 = "#667eea"; color2 = "#764ba2" }
    "filano.jpg" = @{ name = "YAMAHA FILANO"; color1 = "#f093fb"; color2 = "#f5576c" }
    "gpx150.jpg" = @{ name = "GPX 150cc"; color1 = "#4facfe"; color2 = "#00f2fe" }
    "gt270.jpg" = @{ name = "GT 270 ABS"; color1 = "#43e97b"; color2 = "#38f9d7" }
    "bestseller1.jpg" = @{ name = "BEST SELLER"; color1 = "#fa709a"; color2 = "#fee140" }
    "nmax2.jpg" = @{ name = "NMAX VARIANT"; color1 = "#a8edea"; color2 = "#fed6e3" }
    "helmet.jpg" = @{ name = "PREMIUM HELMET"; color1 = "#ff9a9e"; color2 = "#fecfef" }
    "bestseller2.jpg" = @{ name = "GPX BESTSELLER"; color1 = "#ffecd2"; color2 = "#fcb69f" }
    "gt270-premium.jpg" = @{ name = "GT 270 PREMIUM"; color1 = "#667eea"; color2 = "#764ba2" }
    "bestseller3.jpg" = @{ name = "BESTSELLER 2024"; color1 = "#f093fb"; color2 = "#f5576c" }
    "bestseller4.jpg" = @{ name = "BESTSELLER V2"; color1 = "#4facfe"; color2 = "#00f2fe" }
    "bestseller5.jpg" = @{ name = "BESTSELLER V3"; color1 = "#43e97b"; color2 = "#38f9d7" }
    "bestseller6.jpg" = @{ name = "PREMIUM SELLER"; color1 = "#fa709a"; color2 = "#fee140" }
    "xmax300.jpg" = @{ name = "XMAX 300cc"; color1 = "#a8edea"; color2 = "#fed6e3" }
    "nmax-abs.jpg" = @{ name = "NMAX ABS"; color1 = "#ff9a9e"; color2 = "#fecfef" }
}

foreach ($scooter in $scooters.GetEnumerator()) {
    $filename = $scooter.Key
    $info = $scooter.Value
    $outputPath = "$scooterDir/$filename"
    
    # Create SVG content with unique colors
    $svgContent = @"
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:$($info.color1);stop-opacity:1" />
      <stop offset="100%" style="stop-color:$($info.color2);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad1)" rx="15"/>
  <circle cx="350" cy="50" r="30" fill="rgba(255,255,255,0.2)"/>
  <circle cx="50" cy="250" r="40" fill="rgba(255,255,255,0.1)"/>
  <text x="200" y="130" font-family="Arial, sans-serif" font-size="22" font-weight="bold" 
        text-anchor="middle" fill="white">$($info.name)</text>
  <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="white">Smile Rental Phuket</text>
  <text x="200" y="185" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="rgba(255,255,255,0.8)">Premium Scooter Rental</text>
  <rect x="150" y="200" width="100" height="30" fill="rgba(255,255,255,0.2)" rx="15"/>
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="12" font-weight="bold"
        text-anchor="middle" fill="white">AVAILABLE</text>
</svg>
"@
    
    # Save as SVG first
    $svgPath = $outputPath -replace "\.jpg$", ".svg"
    $svgContent | Out-File -FilePath $svgPath -Encoding UTF8
    
    Write-Host "Created SVG: $svgPath" -ForegroundColor Green
}

Write-Host "`nNow converting SVG to JPG using browser..." -ForegroundColor Yellow

# Create HTML file to display all SVGs for screenshot conversion
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        .scooter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .scooter-item { text-align: center; }
        .scooter-item h3 { margin: 10px 0; }
        svg { border: 2px solid #ddd; border-radius: 10px; }
    </style>
</head>
<body>
    <h1>Scooter Images for Conversion</h1>
    <div class="scooter-grid">
"@

foreach ($scooter in $scooters.GetEnumerator()) {
    $filename = $scooter.Key
    $svgPath = "$scooterDir/$($filename -replace '\.jpg$', '.svg')"
    $svgContent = Get-Content $svgPath -Raw
    
    $htmlContent += @"
        <div class="scooter-item">
            <h3>$filename</h3>
            $svgContent
        </div>
"@
}

$htmlContent += @"
    </div>
</body>
</html>
"@

$htmlFile = "scooter-conversion.html"
$htmlContent | Out-File -FilePath $htmlFile -Encoding UTF8

Write-Host "Created conversion HTML: $htmlFile" -ForegroundColor Green
Write-Host "You can open this file and screenshot each SVG to create JPG files" -ForegroundColor Yellow

Write-Host "`nFor now, updating image catalog to use SVG files..." -ForegroundColor Cyan
