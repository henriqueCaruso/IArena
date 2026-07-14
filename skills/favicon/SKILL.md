---
name: favicon
description: Cria um favicon SVG pequeno, distinto e coerente com a identidade da interface; garante título e link de favicon no HTML. Use em protótipos, dashboards, portais e páginas autocontidas.
license: MIT
---

# Favicon

## Contrato

1. Gere SVG autocontido com `viewBox="0 0 32 32"`.
2. Use no máximo três formas e duas cores principais.
3. Garanta leitura em 16×16: sem texto longo, traço fino ou detalhe ornamental.
4. Diferencie o produto por símbolo ou monograma, não por um ícone genérico de gráfico.
5. Use cantos `rx="7"` quando houver base quadrada.
6. Inclua um `<title>` no SVG e o `<link rel="icon">` no HTML.
7. Não dependa de arquivo externo em uma variante IArena; prefira data URI ou SVG inline.

## Validação

- O símbolo continua reconhecível em uma aba pequena.
- Cor e forma não confundem o produto com outra ferramenta do mesmo ecossistema.
- O favicon abre no arquivo HTML cru, fora do chrome da galeria.
