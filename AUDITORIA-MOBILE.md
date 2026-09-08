# Nalu Poke · auditoria mobile

Feita em 8 de setembro de 2026, em iPhone emulado 390x844, DPR 2, com CPU e rede
estranguladas. Tudo abaixo foi medido, não estimado.

Lighthouse mobile: performance 97 · acessibilidade 96 · boas práticas 96 · SEO 100
LCP 2,4s · CLS 0,013 · TBT 20ms

O site não está lento nem mal construído. O que está quebrado é layout e contraste,
e quase tudo vem de três causas repetidas.

---

## 1. Quebrado de verdade

### 1.1 A navegação de baixo some quando a barra do navegador está visível · CORRIGIDO
`.dock` é a nav principal do site. Medido antes da correção: `top: 850px`,
`bottom: 897px`, área visível `844px`. Ficava 6px abaixo do que a pessoa enxerga.

A causa é `position:fixed; bottom:12px` ancorando na viewport de **layout**, que
no celular é mais alta (909px) do que a **visível** (844px) enquanto a barra de
endereço está aparecendo. Ou seja: o dock aparecia depois de rolar para baixo, com
a barra recolhida, e sumia sempre que ela voltava, inclusive na carga da página.

No desktop as duas viewports são iguais, por isso nunca deu problema lá.

**Correção aplicada:** ancoragem em `100dvh`, que acompanha a área visível.
`top:calc(100dvh - var(--dock-gap))` com `transform:translate(-50%,-100%)`, e
`bottom` como caminho de retorno para quem não tem `dvh`. Medido depois:
785–832, dentro dos 844.

### 1.2 Os ingredientes decorativos cobrem texto · CORRIGIDO
Sete colisões medidas. A causa é uma só: `.side-fl` e `.fl` têm `z-index:1` e os
cards e títulos ficam em `z-index:auto`, no mesmo contexto de empilhamento. A
decoração ganha.

| Ingrediente | Cobre | Área coberta |
|---|---|---|
| salmão | título "Pega essa onda" | 102x29 px |
| salmão | título e texto do card Delivery | 68x37 px |
| abacate | título e texto do card Retirada | 53x49 px |
| edamame | texto do passo 2, "ou ceviche" some | 55x23 px |
| pepino | título do hero | 12x19 px |

O caso mais visível: na seção de pedido, o salmão cobre o **P** de "Pega", e a
frase passa a ler "EGA ESSA ONDA".

**Correção aplicada:** em vez de mexer na camada da decoração, subi o conteúdo.
`position:relative; z-index:2` em `.build__grid`, `.order__cards`,
`.section-title` e `.section-sub`. As sete colisões foram para zero de uma vez, e
os ingredientes continuam aparecendo, agora por trás. Medido depois: 0 colisões.

### 1.3 A barra do topo passa por cima do conteúdo
`.topbar` é `position:fixed`, tem 73px de altura e **fundo transparente**. Ela não
some, não ganha fundo ao rolar, e não empurra o conteúdo.

Em 4 das 9 telas capturadas ela fica em cima de texto corrido e o torna ilegível:
some "mix de folhas" no passo 1, some "nalu, que" no bloco Sobre, e o logo branco
desaparece sobre as seções claras.

### 1.4 Rolagem horizontal de 31px
`scrollWidth` 421 contra viewport de 390. Seis elementos estouram a direita:

| Elemento | Estoura |
|---|---|
| cebola (hero) | 75px |
| pepino (hero) | 42px |
| edamame (Monte o seu) | 30px |
| abacate (hero) | 27px |
| abacate (Pedir) | 24px |
| bowl do hero | 14px |

`body{overflow-x:hidden}` não resolve porque quem rola é o `html`. Os laterais
usam `--x: calc(100vw - 90px)` com largura fixa, o que garante estouro em tela
estreita.

### 1.5 A galeria de polaroids some abaixo de 1024px · CORRIGIDO
As cinco fotos do bloco Sobre não apareciam. Sobravam só as tarjas brancas com a
fita e a legenda, sobrepostas umas nas outras.

A galeria tinha **largura zero**. Medido: `.about__gallery` com `width: 0px`,
cards de 28px (que é só o padding de 14+14) e imagens em `0x0`, apesar de as
imagens carregarem certo (`naturalWidth` 480, `complete: true`).

A causa é sutil: `margin: 0 auto` num item de grid cujos filhos são **todos**
`position:absolute`. Sem nenhum filho no fluxo, o conteúdo mede zero, as margens
automáticas colapsam a caixa, e ela fica com 0 de largura. Como as fotos são
posicionadas em porcentagem dessa caixa, todas viram zero também.

Só acontecia abaixo de 1024px, onde a regra `margin:0 auto` entra. Acima disso o
item estica no track do grid e funciona, e é por isso que o desktop estava intacto.

**Correção aplicada:** `width:min(100%,480px); margin-inline:auto` no lugar de
`max-width` com `margin:0 auto`. Largura explícita não depende do conteúdo.
Medido depois: galeria 342px, polaroids de 126 a 154px.

### 1.6 A onda entre Sobre e Depoimentos não fecha o ciclo · CORRIGIDO
A faixa de onda que separa a seção bege da azul sumia no meio da animação e
deixava uma emenda reta.

Medido: a seção tem 390px, o pseudo-elemento tinha `width:200%` (780px), o ladrilho
de fundo tem 1200px e a animação desliza `translateX(-1200px)`. Como o elemento é
mais estreito do que o próprio deslocamento, no fim do ciclo ele está inteiro fora
da tela, de -1200 a -420, e não sobra onda nenhuma cobrindo a seção.

**Correção aplicada:** `width: calc(100% + 1200px)`. Assim, depois de deslizar um
ladrilho inteiro, ainda sobra largura suficiente para cobrir a seção, e a emenda
cai sempre fora da área visível. Verificado em seis amostras ao longo dos 16s do
ciclo, todas com onda contínua.

### 1.7 "ONDAS BOAS" é cortado pelo primeiro depoimento
`.reviews__grid` tem `margin-top:-1.5rem`, pensado para o desktop onde o título
é largo. No mobile o título empilha em duas linhas e o card sobe 24px por cima
da palavra "BOAS".

### 1.8 As pills de sabor quebram 4+1
Cinco sabores, duas linhas, com "Hilo" sozinho na segunda. Fica torto e parece erro.

---

## 2. Contraste

Seis falhas de AA, medidas com a cor computada contra o fundo real de cada seção
(o fundo muda por rolagem, então medir parado no topo dá número errado).

| Elemento | Medido | Mínimo | Onde |
|---|---|---|---|
| `.footer__copy` | 2,31:1 | 4,5 | rodapé laranja |
| `.rev cite` | 2,42:1 | 4,5 | nomes dos depoimentos |
| `.ocard p` | 2,44:1 | 4,5 | Delivery e Retirada |
| `.footer__links a` | 2,58:1 | 4,5 | links do rodapé |
| `.words__intro` | 3,97:1 | 4,5 | "Montado na hora" |
| `.rev p` | 4,10:1 | 4,5 | texto dos depoimentos |

**A causa de base é a cor da marca, não a opacidade.** Branco **puro** sobre o
laranja `#FF6A00` dá **3,82:1**, ou seja, nenhum texto de corpo em branco passa
nesse fundo, com ou sem transparência. Só título grande passa, porque o mínimo
cai para 3:1.

Saídas possíveis, em ordem do que eu faria:

1. Texto de corpo em `#1A1410` sobre o laranja, que dá 6,35:1. O laranja continua
   dominante e a leitura fica confortável.
2. Escurecer o laranja só onde há texto pequeno, para algo como `#E85D00`.
3. Manter branco e aceitar que o rodapé e os cards de pedido reprovem.

O `.rev` ainda tem um agravante: o card é `rgba(255,247,232,.07)` sobre azul, quase
invisível. O card parece não existir.

---

## 3. Alvos de toque

Catorze elementos abaixo dos 44px recomendados.

| Elemento | Tamanho |
|---|---|
| links do rodapé | 23px de altura |
| logo do topo | 25px |
| pills de sabor | 31px |
| links do dock | 35px |

As pills de sabor são o caso que mais dói: são o controle principal da seção de
sabores e estão em 31px.

---

## 4. Conteúdo de rascunho que está no ar

Isto não é visual, mas está publicado e é o mais urgente da lista.

- **`[A PREENCHER: endereço da loja]`** aparece na seção Retirada, no ar.
- **"Ver no mapa"** aponta para `href="#"`.
- **WhatsApp é `5500000000000`**, número de espaço reservado. Todo botão de pedido
  leva para um número que não existe.
- **Os três depoimentos são inventados**, assinados por "Marina C.", "Pedro A." e
  "Júlia F.". O próprio HTML carrega o comentário
  `[A PREENCHER: trocar por avaliações reais do iFood/Google antes de publicar]`.
  Depoimento fabricado com nome de pessoa é risco, não só pendência.
- **Instagram** aponta para `instagram.com`, sem perfil.
- **Sem favicon.** O `/favicon.ico` dá 404 e é o único erro de console do site.

---

## 5. Já corrigido

- 1.1 dock ancorado em `100dvh`
- 1.2 conteúdo acima da decoração, sete colisões zeradas
- 1.5 galeria de polaroids com largura explícita
- 1.6 onda com largura suficiente para fechar o ciclo

Fora da lista de defeitos, a pedido: os quatro cards de "Monte o seu" ganharam as
cores dos sabores, do quente para o frio (Maui `#FFC400`, Hilo `#B6FF00`, Kona
`#00D6A3`, Oahu `#00B8D9`), com o numeral invertido para preto sobre branco.
Contraste de 5,33:1 a 15,02:1, todos acima do mínimo.

O bloco Sobre foi reduzido à frase. Saíram o título "Onda boa, desde a primeira" e
os dois parágrafos; ficaram só a citação e a assinatura da Ana Luiza. A citação
cresceu de 1,25rem fixo para `clamp(1.35rem, .9rem + 1.9vw, 2.35rem)`, porque
agora ela carrega a seção sozinha. Duas regras de CSS que apontavam para o título
removido foram apagadas junto.

## 6. O que falta, na ordem

1. Tirar do ar o que é falso ou vazio: depoimentos, endereço, WhatsApp, mapa,
   Instagram. É o único item da lista que expõe o cliente.
2. Conter o estouro horizontal de 31px na origem.
3. Dar fundo à barra do topo ao rolar, ou soltá-la.
4. Resolver o contraste, decidindo antes a regra do texto sobre laranja.
5. Ajustar o recuo do bloco de depoimentos e a quebra das pills de sabor.
6. Subir os alvos de toque para 44px.
7. Adicionar favicon.

Nada disso é reescrita. É um dia de trabalho, e o site continua com a mesma cara.
