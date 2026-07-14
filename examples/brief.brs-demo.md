# Brief compartilhado — painel de automações BR Supply

## 1. Problema

- Produto/tela: painel interno de acompanhamento de automações.
- Problema atual: o time precisa identificar rapidamente o que está operando, parado ou exigindo revisão.
- Resultado esperado: uma tela única, clara e operacional.

## 2. Usuário e contexto

- Quem usa: analistas internos da BR Supply.
- Onde usa: notebook corporativo, principalmente em 1366×768.
- Frequência: várias vezes ao dia.
- Principal decisão: saber qual automação precisa de ação agora.

## 3. Dados reais de demonstração

- 12 automações ativas.
- 8 operando normalmente.
- 2 aguardando entrada.
- 1 em alerta.
- 1 parada.
- Campos por linha: cliente, processo, última execução, duração, status e próxima ação.
- Estados obrigatórios: carregando, vazio, normal, alerta, erro e pausado.

## 4. Requisitos não negociáveis

1. Tabela ou fila principal deve caber sem rolagem horizontal em 1366×768.
2. Status deve usar texto e cor.
3. A ação mais importante deve ser evidente em menos de cinco segundos.

## 5. Marca e linguagem

- Tema: BRS Control Room fornecido pelo IArena.
- Idioma: português simples.
- Evitar: jargão sem explicação e frases publicitárias.

## 6. Restrições técnicas

- HTML autocontido, sem dependências e sem build.
- Pode usar JavaScript inline apenas para demonstrar filtros e navegação.
- Não usar dados, nomes de clientes ou credenciais reais.

## 7. Fora de escopo

- Autenticação.
- Integração com backend.
- Alteração de automações reais.

## 8. Critério de pronto

- Abre diretamente no navegador.
- Mostra todos os estados pedidos.
- Permite localizar rapidamente o item em alerta ou parado.
