from django.core.management.base import BaseCommand
import pandas as pd
import requests
import time
import re
from biblioteca.models import Livro
from django.db.models import Q

class Command(BaseCommand):
    help = "Atualiza apenas a sinopse dos livros existentes"

    def handle(self, *args, **options):
        df = pd.read_excel("biblioteca/management/commands/Livros.xls", header=3)
        url = "https://www.googleapis.com/books/v1/volumes"
        API_KEY = "AIzaSyB3pCR8ZU9agPrlllVt0t8eoxgC6NyXuXY"

        for titulo, autor in zip(df["TÍTULO"], df["AUTOR(A)"]):
            if pd.isna(titulo): continue

            titulo_limpo = re.split(r'\d+ª?\s*Ed|\s+\d+Ed|/', str(titulo))[0].strip()
            autor_str = str(autor).strip() if not pd.isna(autor) else ""

            livros_no_banco = Livro.objects.filter(
                Q(titulo__icontains=titulo_limpo) & Q(autor=autor_str) &
                (Q(sinopse__isnull=True) | Q(sinopse="") | Q(sinopse="Sinopse não disponível."))
            )

            if not livros_no_banco.exists():
                self.stdout.write(f"Pulando: {titulo} (Já tem sinopse ou não está no banco)")
                continue

            titulo_busca = titulo_limpo
            params = {"q": f'intitle:{titulo_busca}+inauthor:{autor_str}', "maxResults": 1, "key": API_KEY}

            try:
                response = requests.get(url, params=params, timeout=10)

                if response.status_code == 429:
                    self.stdout.write(self.style.WARNING("Cota da API esgotada (429). Encerrando..."))
                    break

                if response.status_code == 503:
                    self.stdout.write(f"Aguardando API (503)...")
                    time.sleep(30)
                    response = requests.get(url, params=params, timeout=10)

                response.raise_for_status()
                dados = response.json()

                if dados.get("items"):
                    sinopse = dados["items"][0]["volumeInfo"].get("description", "Sinopse não disponível.")
                    livros_no_banco.update(sinopse=sinopse)
                    self.stdout.write(self.style.SUCCESS(f"Sinopse adicionada: {titulo}"))
                else:
                    livros_no_banco.update(sinopse="Sinopse não disponível.")
                    self.stdout.write(f"Não encontrado na API: {titulo}")

                time.sleep(1.5)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Erro em {titulo}: {e}"))
                time.sleep(5)