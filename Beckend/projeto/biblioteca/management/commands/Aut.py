from django.core.management.base import BaseCommand
import pandas as pd
import requests
import time

from biblioteca.models import Livro


class Command(BaseCommand):
    help = "Busca sinopses na Google Books API e salva no banco"

    def handle(self, *args, **options):
        df = pd.read_excel("biblioteca/management/commands/Livros.xls", header=3)
        url = "https://www.googleapis.com/books/v1/volumes"

        print("Colunas encontradas:", df.columns.tolist())
        
        for titulo, autor in zip(df["TÍTULO"], df["AUTOR(A)"]):
            if pd.isna(titulo):
                Pass

            params = {
                "q": f'intitle:{titulo}+inauthor:{autor}',
                "maxResults": 1,
            }

            try:
                response = requests.get(
                    url,
                    params=params,
                    timeout=10
                )
                response.raise_for_status()

                dados = response.json()

                if not dados.get("items"):
                    self.stdout.write(
                        self.style.WARNING(
                            f"Nenhum resultado encontrado: {titulo}"
                        )
                    )
                    continue

                info = dados["items"][0]["volumeInfo"]
                sinopse = info.get(
                    "description",
                    "Sinopse não disponível."
                )

                Livro.objects.update_or_create(
                    titulo=titulo,
                    autor=autor,
                    defaults={
                        "sinopse": sinopse
                    }
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Salvo: {titulo}"
                    )
                )

            except requests.RequestException as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Erro ao consultar '{titulo}': {e}"
                    )
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Erro ao salvar '{titulo}': {e}"
                    )
                )

            time.sleep(1.5)