# Guia operacional do IArena

## Objetivo

Usar várias IAs ou skills para explorar soluções diferentes sem perder comparabilidade, contexto ou controle humano. O IArena não escolhe sozinho: ele organiza geração, revisão, voto e síntese.

## Quando usar

- comparação de layouts, dashboards, portais ou componentes;
- comparação de planos técnicos e arquiteturas;
- teste A/B de prompts, modelos ou skills;
- escolha entre textos, fluxos e protótipos;
- validação de uma skill nova contra uma baseline.

Não use para tarefas em que uma única resposta determinística e testável resolve o problema com menor custo.

## Processo padrão

### 1. Defina a variável

Mude uma coisa por variante: skill, modelo, prompt ou direção. Se modelo e skill mudarem juntos, registre isso claramente e não atribua o ganho a apenas um deles.

### 2. Feche o brief

Preencha `templates/brief-design.pt-BR.md` com fatos, dados reais, restrições e critérios de pronto. Não deixe um competidor inferir mais contexto que outro.

### 3. Escolha os papéis

- `controle`: baseline sem skill;
- `criação`: produz alternativas independentes;
- `marca`: aplica design system e linguagem;
- `acabamento`: complementa uma criadora;
- `qualidade`: revisa todas após a geração;
- `síntese`: produz a rodada final;
- `meta`: cria ou melhora skills.

Uma primeira rodada equilibrada costuma usar: baseline, uma criadora ampla, uma variante de marca, uma combinação e uma alternativa independente.

### 4. Gere o scaffolding

```bash
node scripts/nova-competicao.mjs --config=meu-config.json
```

O gerador cria prompts com o mesmo contrato e saídas isoladas. Entregue um prompt por agente ou sessão.

### 5. Rode os competidores

Cada agente deve:

- ler apenas os quatro arquivos indicados no prompt;
- não abrir outputs concorrentes;
- escrever um único HTML autocontido;
- não instalar, compilar, testar o produto real ou fazer deploy;
- registrar skill, modelo, decisões e suposições no comentário final.

### 6. Revise na galeria

Execute `node server.mjs`. Na galeria:

- selecione texto para comentar;
- use o modo de elemento para ícones, áreas vazias ou componentes sem texto;
- use nota geral para feedback da página inteira;
- registre preferência e também problemas concretos;
- vote após revisar todas as opções.

### 7. Rode uma auditoria comum

Aplique `revisor-ui` ou `web-design-guidelines` a todas as variantes. O revisor deve usar o mesmo brief e os mesmos critérios, sem alterar os arquivos.

### 8. Faça a segunda rodada

Leve apenas as duas melhores propostas. Use `sintese-vencedora` com:

- brief original;
- variantes finalistas;
- comentários copiados do IArena;
- voto;
- achados do revisor.

Crie no máximo duas sínteses. Ambas devem resolver o fluxo completo, não apenas combinar detalhes visuais.

### 9. Implemente fora da arena

A variante vencedora é uma referência. Antes de alterar o produto real:

1. mapeie decisões para arquivos e componentes existentes;
2. identifique o que é reskin e o que é feature nova;
3. preserve comportamento e dados reais;
4. implemente em etapas testáveis;
5. faça nova revisão visual e técnica.

## Estratégia de economia

- Use 3 a 5 competidores na primeira rodada; acima disso, o ganho marginal tende a cair.
- Sempre inclua baseline quando a pergunta for “esta skill vale o custo?”.
- Use o mesmo modelo para isolar o efeito da skill.
- Prefira links e arquivos a prompts longos.
- Comece com o template econômico.
- Não envie histórico de conversa, repositório inteiro ou transcrições aos competidores.
- Consolide feedback antes da rodada 2.
- Use modelos mais fortes apenas para síntese ou casos em que a baseline falhou claramente.

## Exemplo de matriz

| Variante | Papel | Variável |
|---|---|---|
| Baseline | controle | sem skill |
| frontend-design | criação | direção estética |
| ui-brs | marca | consistência interna |
| frontend-design + ui-brs + favicon | combinação | estética + padrão + acabamento |
| UI/UX Pro Max | criação | direção externa independente |

Depois, use `revisor-ui` em todas e `sintese-vencedora` nas duas finalistas.

## Critérios de sucesso

Uma competição foi útil quando:

- as variantes são realmente comparáveis;
- o feedback aponta elementos e impactos concretos;
- o vencedor resolve melhor o problema, não apenas parece mais bonito;
- a segunda rodada mantém rastreabilidade das decisões;
- o custo de contexto e geração é registrado;
- a implementação real começa com um plano, não copiando cegamente o mockup.
