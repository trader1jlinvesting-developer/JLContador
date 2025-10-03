# --- CONFIGURACIÓN ---
$JAVA17_PATH = "C:\Program Files\Java\jdk-17"
$PROJECT_PATH = "C:\Users\DELL\Documents\GitHub\JLContador"

# --- CAMBIAR JAVA_HOME ---
Write-Host "Configurando Java 17..."
$env:JAVA_HOME = $JAVA17_PATH
$env:Path = "$env:JAVA_HOME\bin;" + ($env:Path -split ';' | Where-Object { $_ -notmatch "jdk-.*" } | ForEach-Object { $_ }) -join ';'

# --- VERIFICAR JAVA ---
Write-Host "Java actual:"
java -version

# --- NAVEGAR A PROYECTO ---
Set-Location $PROJECT_PATH

# --- CONSTRUIR APP IONIC ---
Write-Host "Construyendo proyecto Ionic..."
ionic build --prod

# --- COPIAR ARCHIVOS A ANDROID ---
Write-Host "Copiando archivos a Android..."
npx cap copy android

# --- NAVEGAR A CARPETA ANDROID ---
Set-Location "$PROJECT_PATH\android"

# --- LIMPIAR PROYECTO ANDROID ---
Write-Host "Limpiando proyecto Android..."
./gradlew clean

# --- GENERAR APK DEBUG ---
Write-Host "Generando APK debug..."
./gradlew assembleDebug

# --- FIN ---
Write-Host "APK generado en android/app/build/outputs/apk/debug/app-debug.apk"
