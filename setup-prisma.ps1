#!/usr/bin/env pwsh
# Setup script for Prisma + Neon integration

Write-Host "🚀 Setting up Prisma with Neon Database..." -ForegroundColor Green
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Push schema to database
Write-Host "🗄️  Step 2: Pushing schema to Neon database..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema to database" -ForegroundColor Red
    Write-Host "💡 Make sure your DATABASE_URL is correct in .env file" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Schema pushed to database successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Install tsx for seeding
Write-Host "📦 Step 3: Installing tsx for database seeding..." -ForegroundColor Cyan
pnpm add -D tsx
Write-Host "✅ tsx installed successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Seed database
Write-Host "🌱 Step 4: Seeding database with initial data..." -ForegroundColor Cyan
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database seeded successfully" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Login credentials:" -ForegroundColor Cyan
Write-Host "   Admin - Username: admin, Password: admin123, 2FA: 123456" -ForegroundColor White
Write-Host "   User  - Username: user, Password: user123, 2FA: 123456" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Now run: pnpm dev" -ForegroundColor Green
