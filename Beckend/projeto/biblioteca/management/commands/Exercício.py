import pandas as pd

import requests

url = "https://serpapi.com/search"

livros = pd.read_excel("Livros.xls", header=3)
print(livros.columns)

for livro in livros["TÍTULO"].iloc[1:2]:
    params = {"q": f"sinopse do livro{livro}", "api_key": "99e44637976e6e38eae54b7a95e37bc58fb8d4b5ad3f2d42547bb9da4df0898d"}
    pagina = requests.get(url, params=params)
    pagina1 = pagina.json()
    sinopses = 
    print(sinopses)

    