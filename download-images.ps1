# Script to download all original images and replace placeholders
Write-Host "🖼️ Starting image download and replacement process..." -ForegroundColor Green

# Create images directory structure
$imageDir = "public/images"
$scooterDir = "$imageDir/scooters"
$ownerDir = "$imageDir/owner"
$featuresDir = "$imageDir/features"
$bonusDir = "$imageDir/bonus"
$scamDir = "$imageDir/scam"

# Create directories if they don't exist
@($imageDir, $scooterDir, $ownerDir, $featuresDir, $bonusDir, $scamDir) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force
        Write-Host "Created directory: $_" -ForegroundColor Yellow
    }
}

# Define image mappings (original URL -> local path)
$imageMap = @{
    # Scooter images
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/e088624e-6193-469a-9830-21dc36c2b22c.jpg" = "$scooterDir/nmax.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/01c394c4-103c-4252-b72e-c145e63bc7ca.jpg" = "$scooterDir/filano.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/1a3b8f00-025b-4e53-acae-79ab73fe2d59.jpg" = "$scooterDir/gpx150.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/09d0d5be-4596-4b58-a8fd-e4991c32fbf3.jpg" = "$scooterDir/gt270.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/f53d83b7-b91b-4421-a7ef-ff2e18032e87.jpg" = "$scooterDir/bestseller1.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/e78b7679-8600-4881-bd1b-97604003c2ea.jpg" = "$scooterDir/nmax2.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/2ee02e8f-4ed5-404d-a599-0dbc33ef1b65.jpg" = "$scooterDir/helmet.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/1b26ae5d-d800-41e5-bd6f-a725ad2a3d3e.jpg" = "$scooterDir/bestseller2.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/bb70be50-827d-472b-bb3d-b98c45f47fad.jpg" = "$scooterDir/gt270-premium.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/40a63113-a786-42ee-85ce-3974cc9b5fbd.jpg" = "$scooterDir/bestseller3.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/94b7831f-68ed-4afa-9102-4628892b18bb.jpg" = "$scooterDir/bestseller4.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/10ce6f20-bf11-4b73-b919-00a04a48c5b4.jpg" = "$scooterDir/bestseller5.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/72f4ee4c-2128-485e-8804-a90181d571a3.jpg" = "$scooterDir/bestseller6.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/c81c1b92-f8f3-4a44-ab8f-a8fb5032de63.jpg" = "$scooterDir/xmax300.jpg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/413f9a9d-ee0d-46be-9da3-425971ec1d33.jpg" = "$scooterDir/nmax-abs.jpg"
    
    # Owner image
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/7f8cd808-f084-4312-b588-45cb3d269b92.jpg" = "$ownerDir/alex.jpg"
    
    # Feature icons
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/e3564c10-f9b3-4d79-be2c-c99b4b6dc1aa.png" = "$featuresDir/video-recorder.png"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/4fef2f0d-12d9-447a-8fdf-c3f743c43f6f.svg" = "$featuresDir/insurance.svg"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/ec5d8a65-febf-4d5a-980d-9e89a787a7c0.png" = "$featuresDir/no-breakdowns.png"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/a94c704e-dc88-48af-b899-4f90d0c6e51b.png" = "$featuresDir/best-seller.png"
    
    # Bonus icons
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/9debb423-29b6-4834-876c-85fbcfe6fdbb.png" = "$bonusDir/restaurant.png"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/c9dbd64b-012a-46b2-a7c0-c62eb1ea61d6.png" = "$bonusDir/photo-routes.png"
    
    # Scam warning images
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/12c879a2-efb9-4efa-93f2-09564bb22599.png" = "$scamDir/dashcam1.png"
    "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/2b604a99-9c5f-4c34-9abb-809446680012.png" = "$scamDir/dashcam2.png"
}

# Download function
function Download-Image {
    param($url, $path)
    try {
        Write-Host "Downloading: $url -> $path" -ForegroundColor Cyan
        Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
        Write-Host "✅ Downloaded: $path" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to download: $url" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Download all images
$successCount = 0
$totalCount = $imageMap.Count

Write-Host "`n🚀 Starting download of $totalCount images..." -ForegroundColor Yellow

foreach ($mapping in $imageMap.GetEnumerator()) {
    if (Download-Image -url $mapping.Key -path $mapping.Value) {
        $successCount++
    }
    Start-Sleep -Milliseconds 500  # Be nice to the server
}

Write-Host "`n📊 Download Summary:" -ForegroundColor Yellow
Write-Host "✅ Successful: $successCount/$totalCount" -ForegroundColor Green
if ($successCount -lt $totalCount) {
    Write-Host "❌ Failed: $($totalCount - $successCount)" -ForegroundColor Red
}

Write-Host "`n🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update image-catalog.ts to use local paths" -ForegroundColor White
Write-Host "2. Deploy changes to server" -ForegroundColor White
Write-Host "3. Test all images load correctly" -ForegroundColor White

Write-Host "`nImage download process completed!" -ForegroundColor Green
