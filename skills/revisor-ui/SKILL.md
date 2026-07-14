---
name: revisor-ui
description: Revisa variantes de interface depois da geração, separando problemas funcionais de preferência estética. Avalia clareza, requisitos, acessibilidade, responsividade, consistência, viabilidade e esforço de implementação.
license: MIT
---

# Revisor de UI

Esta skill é de auditoria. Não deve competir como criadora na mesma rodada; entra depois que todas as variantes terminarem.

## Processo

1. Leia o brief e os critérios comuns.
2. Revise cada variante sem alterar o arquivo.
3. Registre achados vinculados ao elemento exato.
4. Classifique cada achado como `bloqueador`, `problema`, `melhoria` ou `preferência`.
5. Aponte evidência, impacto no usuário e correção sugerida.
6. Destaque padrões convergentes entre variantes.
7. Estime esforço relativo: baixo, médio ou alto, explicando dependências.

## Checklist

- Fluxo e próxima ação compreensíveis.
- Requisitos e dados do brief presentes.
- Estados vazios, erro, carregamento e sucesso.
- Texto em linguagem de negócio.
- Contraste, foco, teclado e rótulos.
- Layout em telas menores e conteúdo longo.
- Consistência de cores, ícones, tabela, botões e espaçamento.
- Componentes e efeitos tecnicamente realistas.
- Complexidade e dependências justificadas.

## Formato de comentário

```text
[revisor IA] problema — <elemento/trecho>
Evidência: <o que aparece>
Impacto: <efeito no usuário>
Correção: <mudança concreta>
```

Não escolha vencedor apenas pela aparência. O voto humano e o atendimento ao problema têm prioridade.
