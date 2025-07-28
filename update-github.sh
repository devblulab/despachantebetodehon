
#!/bin/bash

# Script para atualizar o repositório GitHub
echo "🚀 Atualizando repositório GitHub..."

# Adicionar todos os arquivos
git add .

# Commit com timestamp
git commit -m "🔄 Atualização do projeto - $(date '+%Y-%m-%d %H:%M:%S')"

# Push para o repositório
git push origin main

echo "✅ Repositório atualizado com sucesso!"
echo "🌐 Deploy automático no Vercel será iniciado..."
