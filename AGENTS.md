# Contrato para agentes

## Comece aqui

Ao receber um prompt IArena, leia somente:

1. o brief indicado;
2. os critérios indicados;
3. o template indicado;
4. a skill ou os links indicados.

Não explore o repositório inteiro. Não leia arquivos de outros competidores.

## Saída

- Escreva apenas o arquivo solicitado.
- Em modo galeria, produza HTML autocontido com CSS/JS inline.
- Não instale pacotes, não rode build, não faça deploy e não altere o produto real.
- Preserve dados, estados, termos e restrições do brief.
- Não invente regra de negócio para preencher a tela.
- Use o template para evitar boilerplate quando ele for suficiente.

## Metadado obrigatório

Finalize o HTML com:

```html
<!-- iarena: {"competidor":"...","modelo":"...","skills":[],"decisoes":[],"suposicoes":[]} -->
```

## Isolamento

Uma variante não pode ver outra antes do encerramento da rodada. Revisores e sintetizadores só entram depois que todas as saídas estiverem prontas.

## Papéis

- Criador gera alternativa.
- Skill de marca restringe identidade e linguagem.
- Revisor comenta sem editar.
- Sintetizador usa finalistas e feedback para uma nova rodada.

Não trate auditoria e criação como competidores equivalentes.
