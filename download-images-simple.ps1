# Script to download all original images
Write-Host "Starting image download process..." -ForegroundColor Green

# Create images directory structure
$imageDir = "public/images"
$scooterDir = "$imageDir/scooters"
$ownerDir = "$imageDir/owner"
$featuresDir = "$imageDir/features"
$bonusDir = "$imageDir/bonus"
$scamDir = "$imageDir/scam"

# Create directories
@($imageDir, $scooterDir, $ownerDir, $featuresDir, $bonusDir, $scamDir) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force
        Write-Host "Created directory: $_"
    }
}

# Define image mappings
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
}

# Download function
function Download-Image {
    param($url, $path)
    try {
        Write-Host "Downloading: $url -> $path"
        Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
        Write-Host "Downloaded: $path" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Failed to download: $url" -ForegroundColor Red
        return $false
    }
}

# Download all images
$successCount = 0
$totalCount = $imageMap.Count

Write-Host "Starting download of $totalCount images..."

foreach ($mapping in $imageMap.GetEnumerator()) {
    if (Download-Image -url $mapping.Key -path $mapping.Value) {
        $successCount++
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "Download Summary:"
Write-Host "Successful: $successCount/$totalCount" -ForegroundColor Green

Write-Host "Image download process completed!" -ForegroundColor Green
