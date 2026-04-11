import sys
import os

# Garante que o diretório raiz do backend está no PYTHONPATH
# para que os imports 'src.*' funcionem no ambiente serverless da Vercel
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.main import app  # noqa: E402, F401 - necessário para o Vercel encontrar o app
