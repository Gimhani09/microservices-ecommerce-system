Write-Host "=== PAYMENT API TESTS ===" -ForegroundColor Cyan

$createPaymentBody = @{
    orderId = 101
    amount = 299.99
} | ConvertTo-Json

Write-Host "=== TEST 1: Create Payment ===" -ForegroundColor Cyan
try {
    $response1 = Invoke-WebRequest -Uri "http://localhost:5000/api/payments" 
        -Method Post 
        -ContentType 'application/json' 
        -Body $createPaymentBody 
        -UseBasicParsing

    Write-Host "Response Status: $($response1.StatusCode)" -ForegroundColor Green
    $paymentData = $response1.Content | ConvertFrom-Json
    Write-Host ($paymentData | ConvertTo-Json -Depth 10)
    
    $paymentId = $paymentData.id
    Write-Host ""
    Write-Host "Extracted Payment ID: $paymentId" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "=== TEST 2: Get Payments by Order ===" -ForegroundColor Cyan
    $response2 = Invoke-WebRequest -Uri "http://localhost:5000/api/payments/order/101" 
        -Method Get 
        -UseBasicParsing
    
    Write-Host "Response Status: $($response2.StatusCode)" -ForegroundColor Green
    $paymentsData = $response2.Content | ConvertFrom-Json
    Write-Host ($paymentsData | ConvertTo-Json -Depth 10)
    Write-Host ""
    
    Write-Host "=== TEST 3: Get Payment by ID ===" -ForegroundColor Cyan
    $response3 = Invoke-WebRequest -Uri "http://localhost:5000/api/payments/$paymentId" 
        -Method Get 
        -UseBasicParsing
    
    Write-Host "Response Status: $($response3.StatusCode)" -ForegroundColor Green
    $paymentByIdData = $response3.Content | ConvertFrom-Json
    Write-Host ($paymentByIdData | ConvertTo-Json -Depth 10)
    Write-Host ""
    
    Write-Host "=== TEST 4: Update Payment Status ===" -ForegroundColor Cyan
    $updateBody = @{
        status = "REFUNDED"
    } | ConvertTo-Json
    
    $response4 = Invoke-WebRequest -Uri "http://localhost:5000/api/payments/$paymentId" 
        -Method Patch 
        -ContentType 'application/json' 
        -Body $updateBody 
        -UseBasicParsing
    
    Write-Host "Response Status: $($response4.StatusCode)" -ForegroundColor Green
    $updatedData = $response4.Content | ConvertFrom-Json
    Write-Host ($updatedData | ConvertTo-Json -Depth 10)
    Write-Host ""
    
    Write-Host "=== TEST 5: List All Payments ===" -ForegroundColor Cyan
    $response5 = Invoke-WebRequest -Uri "http://localhost:5000/api/payments" 
        -Method Get 
        -UseBasicParsing
    
    Write-Host "Response Status: $($response5.StatusCode)" -ForegroundColor Green
    $allPayments = $response5.Content | ConvertFrom-Json
    $content = $allPayments | ConvertTo-Json -Depth 10
    $lines = $content -split "
"
    
    if ($lines.Count -le 10) {
        Write-Host $content
    } else {
        Write-Host "First 5 lines:" -ForegroundColor Yellow
        for ($i = 0; $i -lt 5; $i++) {
            Write-Host $lines[$i]
        }
        Write-Host "..." -ForegroundColor Yellow
        Write-Host "Last 5 lines:" -ForegroundColor Yellow
        for ($i = [Math]::Max(0, $lines.Count - 5); $i -lt $lines.Count; $i++) {
            Write-Host $lines[$i]
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "$_" -ForegroundColor Red
}
