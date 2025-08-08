# Create unique placeholder images for each scooter with their names
Write-Host "Creating unique scooter images with names..." -ForegroundColor Green

# Ensure ImageMagick or similar tool is available (we'll use simple text overlay)
$scooterDir = "public/images/scooters"

# Define scooter names and their corresponding files
$scooters = @{
    "nmax.jpg" = "YAMAHA NMAX 150cc"
    "filano.jpg" = "YAMAHA FILANO 125cc"
    "gpx150.jpg" = "GPX 150cc BEST SELLER"
    "gt270.jpg" = "GT 270 ABS 150cc"
    "bestseller1.jpg" = "BEST SELLER 2023"
    "nmax2.jpg" = "YAMAHA NMAX VARIANT"
    "helmet.jpg" = "PREMIUM HELMET"
    "bestseller2.jpg" = "GPX BEST SELLER"
    "gt270-premium.jpg" = "GT 270 ABS PREMIUM"
    "bestseller3.jpg" = "BEST SELLER 2024"
    "bestseller4.jpg" = "BEST SELLER 2023 V2"
    "bestseller5.jpg" = "BEST SELLER 2024 V2"
    "bestseller6.jpg" = "PREMIUM BEST SELLER"
    "xmax300.jpg" = "YAMAHA XMAX 300cc ABS"
    "nmax-abs.jpg" = "YAMAHA NMAX ABS 155cc"
}

# Create a simple HTML file that will generate different colored images
$htmlTemplate = @"
<!DOCTYPE html>
<html>
<head>
    <style>
        .scooter-card {
            width: 400px;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 24px;
            color: white;
            text-align: center;
            border-radius: 10px;
            margin: 10px;
        }
        .nmax { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .filano { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .gpx { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .gt270 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .bestseller { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .helmet { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .premium { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
        .xmax { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
    </style>
</head>
<body>
"@

$htmlContent = $htmlTemplate

foreach ($scooter in $scooters.GetEnumerator()) {
    $filename = $scooter.Key
    $name = $scooter.Value
    
    # Determine CSS class based on scooter type
    $cssClass = "bestseller"
    if ($filename -like "*nmax*") { $cssClass = "nmax" }
    elseif ($filename -like "*filano*") { $cssClass = "filano" }
    elseif ($filename -like "*gpx*") { $cssClass = "gpx" }
    elseif ($filename -like "*gt270*") { $cssClass = "gt270" }
    elseif ($filename -like "*helmet*") { $cssClass = "helmet" }
    elseif ($filename -like "*xmax*") { $cssClass = "xmax" }
    elseif ($filename -like "*premium*") { $cssClass = "premium" }
    
    $htmlContent += @"
<div class="scooter-card $cssClass">
    <div>$name</div>
    <div style="font-size: 16px; margin-top: 10px;">Smile Rental Phuket</div>
</div>
"@
}

$htmlContent += @"
</body>
</html>
"@

# Save HTML file
$htmlFile = "scooter-images-generator.html"
$htmlContent | Out-File -FilePath $htmlFile -Encoding UTF8

Write-Host "Created HTML generator: $htmlFile" -ForegroundColor Green
Write-Host "Open this file in a browser and take screenshots of each scooter card" -ForegroundColor Yellow
Write-Host "Or use a headless browser to generate images programmatically" -ForegroundColor Yellow

# Alternative: Create simple text-based images using PowerShell
Write-Host "`nCreating simple text-based images..." -ForegroundColor Cyan

foreach ($scooter in $scooters.GetEnumerator()) {
    $filename = $scooter.Key
    $name = $scooter.Value
    $outputPath = "$scooterDir/$filename"
    
    # Create a simple SVG image with text
    $svgContent = @"
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad1)" rx="10"/>
  <text x="200" y="140" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
        text-anchor="middle" fill="white">$name</text>
  <text x="200" y="170" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="white">Smile Rental Phuket</text>
  <text x="200" y="200" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="white">Premium Scooter Rental</text>
</svg>
"@
    
    # Save as SVG (browsers can display SVG as images)
    $svgPath = $outputPath -replace "\.jpg$", ".svg"
    $svgContent | Out-File -FilePath $svgPath -Encoding UTF8
    
    Write-Host "Created: $svgPath" -ForegroundColor Green
}

Write-Host "`nUnique scooter images created!" -ForegroundColor Green
Write-Host "Note: SVG files created. You may need to convert them to JPG for better compatibility." -ForegroundColor Yellow
