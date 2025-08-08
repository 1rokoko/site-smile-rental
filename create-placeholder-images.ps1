# Create proper placeholder images with scooter names
Write-Host "Creating placeholder images with proper names..." -ForegroundColor Green

# Ensure directories exist
$scooterDir = "public/images/scooters"
$ownerDir = "public/images/owner"

if (!(Test-Path $scooterDir)) {
    New-Item -ItemType Directory -Path $scooterDir -Force
}
if (!(Test-Path $ownerDir)) {
    New-Item -ItemType Directory -Path $ownerDir -Force
}

# Copy existing placeholder and rename for each scooter
$sourcePlaceholder = "public/images/scooters/nmax-placeholder.jpg"

if (Test-Path $sourcePlaceholder) {
    # List of scooter images we need
    $scooterImages = @(
        "nmax.jpg",
        "filano.jpg", 
        "gpx150.jpg",
        "gt270.jpg",
        "bestseller1.jpg",
        "nmax2.jpg",
        "helmet.jpg",
        "bestseller2.jpg",
        "gt270-premium.jpg",
        "bestseller3.jpg",
        "bestseller4.jpg",
        "bestseller5.jpg",
        "bestseller6.jpg",
        "xmax300.jpg",
        "nmax-abs.jpg"
    )
    
    foreach ($image in $scooterImages) {
        $destPath = "$scooterDir/$image"
        Copy-Item $sourcePlaceholder $destPath -Force
        Write-Host "Created: $destPath" -ForegroundColor Green
    }
    
    # Create owner placeholder
    Copy-Item $sourcePlaceholder "$ownerDir/alex.jpg" -Force
    Write-Host "Created: $ownerDir/alex.jpg" -ForegroundColor Green
    
    Write-Host "All placeholder images created successfully!" -ForegroundColor Green
} else {
    Write-Host "Source placeholder not found: $sourcePlaceholder" -ForegroundColor Red
}
