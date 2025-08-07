# Create placeholder image directories and files
# This script creates the necessary directory structure and placeholder images

# Create directories
$directories = @(
    "public/images",
    "public/images/scooters", 
    "public/images/icons",
    "public/images/scam-warning",
    "public/images/owner"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    }
}

# Create a simple placeholder image (1x1 transparent PNG)
$placeholderContent = @"
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
"@

# Convert base64 to bytes and save as PNG
$bytes = [Convert]::FromBase64String($placeholderContent)

# Create placeholder images
$placeholderFiles = @(
    "public/images/logo-placeholder.jpg",
    "public/images/trustpilot-reviews.png",
    "public/images/scooters/nmax-placeholder.jpg",
    "public/images/scooters/filano-placeholder.jpg",
    "public/images/scooters/helmet-placeholder.jpg",
    "public/images/scooters/gpx150-placeholder.jpg",
    "public/images/scooters/gt270-placeholder.jpg",
    "public/images/scooters/bestseller1-placeholder.jpg",
    "public/images/scooters/nmax2-placeholder.jpg",
    "public/images/scooters/bestseller2-placeholder.jpg",
    "public/images/scooters/gt270-premium-placeholder.jpg",
    "public/images/scooters/bestseller3-placeholder.jpg",
    "public/images/scooters/bestseller4-placeholder.jpg",
    "public/images/scooters/bestseller5-placeholder.jpg",
    "public/images/scooters/bestseller6-placeholder.jpg",
    "public/images/scooters/xmax300-placeholder.jpg",
    "public/images/scooters/nmax-abs-placeholder.jpg",
    "public/images/icons/restaurant-placeholder.png",
    "public/images/icons/tour-placeholder.png",
    "public/images/icons/photo-routes-placeholder.png",
    "public/images/icons/couples-placeholder.png",
    "public/images/icons/video-recorder-placeholder.png",
    "public/images/icons/insurance-placeholder.svg",
    "public/images/icons/no-breakdowns-placeholder.png",
    "public/images/icons/best-seller-placeholder.png",
    "public/images/scam-warning/dashcam1-placeholder.png",
    "public/images/scam-warning/dashcam2-placeholder.png",
    "public/images/owner/alex-placeholder.jpg"
)

foreach ($file in $placeholderFiles) {
    [System.IO.File]::WriteAllBytes($file, $bytes)
    Write-Host "Created placeholder: $file"
}

Write-Host "All placeholder images created successfully!"
Write-Host "IMPORTANT: Replace these placeholders with actual images before production deployment."
