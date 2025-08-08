# Batch download all remaining scooter images
Write-Host "Downloading remaining scooter images..." -ForegroundColor Green

$downloads = @(
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/01c394c4-103c-4252-b72e-c145e63bc7ca.jpg"; file = "public/images/scooters/filano.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/2ee02e8f-4ed5-404d-a599-0dbc33ef1b65.jpg"; file = "public/images/scooters/helmet.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/1a3b8f00-025b-4e53-acae-79ab73fe2d59.jpg"; file = "public/images/scooters/gpx150.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/09d0d5be-4596-4b58-a8fd-e4991c32fbf3.jpg"; file = "public/images/scooters/gt270.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/f53d83b7-b91b-4421-a7ef-ff2e18032e87.jpg"; file = "public/images/scooters/bestseller1.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/e78b7679-8600-4881-bd1b-97604003c2ea.jpg"; file = "public/images/scooters/nmax2.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/1b26ae5d-d800-41e5-bd6f-a725ad2a3d3e.jpg"; file = "public/images/scooters/bestseller2.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/bb70be50-827d-472b-bb3d-b98c45f47fad.jpg"; file = "public/images/scooters/gt270-premium.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/40a63113-a786-42ee-85ce-3974cc9b5fbd.jpg"; file = "public/images/scooters/bestseller3.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/94b7831f-68ed-4afa-9102-4628892b18bb.jpg"; file = "public/images/scooters/bestseller4.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/10ce6f20-bf11-4b73-b919-00a04a48c5b4.jpg"; file = "public/images/scooters/bestseller5.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/72f4ee4c-2128-485e-8804-a90181d571a3.jpg"; file = "public/images/scooters/bestseller6.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/c81c1b92-f8f3-4a44-ab8f-a8fb5032de63.jpg"; file = "public/images/scooters/xmax300.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/413f9a9d-ee0d-46be-9da3-425971ec1d33.jpg"; file = "public/images/scooters/nmax-abs.jpg" },
    @{ url = "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/7f8cd808-f084-4312-b588-45cb3d269b92.jpg"; file = "public/images/owner/alex.jpg" }
)

$success = 0
$total = $downloads.Count

foreach ($download in $downloads) {
    try {
        Write-Host "Downloading: $(Split-Path $download.file -Leaf)"
        Invoke-WebRequest -Uri $download.url -OutFile $download.file -UseBasicParsing
        
        if (Test-Path $download.file) {
            $size = (Get-Item $download.file).Length
            Write-Host "Success: $(Split-Path $download.file -Leaf) ($size bytes)" -ForegroundColor Green
            $success++
        }
    } catch {
        Write-Host "Failed: $(Split-Path $download.file -Leaf)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 300
}

Write-Host "`nDownload complete: $success/$total images" -ForegroundColor Yellow
